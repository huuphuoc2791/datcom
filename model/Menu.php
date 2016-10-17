<?php

/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 10/10/16
 * Time: 20:27
 */
class Menu
{
    public $foodName;
    public $date;
    public $price;
    public $extraPrice;

    public function insert($foodName, $date, $price, $extraPrice)
    {
        $db = new DBHelper();
        $query = "insert into menu(food_name, date, price, extra_price) VALUES ('$foodName','$date','$price','$extraPrice')";
        $db->executeStatement($query);
    }

    /**
     * @param $id
     */
    public function delete($id)
    {
        $db = new DBHelper();
        $query = "delete from menu WHERE id =$id";
        $db->executeStatement($query);
    }

    public function update($id, $foodName, $date, $price, $extraPrice)
    {
        $db = new DBHelper();
        $query = "UPDATE menu SET food_name = '$foodName',date ='$date',price = '$price' ,extra_price = '$extraPrice' WHERE id=$id";
        $db->executeStatement($query);
    }

    public function findById($id)
    {
        $db = new DBHelper();
        $query = "select * from menu WHERE id = $id";
        $result = $db->executeStatement($query);
        return $result;
    } 
    public function findByDay($day)
    {
        $db = new DBHelper();
        $query = "select *,food_name menuName,extra_price extraPrice from menu WHERE date = '$day'";
        $result = $db->executeStatement($query);
        return $result;
    }

    public function findAll()
    {
        $db = new DBHelper();
        $query = "select * from menu";
        $result = $db->executeStatement($query);
        return $result;
    }
    public function findByFoodName($foodName){
        $db = new DBHelper();
        $query = "select * from menu WHERE food_name = '$foodName'";
        $result = $db->executeStatement($query);
        return $result;
    }
    
}

?>