<?php
$response = array('message' => '', 'status' => 0);
require_once('init.php');
if (isset($_POST['machine_name'])) {
   $machine_name = $_POST['machine_name'];
    $sql = "INSERT INTO `machine`(`machine_name`) ";
    $sql .= "VALUES ('";
    $sql .= $machine_name . "'";
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
