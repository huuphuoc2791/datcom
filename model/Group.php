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

    public function insert($code, $name, $hash)
    {
        $db = new DBHelper();
        $query = "insert into `group`(code, name, hash) VALUES ('$code','$name','$hash')";
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

    public function update($id, $name, $code, $hash)
    {
        $db = new DBHelper();
        $query = "UPDATE `group` SET name = '$name',code = '$code', hash = '$hash' WHERE id = $id";
        $db->executeStatement($query);
    }
    public function updateWithoutHash($id, $name, $code)
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

    public function findByGroupCodeAndHash($groupCode, $hash)
    {
        $db = new DBHelper();
        $query = "select * from `group` WHERE code = '$groupCode' AND hash = '$hash'";
        $result = $db->executeStatement($query);
        return $result;
    }

    public function updatePasswordByGroupId($id, $encodedPassword)
    {
        $db = new DBHelper();
        $query = "UPDATE `group` SET password = '$encodedPassword' WHERE id = $id";
        $db->executeStatement($query);
    }

    public static function EncodePassword($password) {
        return hash('sha1',hash('md5',$password));
    }

    public function findByGroupCodeAndPassword($groupCode, $password)
    {
        $db = new DBHelper();
        $query = "select * from `group` WHERE code = '$groupCode' AND password = '$password'";
        $result = $db->executeStatement($query);
        return $result;
    }

    public function updateHashByGroupId($id, $guid)
    {
        $db = new DBHelper();
        $query = "UPDATE `group` SET hash = '$guid' WHERE id = $id";
        $db->executeStatement($query);
    }
    public function updateOrderHashByGroupId($id, $guid)
    {
        $db = new DBHelper();
        $query = "UPDATE `group` SET order_code = '$guid' WHERE id = $id";
        $db->executeStatement($query);
    }
    public function findByOrderCode($orderCode)
    {
        $db = new DBHelper();
        $query = "select * from `group` WHERE order_code = '$orderCode'";
        $result = $db->executeStatement($query);
        return $result;
    }

}