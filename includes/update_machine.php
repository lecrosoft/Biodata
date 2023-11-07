<?php
$response = array('message' => '', 'status' => 0);
require_once('init.php');

if (isset($_POST['machine_id'])) {
    $machine_id = $_POST['machine_id'];
    $machine_name = $_POST['machine_name'];
   
     $sql = "UPDATE `machine` SET
    `machine_name`='".$machine_name."' WHERE `machine`.`machine_id` = '".$machine_id."'";

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
