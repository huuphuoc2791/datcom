<?php

class Database
{
    private $connection;
    private $hostname;
    private $username;
    private $password;
    private $database;

    public function __construct()
    {
        $this->hostname = 'localhost';
        $this->username = 'datcom';
        $this->password = 'dinhloc';
        $this->database = 'datcom';
    }

    public function openConnection()
    {
        // Open database connection
        $this->connection = mysqli_connect($this->hostname, $this->username, $this->password, $this->database);
        if ($this->connection->connect_error) {
            die("Connection failed: " . $this->connection->connect_error);
        }


    }

    public function closeConnection()
    {
        if (isset($this->connection)) {
            // Close database connection
            mysqli_close($this->connection);
            if ($this->connection->connect_error) {
                die("Error: " . $this->connection->connect_error);
            }
        }
    }

    public function executeStatement($statement)
    {
        // Open database connection
        $this->openConnection();

        // Execute database statement
        $result = mysqli_query($statement, $this->connection);
        if ($this->connection->connect_error) {
            die("Error execute: " . $this->connection->connect_error);
        }
        // Close database connection
        $this->closeConnection();

        // Return result
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


}