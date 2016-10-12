<?php

class DBHelper
{
    private $connection;
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
        $result = null;
        try {
            $conn = new PDO("mysql:host=$this->hostname;dbname=$this->database", $this->username, $this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $stmt = $conn->prepare($statement);
            $stmt->execute();

            // set the resulting array to associative
            $stmt->setFetchMode(PDO::FETCH_ASSOC);

            $result = $stmt->fetchAll();
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
        $conn = null;
        return $result;
    }

    public function executeSql($sql)
    {
        // Execute database statement
        $result = $this->executeStatement($sql);

        // Check number of rows returned
        if (mysqli_num_rows($result) == 1) {
            // Fetch one row from the result
            $dataset = mysqli_fetch_object($result);
        } else {
            // Fetch multiple rows from the result
            $dataset = array();
            while ($row = mysqli_fetch_object($result)) {
                $dataset[] = $row;
            }
        }

        // Close database cursor
        mysqli_free_result($result);

        // Return dataset
        return $dataset;
    }

    public function executeDml($dml)
    {
        // Execute database statement
        $this->executeStatement($dml);

        // Return affected rows
        return mysqli_affected_rows($this->connection);
    }

    /**
     * @return mixed
     */
    public function getConnection()
    {
        return $this->connection;
    }

    /**
     * @param mixed $connection
     */
    public function setConnection($connection)
    {
        $this->connection = $connection;
    }

    public function test()
    {
        try {
            $conn = new PDO("mysql:host=$this->hostname;dbname=$this->database", $this->username, $this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $stmt = $conn->prepare("SELECT * FROM menu");
            $stmt->execute();
            var_dump($stmt);
            // set the resulting array to associative
            $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);

            foreach (new TableRows(new RecursiveArrayIterator($stmt->fetchAll())) as $k => $v) {
                echo $v;
            }
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
        $conn = null;
        return $result;
    }


}