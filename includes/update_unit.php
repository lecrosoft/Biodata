<?php
$response = array('message' => '', 'status' => 0);
require_once('init.php');

if (isset($_POST['unit_id'])) {
    $unit_id = $_POST['unit_id'];
    $unit_name = $_POST['unit_name'];
    $machine_id = $_POST['machine_id'];
   
     $sql = "UPDATE `unit` SET
    `unit_name`='".$unit_name."', `machine_id` = '".$machine_id."'  WHERE `unit`.`unit_id` = '".$unit_id."'";

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
