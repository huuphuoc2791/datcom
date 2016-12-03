<?php
/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 11/14/16
 * Time: 21:29
 */
function UpdateMenuByDate()
{

    $extraPrice = '25000';
    $price = '30000';
    $day = CommonFunction::convertDayOfWeek();
    $returnMessage = new ResponseMessage();

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
    $i = 1;
    foreach ($menuItems as $item) {
        $menu->insertAll($i, $item->menuName, $day, $item->price, $extraPrice);
        $i++;
    }

    $menuRows = (new Menu())->findAll();

    foreach ($menuRows as &$menuItem) {
        $menuItem['short_food_name'] = CommonFunction::splitWordToSMS($menuItem['food_name']);
    }

    if (empty($menuRows)) $menuRows = array();
    $returnMessage->data->menuItems = $menuRows;

    echo json_encode($returnMessage);
}

function deleteOrder()
{
    (new Order())->deleteAll();
}

ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');

include_once 'common/autoload.php';

UpdateMenuByDate();
deleteOrder();