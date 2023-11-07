<?php
ob_start();
// Set session lifetime to 15 minutes (900 seconds)
$sessionLifetime = 900;

// Set the session cookie parameters
session_set_cookie_params($sessionLifetime);

// Start the session
session_start();

if (!isset($_SESSION['user_role'])) {
    header('location: login');
}
?>


<?php include('init.php') ?>


<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Biodata</title>
    <link type="image/x-icon" rel="icon" href="images/bilicon.ico" />
    <link type="text/css" rel="stylesheet" href="css/reset.css">
    <!-- CSS reset -->
    <link href="css/loader.css" rel="stylesheet">
    <link href="js/toast/dist/jquery.toast.min.css" rel="stylesheet">
    <link href="js/dropify/dist/css/dropify.min.css" rel="stylesheet">
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link type="text/css" rel="stylesheet" href="css/menu.css"> <!-- Menu CSS style -->
    <link type="text/css" rel="stylesheet" href="css/w3_css_4.css" /><!-- W3 CSS style -->
    <link type="text/css" rel="stylesheet" href="css/report.css">
    <link type="text/css" rel="stylesheet" href="css/backup.css">
    <!-- <link type="text/css" rel="stylesheet" href="css/bootstrap/bootstrap.min.css"> -->
    <link rel="stylesheet" href="js/datatables/datatables.min.css">
    <link rel="stylesheet" href="js/select2/css/select2.min.css">
</head>