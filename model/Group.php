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
    public $groupCode;

    public function insert($name, $groupCode)
    {
        $db = new Database();
        $query = "insert into users(username, fullname, email, phone) VALUES (.$name,.$groupCode)";
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

    public function update($id, $name, $groupCode, $email, $phone)
    {
        $db = new Database();
        $query = "UPDATE users SET username = .$name,fullname =.$groupCode,email=.$email,phone=.$phone WHERE id=.$id";
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