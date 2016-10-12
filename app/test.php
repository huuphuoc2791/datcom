<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../'. PATH_SEPARATOR . '../../../');

include 'common/autoload.php';

$menu = new Menu();

//$id = $_GET['method'];
$rows = $menu->findAll();

var_dump($rows);
