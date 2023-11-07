<?php include('init.php') ?>
<?php
$output = array();
$machineId = $_POST['machineId'];
$sql = "SELECT * FROM `machine` 
WHERE `machine`.`machine_id` = '".$machineId."'";
$query_sql = mysqli_query($db->con, $sql);
while ($row = mysqli_fetch_assoc($query_sql)) {
    $output[] = $row;
}
echo json_encode($output);
