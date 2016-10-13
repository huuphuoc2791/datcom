<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../' . PATH_SEPARATOR . '../../'. PATH_SEPARATOR . '../../../');

include '../common/autoload.php';

$menu = new Menu();

//$id = $_GET['method'];
$rows = $menu->findAll();
$foodName ="food_name";
$dw = date( "w", $timestamp);
//var_dump($rows);
foreach ($rows as $row){
//    echo $row[$foodName];
}
$cm=new CommonFunction();

$day = $cm->convertDayOfWeek();

$gr = new Group();
$groupCode ='korrin';
$value = $gr->findByGroupCode($groupCode);
UpdateFullName();

function UpdateFullName()
{
    $postedData = json_decode(file_get_contents('php://input'));
    $userId = $postedData->data->userId;
    var_dump($postedData->data);
    $fullNameList = array('Sơn 1', 'Sơn 2', 'Tảo', 'Phúc', 'Dũng', 'Minh', 'Phú', 'Lộc', 'Phước', 'Hân', 'Tanuj');
    $user = new User();
    foreach ($fullNameList as $item) {
//        $user->updateById($userId, $item);
    }

}