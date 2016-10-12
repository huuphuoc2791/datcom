<?php

/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 10/10/16
 * Time: 20:25
 */

include '../common/DBHelper.php';

class User
{
    public $userName;
    public $fullName;
    public $email;
    public $phone;

    /**
     * @param $table
     */
    public function insert($userName, $fullName, $email, $phone)
    {
        $db = new DBHelper();
        $query = "insert into users(username, fullname, email, phone) VALUES ($userName,$fullName,$email,$phone)";
        $db->executeStatement($query);
    }

    /**
     * @param $id
     */
    public function delete($id)
    {
        $db = new DBHelper();
        $query = "delete from users WHERE id = $id";
        $db->executeStatement($query);
    }

    public function update($id, $userName, $fullName, $email, $phone)
    {
        $db = new DBHelper();
        $query = "UPDATE users SET username = $userName,fullname =$fullName,email=$email,phone=$phone WHERE id=$id";
        $db->executeStatement($query);
    }

    public function findById($id)
    {
        $db = new DBHelper();
        $query = "select * from users WHERE id =$id";
        $result = $db->executeStatement($query);
        return $result;

    }

    public function findAll()
    {
        $db = new DBHelper();
        $query = "select * from users";
        $result = $db->executeStatement($query);
        return $result;
    }

    public function findUsersByGroupCode($groupCode)
    {
        $db = new DBHelper();
        $query = "select * from users WHERE group_code = $groupCode";
        $result = $db->executeStatement($query);
        return $result;
    }
}