<?php include('init.php') ?>
<?php
$output = array();
$subunitId = $_POST['subunitId'];
$sql = "SELECT * FROM `sub_unit` 
WHERE `sub_unit`.`sub_unit_id` = $subunitId";
$query_sql = mysqli_query($db->con, $sql);
while ($row = mysqli_fetch_assoc($query_sql)) {
    $output[] = $row;
}
echo json_encode($output);
