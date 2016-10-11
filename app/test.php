<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../');

include '../common/autoload.php';
require '../model/Menu.php';

$menu = new Menu();
var_dump($menu);
$menu->findAll();

?>

