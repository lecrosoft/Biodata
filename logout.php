<?php session_start(); ?>


<?php

$_SESSION['user_id'] = null;
$_SESSION['employee_name'] = null;
$_SESSION['user_name'] = null;
$_SESSION['user_type'] = null;
$_SESSION['user_role'] = null;

echo '<script>window.location="login.php"</script>';

?>