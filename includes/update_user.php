<?php
$response = array('message' => '', 'status' => 0);
require_once('init.php');

if (isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];
    $username = $_POST['username'];
    $user_role = $_POST['user_role'];

     $sql = "UPDATE `users` SET
     `user_name` = '". $username."',
    `user_role` = '".$user_role."'
    WHERE `user_id` = '".$user_id."'";

    $querySql = mysqli_query($db->con, $sql);

    if ($querySql) {
        $response['message'] = "update_success";
        echo json_encode($response);
    } else {
        $response['message'] = "failed";
        echo json_encode($response);
        die('QUERY ERROR' . mysqli_error($db->con));
    }
}
?>
