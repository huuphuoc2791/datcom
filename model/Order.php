<?php

/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 10/10/16
 * Time: 20:25
 */


class Order
{
    public $groupCode;
    public $menuItemId;

    public function insert($groupCode, $menuId)
    {
        $db = new DBHelper();
        $query = "insert into order(group_code,menu_id) VALUES ($groupCode,$menuId)";
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

    public function update($id, $groupCode, $menuId)
    {
        $db = new DBHelper();
        $query = "UPDATE order SET group_code = $groupCode,menu_id =$menuId WHERE id=$id";
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

    public function addOrderForUser($groupCode, $userName, $menuId)
    {
        $db = new DBHelper();
        $group = new Group();
        $gr = $group->findByGroupCode($groupCode);
        $groupName = $gr["name"];
        $users = new User();
        $users->findAll();


        $query = "select * from order WHERE groupCode = $groupCode AND menu_id = $menuId";
        $result = $db->executeStatement($query);
        return $result;

    }

    public function removeOrderForUser($groupCode, $userName, $menuId)
    {
        $db = new DBHelper();
        $queryUser = "select * from users WHERE username = $userName";
        $query = "select * from order WHERE groupCode = $groupCode AND menu_id = $menuId";
        $result = $db->executeStatement($query);
        return $result;

    }

}