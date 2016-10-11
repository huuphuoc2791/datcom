<?php
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . '../../' . PATH_SEPARATOR . '../');

include '../common/autoload.php';
require '../model/Menu.php';

echo "<table style='border: solid 1px black;'>";
echo "<tr><th>id</th><th>username</th><th>fullname</th></tr>";

class TableRows extends RecursiveIteratorIterator
{

    function current()
    {
        return "<td style='width: 150px; border: 1px solid black;'>" . parent::current() . "</td>";
    }

    function beginChildren()
    {
        echo "<tr>";
    }

    function endChildren()
    {
        echo "</tr>" . "\n";
    }
}

$hostname = "localhost";
$username = "root";
$password = "111111";
$database = "datcom";

try {
    $conn = new PDO("mysql:host=$hostname;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->prepare("SELECT * FROM users");
    $stmt->execute();

    // set the resulting array to associative
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);

    foreach (new TableRows(new RecursiveArrayIterator($stmt->fetchAll())) as $k => $v) {
        echo $v;
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$conn = null;
echo "</table>";


?>

