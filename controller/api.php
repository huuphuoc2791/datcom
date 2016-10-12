<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../'. PATH_SEPARATOR . '../../../');

include_once 'common/autoload.php';


$methodName = '';
$foodName = '';
$postedData = json_decode(file_get_contents('php://input'));

$methodName = $postedData->methodName;

if ($methodName == 'UpdateMenuByDate') {
    UpdateMenuByDate();
}

function UpdateMenuByDate() {
    $postedData = json_decode(file_get_contents('php://input'));
    $menuItems = $postedData->data->menuItems;
//var_dump("menuItems",$postedData->data->menuItems);
//var_dump("data",$data);
    foreach ($menuItems as $item) {
        $foodNameAndPrice = $item->menuName . 'gia ' . $item->price;
        $menu = new Menu();
//        $menu->insert($item->menuName,'Thứ 4',$item->price,'25000');
        var_dump($foodNameAndPrice);
    }
//var_dump($data);
//foreach ($data as $item) {
//    $foodName = $item->menuName;
////    var_dump("Mon an: " . $foodName);
//    $price = $item->price;
////    var_dump("Gia: " . $price);
//
//    echo $foodName . " " . $price;
//    $menu = new Menu();
//    $menu->insert($foodName,'20',$price,'25000');
//}

}

