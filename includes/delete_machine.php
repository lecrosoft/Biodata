<?php include('init.php') ?>
<?php
$response = array('message' => '', 'status' => 0);
$machineId = $_POST['machineId'];
$sql = "DELETE FROM `machine` WHERE `machine`.`machine_id` = $machineId";
$query_sql = mysqli_query($db->con, $sql);
if ($query_sql) {
    $response['message'] = 'deleted';
}
echo json_encode($response);
