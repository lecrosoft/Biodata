<?php
$response = array('message' => '', 'status' => 0);
require_once('init.php');
if (isset($_POST['date'])) {
   $date = $_POST['date'];
   $employeeIds = $_POST['employees'];
    $preventive = $_POST['preventive'];
    $machine = $_POST['machine'];
    $unit = $_POST['unit'];
    $subunit = $_POST['subunit'];
    $problem = $_POST['problem'];





    $sql = "INSERT INTO `maintenance`(`date`,`preventive_repair`,`machine_id`,`unit_id`,`subunit_id`,`problem`) ";
    $sql .= "VALUES ('";
    $sql .= $date . "','";
    $sql .= $preventive . "','";
    $sql .= $machine . "','";
    $sql .= $unit . "','";
    $sql .= $subunit . "','";
    $sql .= $problem . "'";
    $sql .= ")";

    $querySql = mysqli_query($db->con, $sql);
    if ($querySql) {
        global $global;
        $lastInsertedID = $db->the_insert_id();
        // return true;

          for($i = 0 ; $i < count($employeeIds); $i++){
      $query_technician="INSERT INTO `maintenance_technician`(`maintenance_id`, `technician_id`, `maintenance_date`)
  VALUES('".$lastInsertedID."','".$employeeIds[$i]."','".$date."')";
  $queryTechnicianSql = mysqli_query($db->con, $query_technician);
    }
        $response['message'] = "success";

        echo json_encode($response);
        // echo "Success";
    } else {
        $response['message'] = "failed";
        echo $response['message'];
        die('QUERY ERROR' . mysqli_error($db->con));
    }
}
