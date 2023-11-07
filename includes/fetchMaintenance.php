<?php
require_once('init.php');
$output = array();
// $searchKeyWords = $_GET['search_keywords'];

$from = $_GET['from'];
$to = $_GET['to'];


$query = "WHERE ";

if ($from && $to) {
    $query .= "`maintenance`.`date` BETWEEN '" . $from . "' AND  '".$to."'";
}

if ($query != "") {
    //surname,first_name,middle_name,admission_number,admission_date,arm,abbreviation
    // $sql = "SELECT `arm`,`a_user_id`,`class`.`class_id`,`abbreviation`,`session_title`,`student_count`,`user`.`surname`,`user`.`first_name`,`user`.`middle_name`,`class_teacher_id`,`assistant_class_teacher_id`,`batch`.`batch_id`,`assistant_class_teacher`.`a_surname`,`assistant_class_teacher`.`a_first_name`,`assistant_class_teacher`.`a_middle_name` FROM `batch` LEFT JOIN `class` ON `batch`.`class_id` = `class`.`class_id` LEFT JOIN `academy_session` ON `batch`.`academic_session_id` = `academy_session`.`session_id` LEFT JOIN `user` ON `batch`.`class_teacher_id` =`user`.`user_id` LEFT JOIN `assistant_class_teacher` ON `batch`.`batch_id` = `assistant_class_teacher`.`batch_id` $query";
    $sql = "SELECT * FROM `maintenance` 
    LEFT JOIN `machine` ON `maintenance`.`machine_id` = `machine`.`machine_id`
    LEFT JOIN `unit` ON  `maintenance`.`unit_id` = `unit`.`unit_id` 
    LEFT JOIN `sub_unit` ON `maintenance`.`subunit_id` = `sub_unit`.`sub_unit_id` $query";
    $query_sql = $db->query($sql) or die("QUERY ERROR" . $db->con->error);
    while ($row = mysqli_fetch_array($query_sql)) {
        $output[] = $row;
    }
    echo json_encode($output);
}
