<?php

/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 10/10/16
 * Time: 20:25
 */
class User extends Model
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
        $db = new Database();
        $query = "insert into users(username, fullname, email, phone) VALUES (.$userName,.$fullName,.$email,.$phone)";
        $db->executeStatement($query);
    }

    /**
     * @param $id
     */
    public function delete($id)
    {
        $db = new Database();
        $query = "delete from users WHERE id =.$id";
        $db->executeStatement($query);
    }

    public function update($id, $userName, $fullName, $email, $phone)
    {
        $db = new Database();
        $query = "UPDATE users SET username = .$userName,fullname =.$fullName,email=.$email,phone=.$phone WHERE id=.$id";
        $db->executeStatement($query);
    }

    public function findById($id)
    {
        $db = new Database();
        $query = "select * users WHERE id =.$id";
        $db->executeStatement($query);
    }

    public function findAll()
    {
        $db = new Database();
        $query = "select * users";
        $db->executeStatement($query);
    }
}