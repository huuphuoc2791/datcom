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

//support get method
if (empty($methodName)) {
    //try the get
    $methodName = CommonFunction::getGetValue('methodName');
}

$returnMessage = new ResponseMessage();
if ($methodName == 'UpdateMenuByDate') {
    UpdateMenuByDate();
} elseif ($methodName == 'GetUsersByGroupCode') {
    GetUsersByGroupCode();

} elseif ($methodName == 'OrderForUser') {
    OrderForUser();
} elseif ($methodName == 'ClearAllOderByGroupCode') {
    ClearAllOderByGroupCode();
} elseif ($methodName == 'CheckGroupPassword') {
    CheckGroupPassword();
}
else if ($methodName == 'test') {
    test();
}

function test() {
    var_dump('test');
}

//change: the menu return has one more column call short_food_name
//change: menu is get from server side instead
function UpdateMenuByDate() {

    global $returnMessage;
    global $postedData;
    $extraPrice = '25000';
    $price = '30000';
    $day = CommonFunction::convertDayOfWeek();
    $menuItems = $postedData->data->menuItems;

    //change: do not use menu from client, use from server
    $menuNames = (new MenuController())->GetMenuFromComNhaViet();

    $menuItems = array();
    foreach ($menuNames as $menuName) {
        $item = new stdClass();
        $item->menuName = $menuName;
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

        $menuRows = $menu->findByFoodName($item->menuName);
        $result = array_merge($result, $menuRows);
    }

    //    $result = $menu->findByDay($day);
    //    $result = $menu->findAll();

    foreach ($result as &$menuItem) {
        $menuItem['short_food_name'] = CommonFunction::splitWordToSMS($menuItem['food_name']);
    }

    if (empty($result)) $result = array();
    $returnMessage->data->menuItems = $result;
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