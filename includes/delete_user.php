<?php include('init.php') ?>
<?php
$response = array('message' => '', 'status' => 0);
$userId = $_POST['userId'];
$sql = "DELETE FROM `users` WHERE `users`.`user_id` = $userId";
$query_sql = mysqli_query($db->con, $sql);
if ($query_sql) {
    $response['message'] = 'deleted';
}
echo json_encode($response);
