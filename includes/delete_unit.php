<?php include('init.php') ?>
<?php
$response = array('message' => '', 'status' => 0);
$unitId = $_POST['unitId'];
$sql = "DELETE FROM `unit` WHERE `unit`.`unit_id` = $unitId";
$query_sql = mysqli_query($db->con, $sql);
if ($query_sql) {
    $response['message'] = 'deleted';
}
echo json_encode($response);
