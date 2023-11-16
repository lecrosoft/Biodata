<?php
require_once('init.php');
$output = array();
// $searchKeyWords = $_GET['search_keywords'];
$religion = $_GET['religion'];
$country = $_GET['country'];
$from = $_GET['from'];
$to = $_GET['to'];


$query = "WHERE ";

if ($country) {
    $query .= "`reg_form`.`country` = '" . $country . "' && ";
}
if ($religion) {
    $query .= "`reg_form`.`religion` = '" . $religion . "' && ";
}
if ($from && $to) {
    $query .= "`reg_form`.`submission_date` BETWEEN '" . $from . "' AND  '" . $to . "'";
}

if ($query != "") {
    //surname,first_name,middle_name,admission_number,admission_submission_date,arm,abbreviation
    // $sql = "SELECT `arm`,`a_user_id`,`class`.`class_id`,`abbreviation`,`session_title`,`student_count`,`user`.`surname`,`user`.`first_name`,`user`.`middle_name`,`class_teacher_id`,`assistant_class_teacher_id`,`batch`.`batch_id`,`assistant_class_teacher`.`a_surname`,`assistant_class_teacher`.`a_first_name`,`assistant_class_teacher`.`a_middle_name` FROM `batch` LEFT JOIN `class` ON `batch`.`class_id` = `class`.`class_id` LEFT JOIN `academy_session` ON `batch`.`academic_session_id` = `academy_session`.`session_id` LEFT JOIN `user` ON `batch`.`class_teacher_id` =`user`.`user_id` LEFT JOIN `assistant_class_teacher` ON `batch`.`batch_id` = `assistant_class_teacher`.`batch_id` $query";
    $sql = "SELECT `reg_form` .*, religion FROM `reg_form` LEFT JOIN religion ON `reg_form`.`religion_id` = `religion`.`id` $query";
    $query_sql = $db->query($sql) or die("QUERY ERROR" . $db->con->error);
    while ($row = mysqli_fetch_array($query_sql)) {
        $output[] = $row;
    }
    echo json_encode($output);
}
