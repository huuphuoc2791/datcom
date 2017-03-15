<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');

include_once '../common/autoload.php';

//this file might not be used any more because the function to load the menu of today does this
$MenuController = new MenuController();
$MenuController->CheckAndUpdateMenuForToday();

$returnMessage = $MenuController->LoadMenuForToday();
$index = 0;
foreach ($returnMessage->data->menuItems as &$menuItem) {
    $menuItem['food_name'] = CommonFunction::convert_vi_to_en($menuItem['food_name']);
}

echo json_encode($returnMessage);