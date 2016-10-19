<?php

class DBHelper
{
    private $hostname;
    private $username;
    private $password;
    private $database;

    public function __construct()
    {
        $this->hostname = DATABASE_HOSTNAME;
        $this->username = DATABASE_USERNAME;
        $this->password = DATABASE_PASSWORD;
        $this->database = DATABASE_DATABASE_NAME;
    }


    public function executeStatement($statement)
    {
        try {
            $conn = new PDO("mysql:host=$this->hostname;dbname=$this->database", $this->username, $this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conn->exec("set names utf8");
            $stmt = $conn->prepare($statement);
            $stmt->execute();

            // set the resulting array to associative
            $stmt->setFetchMode(PDO::FETCH_ASSOC);

            $result = $stmt->fetchAll();
            return $result;
        } catch (PDOException $e) {
           
        }
        $conn = null;
    }


}