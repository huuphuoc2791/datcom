<?php

/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 10/10/16
 * Time: 20:27
 */
class Menu extends Model
{
    public $foodName;
    public $date;
    public $price;
    public $extraPrice;

    public function insert($foodName, $date, $price, $extraPrice)
    {
        $db = new Database();
        $query = "insert into menu(food_name, date, price, extra_price) VALUES (.$foodName,.$date,.$price,.$extraPrice)";
        $db->executeStatement($query);
    }

    /**
     * @param $id
     */
    public function delete($id)
    {
        $db = new Database();
        $query = "delete from menu WHERE id =.$id";
        $db->executeStatement($query);
    }

    public function update($id, $foodName, $date, $price, $extraPrice)
    {
        $db = new Database();
        $query = "UPDATE menu SET food_name = .$foodName,date =.$date,price=.$price,extra_price=.$extraPrice WHERE id=.$id";
        $db->executeStatement($query);
    }

    public function findById($id)
    {
        $db = new Database();
        $query = "select * menu WHERE id =.$id";
        $db->executeStatement($query);
    }

    public function findAll()
    {
        $db = new Database();
        $query = "select * menu";
        $db->executeStatement($query);
    }

}