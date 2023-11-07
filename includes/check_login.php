<?php session_start() ?>
<?php

include('init.php');
$output = array();
$response = array('message' => '', 'status' => 0);
// $searchKeyWords = $_GET['search_keywords'];
$inputedUsername = $_POST['username'];
$inputedPassword = $_POST['password'];
// $inputedUsername = $db->excape_string($inputedUsername);
// $inputedPassword = $db->excape_string($inputedPassword);
$inputedUsername = mysqli_real_escape_string($db->con, $inputedUsername);
$inputedPassword = mysqli_real_escape_string($db->con, $inputedPassword);
// echo $inputedUsername;
// echo $inputedPassword;

if (!empty($inputedUsername) &&  !empty($inputedPassword)) {
    $sql = "SELECT * FROM `users` WHERE `user_name` = '" . $inputedUsername . "'";
    $query_sql = $db->query($sql);
    $count = mysqli_num_rows($query_sql);
    if ($count > 0) {
        $row = mysqli_fetch_assoc($query_sql);
        extract($row);

        $verify_password = password_verify($inputedPassword, $password);
        if ($inputedUsername == $user_name && $verify_password == 1) {
            $_SESSION['user_id'] = $user_id;
            $_SESSION['user_name'] = $user_name;
            $_SESSION['user_role'] = $user_role;
          

            $response['message'] = 'success';
        }
    } else {
        $response['message'] = 'failed';
    }
}
echo json_encode($response);
