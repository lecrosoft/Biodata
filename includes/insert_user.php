<?php
$response = array('message' => '', 'status' => 0);
require_once('init.php');
if (isset($_POST['username'])) {
   $username = $_POST['username'];
   $password = $_POST['password'];
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
   $user_role = $_POST['user_role'];
    $sql = "INSERT INTO `users`(`user_name`,`password`,`user_role`) ";
    $sql .= "VALUES ('";
    $sql .= $username . "','";
    $sql .= $hashed_password . "','";
    $sql .= $user_role . "'";
    $sql .= ")";

    $querySql = mysqli_query($db->con, $sql);
    if ($querySql) {
        global $global;
        $lastInsertedID = $db->the_insert_id();
        // return true;
        $response['message'] = "success";

        echo json_encode($response);
        // echo "Success";
    } else {
        $response['message'] = "failed";
        echo $response['message'];
        die('QUERY ERROR' . mysqli_error($db->con));
    }
}
