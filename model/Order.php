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
    public $menuItemId;

    public function insert($userId, $menuId, $extraFood)
    {
        $db = new DBHelper();
        $query = "insert into order(user_id,menu_id,extra_food) VALUES ('$userId','$menuId','$extraFood')";
        $db->executeStatement($query);
    }

    /**
     * @param $id
     */
    public function delete($id)
    {
        $db = new DBHelper();
        $query = "delete from order WHERE id =$id";
        $db->executeStatement($query);
    }

    public function update($id, $userId, $menuId, $extraFood)
    {
        $db = new DBHelper();
        $query = "UPDATE order SET user_id = '$userId',menu_id ='$menuId',extra_food = '$extraFood' WHERE id=$id";
        $db->executeStatement($query);
    }

    public function findById($id)
    {
        $db = new DBHelper();
        $query = "select * from order WHERE id = $id";
        $db->executeStatement($query);
    }

    public function findAll()
    {
        $db = new DBHelper();
        $query = "select * from order";
        $result = $db->executeStatement($query);
        return $result;
    }
    

}