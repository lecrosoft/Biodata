<?php
// session_start();

//require_once 'app/bootstrap.php';

// use function Bil\Helpers\redirect;

// if ( ! @$_SESSION['username'] ) {
//     redirect($_SESSION);
// }

?>

<?php include_once('includes/head.php') ?>
<?php 
if (($_SESSION['user_role'] !="Admin")) {
    header('location: index?Message="Access Denied"');
}
?>
<body>
<div class="preloader">
    <div class="loader">
        <div class="loader__figure"></div>
        <p class="loader__label">MMS</p>
    </div>
</div>
    <?php
        include("includes/main_header.php");
            include("includes/main_nav.php");
    ?>

    <main class="main-content">
            <div class="placeholder mt-3">
           <?php include('includes/unit_content.php') ?>
            </div>
    </main>
    <?php include('includes/modal.php');?>
</body>
<?php include('includes/external_js.php');

 ?>
    <!-- <script src="js/jquery/3.2.1/jquery.min.js"></script> -->
      <script type="text/javascript" src="js/nav.js"></script>
        <!-- <script type="text/javascript" src="vendor/bootstrap/js/bootstrap.min.js"></script> -->
         <script src="js/toast/dist/jquery.toast.min.js">
      
    //    <script type="text/javascript" src="js/proper.js"></script>
   
        <script type="text/javascript" src="js/unit.js"></script>
        <script type="text/javascript" src="js/add_unit.js"></script>
        <!-- <script src="js/datatables/datatables.min.js"></script> -->
        <script src="js/select2/js/select2.min.js"></script>
        <script src="js/sweetalert/sweetalert.js"></script>
</html>
