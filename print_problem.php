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
<!-- <div class="preloader">
    <div class="loader">
        <div class="loader__figure"></div>
        <p class="loader__label">MMS</p>
    </div>
</div> -->
    <?php
        include("includes/main_header.php");
         include("includes/main_nav.php");
    ?>
<?php 
if(isset($_GET['id'])){
    $id = $_GET['id'];
       $sql = "SELECT * FROM `maintenance` 
    LEFT JOIN `machine` ON `maintenance`.`machine_id` = `machine`.`machine_id`
    LEFT JOIN `unit` ON  `maintenance`.`unit_id` = `unit`.`unit_id` 
    LEFT JOIN `sub_unit` ON `maintenance`.`subunit_id` = `sub_unit`.`sub_unit_id` WHERE`maintenance`.`id` = '".$id."' ";
          $query_sql = $db->query($sql);
        $row = mysqli_fetch_assoc($query_sql);
          extract($row);
        
         
}
?>
    <main class="main-content">
            <div class="placeholder mt-3">
                    <div class="card">
                        <h1 style="text-align: center;text-decoration:underline;padding-top:1rem">Maintenance Report</h1>
                        <div class="card-body">
                         <div class="mb-3 d-flex justify-content-between">
                            <h6><span style="font-weight: bold;">Date: </span><span class="date"><?php echo $date ?></span></h6>
                            <!-- <h6><span style="font-weight: bold;">Repair Type: </span><span class="repair_type">30-5-2023</span></h6> -->
                         </div>
                         <div class="mb-3 d-flex justify-content-between">
                            <h6><span style="font-weight: bold;">Machine Name: </span><span class="machine_name"><?php echo $machine_name ?></span></h6>
                            <h6><span style="font-weight: bold;">Unit: </span><span class="unit"><?php echo $unit_name ?></span></h6>
                         </div>
                         <div class="mb-3 d-flex justify-content-between" id="print">
                            <h6><span style="font-weight: bold;">Maintenance Type: </span><span class="maintenance_type"><?php echo $preventive_repair ?></span></h6>
                            <h6><span style="font-weight: bold;">Sub Unit: </span><span class="subunit"><?php echo $sub_unit_name ?>/span></h6>
                         </div>
                         <hr>
                          <div class="mb-3">
                            <label for="" style="font-weight: bold;">Problem</label>
                            <p id="maintenanceProblem">
                                <?php echo $problem ?>
                            </p>
                          </div>
                        </div>
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
   
        <!-- <script type="text/javascript" src="js/machine.js"></script>
        <script type="text/javascript" src="js/add_machine.js"></script> -->
        <!-- <script src="js/datatables/datatables.min.js"></script> -->
        <script src="js/select2/js/select2.min.js"></script>
        <script src="js/sweetalert/sweetalert.js"></script>
        <script>
function printDiv(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}

printDiv('print')
</script>

      
</html>
