<?php

/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 10/10/16
 * Time: 20:25
 */
class Order
{
    public $userId;
    public $menuId;

    public function insert($gui, $userId, $menuId, $extraFood) {
        $db = new DBHelper();
        $query = "insert into `order`(gui,user_id,menu_id,extra_food) VALUES ('$gui','$userId','$menuId','$extraFood')";
        $db->executeStatement($query);
    }

    /**
     * @param $id
     */
    public function delete($id) {
        $db = new DBHelper();
        $query = "delete from `order` WHERE id =$id";
        $db->executeStatement($query);
    }

    public function update($id, $userId, $menuId, $extraFood) {
        $db = new DBHelper();
        $query = "UPDATE `order` SET user_id = '$userId',menu_id ='$menuId',extra_food = '$extraFood' WHERE id=$id";
        $db->executeStatement($query);
    }

    public function findById($id) {
        $db = new DBHelper();
        $query = "select * from `order` WHERE id = $id";
        $db->executeStatement($query);
    }

    public function findByUserId($userId) {
        $db = new DBHelper();
        $query = "select * from `order` WHERE user_id = $userId";
        $result = $db->executeStatement($query);
        return $result;
    }

    public function findAll() {
        $db = new DBHelper();
        $query = "select * from `order`";
        $result = $db->executeStatement($query);
        return $result;
    }

    public function deleteByUserId($userId) {
        $db = new DBHelper();
        $query = "delete from `order` WHERE user_id = '$userId'";
        $db->executeStatement($query);
    }

    public function deleteAll() {
        $db = new DBHelper();
        $query = "delete from `order`";
        $db->executeStatement($query);
    }

    public function deleteAllByGroupId($groupId) {
        $db = new DBHelper();
        $query = "delete from `order` WHERE exists(Select NULL from users where group_id = '$groupId' AND id = `order`.user_id)";
        $db->executeStatement($query);
    }

    public function writeLogOrder($deviceGuid, $userName, $groupCode, $mainMenuName, $subMenuNames) {
        $db = new DBHelper();
        $query = "insert into `order_logs`(device_guid,	order_date,order_time,user_name,group_code, main_menu_name, sub_menu_names) VALUES ('$deviceGuid',CURRENT_DATE() ,CURRENT_TIME(),'$userName','$groupCode','$mainMenuName','$subMenuNames')";

        $db->executeStatement($query);
    }

    public function getTodayLogOrderByGroupCode($groupCode) {
        $db = new DBHelper();
        $query = "select * from `order_logs` where group_code = '$groupCode' AND order_date = current_date ORDER BY device_guid, order_time asc";

        $result = $db->executeStatement($query);
        return $result;
    }

}