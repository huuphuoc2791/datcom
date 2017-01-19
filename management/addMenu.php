<?php
/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 12/1/16
 * Time: 16:20
 */

ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');
header("Access-Control-Allow-Origin: *"); //add this header for CORS
header("Access-Control-Allow-Headers: Content-Type"); //add this header for CORS

include_once '../common/autoload.php';

function addMenu($foodName, $price, $priceExtra)
{
    $menu = new Menu();
    $date = CommonFunction::convertDayOfWeek();
    $menu->insert($foodName, $date, $price, $priceExtra);
}


$foodName = CommonFunction::getPostValue('foodName');
$price = CommonFunction::getPostValue('price');
$priceExtra = CommonFunction::getPostValue('priceExtra');
if($foodName!=null){
    addMenu($foodName, $price, $priceExtra);
}
header('Location: '.ROOT_URL.'/addmenu');
?>
