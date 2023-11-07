<?php include('init.php') ?>
<?php
$output = array();
$unitId = $_POST['unitId'];
$sql = "SELECT * FROM `unit` 
WHERE `unit`.`unit_id` = $unitId";
$query_sql = mysqli_query($db->con, $sql);
while ($row = mysqli_fetch_assoc($query_sql)) {
    $output[] = $row;
}
echo json_encode($output);
