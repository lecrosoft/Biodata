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
if ($_SESSION['user_role'] !="Admin" AND $_SESSION['user_role'] !="Maintenance") {
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
           <?php include('includes/maintenance_content.php') ?>
            </div>
    </main>
    <?php include('includes/modal.php');?>

       <!-- <--addMaintenance --> 
    <!-- ================Add student Modal ================================================== -->
    <div class="modal fade" id="addMaintenance" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="maintenenceModalLabel">Add Maintenance</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">

                <form action="" id="maintenenceform">
                    <input type="hidden" name="maintenance_id" id="maintenance_id">
                <div class="row">
      <div class="form-group mb-3 col-md-6">
        <label class="">Date</label>
        <input type="date" class="form-control" id="date" name="date" required style="height:35px" max="<?php echo date('Y-m-d')?>">
      </div>

     <div class="form-group mb-3 col-md-6 d-flex" style="flex-direction:column">
        <label>Employees</label>
        <select name="employees[]" id="employ" class="form-control form-select" multiple="multiple" style="width:100%;height:35px">
         <option value="">Select Employee Name</option>
          <?php 
           $sql = "SELECT `employee_name`,`user_id` FROM employees";
            $query_sql = $db->query($sql);
          while($row = mysqli_fetch_assoc($query_sql)){
          extract($row);
          echo "<option value=$user_id>$employee_name</option>";
         }
         ?>
        </select>
      </div>
 </div>

       <div class="row">
      <div class="form-group mb-3 col-md-6">
        <label >Maintenance Category</label>
        <select name="preventive" id="preventive" class="form-control form-select" style="height:35px" required>
         <option value="" selected>Select Maintenance Category</option>
         <option value="Preventive">Preventive</option>
         <option value="Repair">Repair</option>
        </select>
      </div>

      <div class="form-group mb-3 col-md-6">
        <label class="">Machine</label>
        <select name="machine" id="machine" class="form-control form-select" style="height:35px" required>
         <option value="">Select Machine</option>
          <?php 
         $sql = "SELECT machine_name,machine_id FROM machine";
          $query_sql = $db->query($sql);
         while($row = mysqli_fetch_assoc($query_sql)){
          extract($row);
          echo "<option value=$machine_id>$machine_name</option>";
         }
         ?>
        </select>
      </div>
      </div>


      
     <div class="row">
     <div class="form-group mb-3 col-md-6" >
        <span class="">Unit</span>
        <select name="unit" id="unit" class="form-control form-select" style="height:35px" required>
         <option value="">Select Unit</option>
    
        </select>
      </div>

       <div class="form-group mb-3 col-md-6" >
        <span class="">Sub Unit</span>
        <select name="subunit" id="subunit" class="form-control form-select" style="height:35px" required>
         <option value="">Select Sub Unit Name</option>
    
        </select>
      </div>
     </div>


     <div class="row">
  
<div class="form-group mb-3 col-md-12">
        <label class="">Problem</label>
        <textarea class="form-control textarea" name="problem" id="problem" required style="height:150px" required></textarea>
      </div>
</div>
        <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary" id="save_btn">Submit</button>
                </div>
                </form>
                </div>
                
            </div>
        </div>
    </div>
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
        <script src="js/sweetalert/sweetalert.js"></script>
        <script src="js/tinymce/js/tinymce/tinymce.min.js"></script>
            <script>
        // tinymce.init({
        //     selector: 'textarea',
        //     plugins: 'advlist autolink lists link  charmap preview searchreplace visualblocks code fullscreen insertdatetime  table code help wordcount',
        //     toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        //     // tinycomments_author: 'Lecrosoft'
        //     promotion: false
        // });


        tinymce.init({
    selector: 'textareasss',
    // ... other configuration options ...
      promotion: false,
    setup: function (editor) {
        editor.on('init', function () {
            console.log('TinyMCE is initialized.');
        });
    }
});

    </script>
</html>
