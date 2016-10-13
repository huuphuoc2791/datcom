<?php

/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 10/10/16
 * Time: 20:26
 */


class Group
{
    public $name;
    public $code;

    public function insert($name, $code)
    {
        $db = new DBHelper();
        $query = "insert into `group`(name,code) VALUES ('$name','$code')";
        $db->executeStatement($query);
    }

    /**
     * @param $id
     */
    public function delete($id)
    {
        $db = new DBHelper();
        $query = "delete from `group` WHERE id = $id";
        $db->executeStatement($query);
    }

    public function update($id, $name, $code)
    {
        $db = new DBHelper();
        $query = "UPDATE `group` SET name = '$name',code = '$code' WHERE id = $id";
        $db->executeStatement($query);
    }

    public function findById($id)
    {
        $db = new DBHelper();
        $query = "select * from `group` WHERE id =$id";
        $result = $db->executeStatement($query);
        return $result;

    }

    public function findByGroupCode($groupCode)
    {
        $db = new DBHelper();
        $query = "select * from `group` WHERE code = '$groupCode'";
        $result = $db->executeStatement($query);
        return $result;
    }

    public function findAll()
    {
        $db = new DBHelper();
        $query = "select * from `group`";
        $result = $db->executeStatement($query);
        return $result;
    }

}