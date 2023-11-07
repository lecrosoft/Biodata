<?php include('init.php') ?>
<?php
$response = array('message' => '', 'status' => 0);
$subunitId = $_POST['subunitId'];
$sql = "DELETE FROM `sub_unit` WHERE `sub_unit`.`sub_unit_id` = $subunitId";
$query_sql = mysqli_query($db->con, $sql);
if ($query_sql) {
    $response['message'] = 'deleted';
}
echo json_encode($response);
