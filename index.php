<?php include_once('includes/head.php') ?>

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
        <div id="wrapper" class="mt-3">
            <div class="placeholder">
                <h3>Welcome, <?= $_SESSION['user_name'] ?>!</h3>
                <p>Use the navigation menu from the right to access your dashboard.</p>
            </div>
        </div>
    </main>
</body>
    <?php include('includes/external_js.php');

 ?>
    <!-- <script src="js/jquery/3.2.1/jquery.min.js"></script> -->
      <script type="text/javascript" src="js/nav.js"></script>
        <!-- <script type="text/javascript" src="vendor/bootstrap/js/bootstrap.min.js"></script> -->
         <script src="js/toast/dist/jquery.toast.min.js">
      
    //    <script type="text/javascript" src="js/proper.js"></script>
   
        <script type="text/javascript" src="js/maintenence.js"></script>
        <script type="text/javascript" src="js/add_maintenance.js"></script>
        <!-- <script src="js/datatables/datatables.min.js"></script> -->
        <script src="js/select2/js/select2.min.js"></script>
</html>
