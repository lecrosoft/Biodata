<?php
$response = array('message' => '', 'status' => 0);
require_once('init.php');

if (isset($_POST['sub_unit_id'])) {
    $sub_unit_id = $_POST['sub_unit_id'];
    $sub_unit_name = $_POST['sub_unit_name'];
    $unit_name = $_POST['unit_name'];
    $machine_id = $_POST['machine_id'];
   
     $sql = "UPDATE `sub_unit` SET
    `sub_unit_name` = '".$sub_unit_name."',
    `unit_id`='".$unit_name."', `machine_id` = '".$machine_id."' 
    WHERE `sub_unit`.`sub_unit_id` = '".$sub_unit_id ."'";

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
