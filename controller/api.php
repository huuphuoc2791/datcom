<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');

include_once 'common/autoload.php';


$postedData = json_decode(file_get_contents('php://input'));

$methodName = $postedData->methodName;

if ($methodName == 'UpdateMenuByDate') {
    UpdateMenuByDate();
} elseif ($methodName == 'GetUsersByGroupCode') {

} elseif ($methodName == 'OrderForUser') {

} elseif ($methodName == 'RemoveOrderForUser') {

} else {

}

function UpdateMenuByDate()
{
    $extraPrice = '25000';
    $common = new CommonFunction();
    $day = $common->convertDayOfWeek();
    $menuItems = $this->postedData->data->menuItems;
    foreach ($menuItems as $item) {
        $menu = new Menu();
        $menu->insert($item->menuName, $day, $item->price, $extraPrice);
    }

}

function GetUsersByGroupCode($groupCode)
{
    $user = new User();
    return $user->findUsersByGroupCode($groupCode);

}

function OrderForUser()
{

}

function RemoveOrderForUser()
{

}

