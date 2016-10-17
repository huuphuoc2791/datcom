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

$returnMessage = new ResponseMessage();
if ($methodName == 'UpdateMenuByDate') {
    UpdateMenuByDate();
} elseif ($methodName == 'GetUsersByGroupCode') {
    GetUsersByGroupCode();

} elseif ($methodName == 'OrderForUser') {
    OrderForUser();

} elseif ($methodName == 'ClearAllOderByGroupCode') {
    ClearAllOderByGroupCode();
}

//change: the menu return has one more column call short_food_name
function UpdateMenuByDate()
{
    global $returnMessage;
    global $postedData;
    $extraPrice = '25000';
    $day = CommonFunction::convertDayOfWeek();
    $menuItems = $postedData->data->menuItems;
    $menu = new Menu();
    $result = array();
    foreach ($menuItems as $item) {
        $menu->insert($item->menuName, $day, $item->price, $extraPrice);

        $result = array_merge($result,$menu->findByFoodName($item->menuName));
    }

//    $result = $menu->findByDay($day);
//    $result = $menu->findAll();

    foreach ($result as &$menuItem) {
        $menuItem['short_food_name'] = CommonFunction::splitWordToSMS($menuItem['food_name']);
    }

    $returnMessage->data->menuItems = $result;
    echo json_encode($returnMessage);
}

function GetUsersByGroupCode()
{
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

function OrderForUser()
{
    global $returnMessage;
    global $postedData;
    $order = new Order();
    $userId = $postedData->data->userId;
    $order->deleteByUserId($userId);
    $menuItems = $postedData->data->menuItems;
    foreach ($menuItems as $item) {
        $order->insert($userId, $item->menuId, $item->isMainItem);

    }
    echo json_encode($returnMessage);


}

function UpdateFullName()
{
    $fullNameListKd = array('Son 1', 'Son 2', 'Tao', 'Phuc', 'Dung', 'Minh', 'Phu', 'Loc', 'Phuoc', 'Han', 'Tanuj');
    $fullNameList = array('Sơn 1', 'Sơn 2', 'Tảo', 'Phúc', 'Dũng', 'Minh', 'Phú', 'Lộc', 'Phước', 'Hân', 'Tanuj');
    $user = new User();
    for ($i = 0; $i < count($fullNameListKd); $i++) {
        $fullnameKd = $fullNameListKd[$i];
        $fullname = $fullNameList[$i];
        $user->updateFullNameByFullNameKd($fullnameKd, $fullname);
    }


//    $user->updateFullNameById($userId, $fullName);

}

function ClearAllOderByGroupCode()
{
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
