<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');
date_default_timezone_set("Asia/Ho_Chi_Minh");
header("Access-Control-Allow-Origin: *"); //add this header for CORS
header("Access-Control-Allow-Headers: Content-Type"); //add this header for CORS

include_once 'common/autoload.php';




$postedData = json_decode(file_get_contents('php://input'));

$methodName = '';
if (isset($postedData->methodName)) {
    $methodName = $postedData->methodName;
}

//support get method or original Post method
if (empty($methodName)) {
    $methodName = CommonFunction::getPostValue('methodName');
    if (empty($methodName)) {
        //try the get
        $methodName = CommonFunction::getGetValue('methodName');
    }
}



$returnMessage = new ResponseMessage();
if ($methodName == 'UpdateMenuByDate_FromComNhaViet') {
    UpdateMenuByDate_FromComNhaViet();
} elseif ($methodName == 'GetUsersByGroupCode') {
    GetUsersByGroupCode();

} elseif ($methodName == 'GetMenuOfToday') {
    GetMenuOfToday();

} elseif ($methodName == 'OrderForUser') {
    OrderForUser();
} elseif ($methodName == 'ClearAllOderByGroupCode') {
    ClearAllOderByGroupCode();
} elseif ($methodName == 'CheckGroupPassword') {
    CheckGroupPassword();
} elseif ($methodName == 'CheckGroupByGroupCode') {
    CheckGroupByGroupCode();
} elseif ($methodName == 'CheckGroupByOrderCode') {
    CheckGroupByOrderCode();
}
else if ($methodName == 'test') {
    test();
}
else {
    //check the original POST


}

function test() {
    echo 'Test/OK';
}

//change: the menu return has one more column call short_food_name
//change: menu is get from server side instead
//change: this function is not used to get the menu, use GetMenuOfToday instead. This function is to update the menu only
//this use original POST instead
function UpdateMenuByDate_FromComNhaViet() {
    global $returnMessage;
    global $postedData;
    $postedData = CommonFunction::getPostValue('data');
    $postedMenuItems = $postedData['menuItems'];
    //menuItem = array("menuName"=>'',"price")
    $extraPrice = '25000';
    $price = '30000';
    $day = CommonFunction::convertDayOfWeek();

    $menuItems = array();
    foreach ($postedMenuItems as $postedMenuItem) {
        $item = new stdClass();
        $item->menuName = $postedMenuItem["menuName"];
        $item->price = $price;
        $menuItems[] = $item;
    }

    $menu = new Menu();
    $menu->deleteAll();
    $result = array();
    $i = 1;
    foreach ($menuItems as $item) {
        $menu->insertAll($i, $item->menuName, $day, $item->price, $extraPrice);
        $i++;
    }
    echo json_encode($returnMessage);
}

function GetUsersByGroupCode() {
    global $returnMessage;
    global $postedData;
    $groupCode = $postedData->data->groupCode;
    $group = new Group();

    $groups = $group->findByGroupCode($groupCode);

    //check when no group on database --> return no users
    if (count($groups) <= 0) {
        $returnMessage->data->users = [];

        $returnMessage->data->code = 1; //no group is created with this group no
        echo json_encode($returnMessage);
        return;
    }
    $groupId = $groups[0]["id"];
    $user = new User();
    $result = $user->findByGroupId($groupId);
    foreach ($result as &$user) {
        $order = new Order();
        $userId = $user['id'];
        $orderList = $order->findByUserId($userId);
        $user['menuItems'] = $orderList;
    }

    $returnMessage->data->users = $result;

    $returnMessage->data->code = 0;
    echo json_encode($returnMessage);

}

function OrderForUser() {
    global $returnMessage;
    global $postedData;
    $order = new Order();
    $userId = $postedData->data->userId;
    $order->deleteByUserId($userId);
    $menuItems = $postedData->data->menuItems;
    foreach ($menuItems as $item) {
        $gui = CommonFunction::guid(true, false);
        $order->insert($gui, $userId, $item->menuId, !$item->isMainItem);
    }
    echo json_encode($returnMessage);


}

//function UpdateFullName()
//{
//    $fullNameListKd = array('Son 1', 'Son 2', 'Tao', 'Phuc', 'Dung', 'Minh', 'Phu', 'Loc', 'Phuoc', 'Han', 'Tanuj');
//    $fullNameList = array('Sơn 1', 'Sơn 2', 'Tảo', 'Phúc', 'Dũng', 'Minh', 'Phú', 'Lộc', 'Phước', 'Hân', 'Tanuj');
//    $user = new User();
//    for ($i = 0; $i < count($fullNameListKd); $i++) {
//        $fullnameKd = $fullNameListKd[$i];
//        $fullname = $fullNameList[$i];
//        $user->updateFullNameByFullNameKd($fullnameKd, $fullname);
//    }
//
//
////    $user->updateFullNameById($userId, $fullName);
//
//}

function ClearAllOderByGroupCode() {
    global $returnMessage;
    global $postedData;

    $groupCode = $postedData->data->groupCode;
    $group = new Group();

    $groups = $group->findByGroupCode($groupCode);

    //check when no group on database --> return no users
    if (count($groups) <= 0) {
        $returnMessage->data->code = 1; //no group is created with this group no
        $returnMessage->responseCode = 1; //no group is created with this group no
        echo json_encode($returnMessage);
        return;
    }
    $groupId = $groups[0]["id"];

    $order = new Order();
    $order->deleteAllByGroupId($groupId);

    echo json_encode($returnMessage);
}

function AddUserForGroup() {
    global $returnMessage;
    global $postedData;

    $groupCode = $postedData->data->groupCode;
    $posteduser = $postedData->data->user;
    $username = $posteduser->username;
    $fullName = $posteduser->fullname;
    $email = $posteduser->email;
    $phone = $posteduser->phone;
    $group = new Group();
    $groups = $group->findByGroupCode($groupCode);
    $groupId = $groups[0]["id"];
    $user = new User();
    $user->insert($username, $fullName, $groupId, $email, $phone);
    echo json_encode($returnMessage);
}

function UpdateUserForGroup() {
    global $returnMessage;
    global $postedData;

    $groupCode = $postedData->data->groupCode;

    $posteduser = $postedData->data->user;
    $id = $posteduser->id;
    $username = $posteduser->username;
    $fullName = $posteduser->fullname;
    $email = $posteduser->email;
    $phone = $posteduser->phone;
    $group = new Group();
    $groups = $group->findByGroupCode($groupCode);
    $groupId = $groups[0]["id"];
    $user = new User();
    $user->update($id, $username, $fullName, $groupId, $email, $phone);
    echo json_encode($returnMessage);
}

function CheckGroupPassword() {
    global $returnMessage;
    global $postedData;

    $groupCode = $postedData->data->groupCode;
    $password = $postedData->data->password;

    $password = Group::EncodePassword($password);
    $groupRows = (new Group())->findByGroupCodeAndPassword($groupCode, $password);

    $returnMessage->data->passwordMatched = !empty($groupRows);
    echo json_encode($returnMessage);
}
function CheckGroupByGroupCode() {
    global $returnMessage;
    global $postedData;

    $groupCode = $postedData->data->groupCode;

    $groupRows = (new Group())->findByGroupCode($groupCode);

    $returnMessage->data->found = !empty($groupRows);
    echo json_encode($returnMessage);
}
function CheckGroupByOrderCode() {
    global $returnMessage;
    global $postedData;

    $groupCode = $postedData->data->groupOrderCode;

    $groupRows = (new Group())->findByOrderCode($groupCode);

    if (!empty($groupRows)) {
        $returnMessage->data->Group = $groupRows[0];

        //clear password
        $returnMessage->data->Group['password'] = '';
    }
    $returnMessage->data->found = !empty($groupRows);
    echo json_encode($returnMessage);
}

function GetMenuOfToday() {
    global $returnMessage;
    global $postedData;
    $extraPrice = '25000';
    $price = '30000';
    $day = CommonFunction::convertDayOfWeek();


    //    $result = $menu->findByDay($day);
    //    $result = $menu->findAll();

    $menuRows = (new Menu())->findAll();

    foreach ($menuRows as &$menuItem) {
        $menuItem['short_food_name'] = CommonFunction::splitWordToSMS($menuItem['food_name']);
    }

    if (empty($menuRows)) $menuRows = array();
    $returnMessage->data->menuItems = $menuRows;
    echo json_encode($returnMessage);
}
