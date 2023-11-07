<?php

require("init.php");

$output = array();
$machineId = $_POST['machineId'];
$sql = "SELECT * FROM `unit` WHERE `unit`.`machine_id` = $machineId";
$query_sql = $db->query($sql);
while($row = mysqli_fetch_assoc($query_sql)){
    extract($row);
    $output[] =$row;
}
echo json_encode($output);
?>