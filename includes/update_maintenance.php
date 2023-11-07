<?php
$response = array('message' => '', 'status' => 0);
require_once('init.php');

if (isset($_POST['maintenance_id'])) {
    $maintenance_id = $_POST['maintenance_id'];
    $date = $_POST['date'];
    $employeeIds = $_POST['employees'];
    $preventive = $_POST['preventive'];
    $machine = $_POST['machine'];
    $unit = $_POST['unit'];
    $subunit = $_POST['subunit'];
    $problem = $_POST['problem'];

    $sql = "UPDATE `maintenance` SET
    `date`='".$date."',
    `preventive_repair`='".$preventive."',
    `machine_id`='".$machine."',
    `unit_id`='".$unit."',
    `subunit_id`='".$subunit."',
    `problem`='".$problem."' WHERE `id` = '".$maintenance_id."'";

    $querySql = mysqli_query($db->con, $sql);

    if ($querySql) {
        for ($i = 0; $i < count($employeeIds); $i++) {
            $query_technician = "UPDATE `maintenance_technician` SET 
            `technician_id`='".$employeeIds[$i]."',
            `maintenance_date`='".$date."' 
            WHERE `maintenance_id` = '".$maintenance_id."'";

            $queryTechnicianSql = mysqli_query($db->con, $query_technician);
        }

        $response['message'] = "update_success";
        echo json_encode($response);
    } else {
        $response['message'] = "failed";
        echo json_encode($response);
        die('QUERY ERROR' . mysqli_error($db->con));
    }
}
?>
