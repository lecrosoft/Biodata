<?php
$response = array('message' => '', 'status' => 0);
require_once('init.php');

if (isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];
    $password = $_POST['password'];
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

     $sql = "UPDATE `users` SET
     `users`.`password` = '".$hashed_password."'
    WHERE `user_id` = '".$user_id."'";

    $querySql = mysqli_query($db->con, $sql);

    if ($querySql) {
        $response['message'] = "password_update_success";
        echo json_encode($response);
    } else {
        $response['message'] = "failed";
        echo json_encode($response);
        die('QUERY ERROR' . mysqli_error($db->con));
    }
}
?>
