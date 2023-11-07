<?php

require("init.php");
$output = array();
$unitId = $_POST['unitId'];
$sql = "SELECT * FROM `sub_unit` WHERE `sub_unit`.`unit_id` = $unitId";
$query_sql = $db->query($sql);
while($row = mysqli_fetch_assoc($query_sql)){
    extract($row);
    $output[] =$row;
}
echo json_encode($output);
?>