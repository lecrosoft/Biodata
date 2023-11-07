<?php include('init.php') ?>
<?php
$response = array('message' => '', 'status' => 0);
$maintenanceId = $_POST['maintenanceId'];
$sql = "DELETE FROM `maintenance` WHERE `maintenance`.`id` = $maintenanceId";
$query_sql = mysqli_query($db->con, $sql);
if ($query_sql) {
    $response['message'] = 'deleted';
}
echo json_encode($response);
