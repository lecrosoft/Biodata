<?php
$response = array('message' => '', 'status' => 0);
require_once('init.php');
if (isset($_POST['machine_id'])) {
   $machine_id = $_POST['machine_id'];
   $unit_name = $_POST['unit_name'];
    $sql = "INSERT INTO `unit`(`unit_name`,`machine_id`) ";
    $sql .= "VALUES ('";
    $sql .= $unit_name . "','";
    $sql .= $machine_id . "'";
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
