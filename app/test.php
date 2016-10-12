<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../'. PATH_SEPARATOR . '../../../');

include 'common/autoload.php';

$menu = new Menu();
$rows = $menu->findAll();

foreach ($rows as $row) {
    var_dump($row);
}