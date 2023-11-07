<?php include('init.php') ?>
<?php
$output = array();
$maintenanceId = $_POST['maintenanceId'];
$sql = "SELECT * FROM `maintenance` 
LEFT JOIN `machine` ON `maintenance`.`machine_id` = `machine`.`machine_id` 
LEFT JOIN `unit` ON  `maintenance`.`unit_id` = `unit`.`unit_id`  
LEFT JOIN `sub_unit` ON `maintenance`.`subunit_id` = `sub_unit`.`sub_unit_id` WHERE `maintenance`.`id` = $maintenanceId";
$query_sql = mysqli_query($db->con, $sql);
while ($row = mysqli_fetch_assoc($query_sql)) {
    $output[] = $row;
}
echo json_encode($output);
