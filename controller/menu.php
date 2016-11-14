<?php
/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 11/14/16
 * Time: 21:29
 */
function UpdateMenuByDate()
{

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