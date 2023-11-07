<?php
require_once('init.php');
$output = array();
   $sql = "SELECT * FROM `users`";
    $query_sql = $db->query($sql) or die("QUERY ERROR" . $db->con->error);
    while ($row = mysqli_fetch_array($query_sql)) {
        $output[] = $row;
    }
    echo json_encode($output);

