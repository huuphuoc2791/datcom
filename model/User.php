<?php

/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 10/10/16
 * Time: 20:25
 */
class User
{
    public $userName;
    public $fullName;
    public $email;
    public $phone;

    /**
     * @param $table
     */
    public function insert($userName, $fullName, $groupId, $email, $phone)
    {
        $db = new DBHelper();
        $query = "insert into users(username, fullname,group_id, email, phone) VALUES ('$userName','$fullName','$groupId','$email','$phone')";
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

    public function update($id, $userName, $fullName, $groupId, $email, $phone)
    {
        $db = new DBHelper();
        $query = "UPDATE users SET username = '$userName',fullname ='$fullName',group_id = '$groupId',email='$email',phone='$phone' WHERE id=$id";
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

    public function findByGroupId($groupId)
    {
        $db = new DBHelper();
        $query = "SELECT *,fullname fullName FROM users WHERE group_id = '$groupId'";
        $result = $db->executeStatement($query);
        return $result;
    }

    public function updateFullNameById($id, $fullName)
    {
        $db = new DBHelper();
        $query = "UPDATE users SET fullname ='$fullName' WHERE id=$id";
        $db->executeStatement($query);
    }

    public function updateFullNameByFullNameKd($fullnameKd, $fullname)
    {
        $db = new DBHelper();
        $query = "UPDATE users SET fullname = '$fullname' WHERE fullname='$fullnameKd'";
        $db->executeStatement($query);
    }

    public function updateDataById($id,$fullname,$email,$phone) {
        $db = new DBHelper();
        $query = "UPDATE users SET fullname = '$fullname', email='$email', phone='$phone' WHERE id=$id";
        $db->executeStatement($query);

    }

    public function findByUsername($username)
    {
        $db = new DBHelper();
        $query = "select * from users WHERE username = '$username'";
        $result = $db->executeStatement($query);
        return $result;

    }


}