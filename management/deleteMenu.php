<?php
/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 12/1/16
 * Time: 17:21
 */
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../../../');
header("Access-Control-Allow-Origin: *"); //add this header for CORS
header("Access-Control-Allow-Headers: Content-Type"); //add this header for CORS

include_once 'common/autoload.php';


function deleteMenu()
{
    $menu = new Menu();
    $menu->deleteAll();
}
deleteMenu();
header('Location: http://datcom.localhost/addmenu');
die();