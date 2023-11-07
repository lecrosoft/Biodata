<?php

require("init.php");
$output = array();
$maintenance_Id = $_POST['maintenance_Id'];
$sql = "SELECT `technician_id` FROM `maintenance_technician` WHERE `maintenance_technician`.`maintenance_id` = $maintenance_Id";
$query_sql = $db->query($sql);
while ($row = mysqli_fetch_assoc($query_sql)) {
    extract($row);
    $output[] = $technician_id; // Add only the technician_id value to the output array
}
echo json_encode($output);
?>
