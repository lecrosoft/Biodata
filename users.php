<?php
// session_start();

//require_once 'app/bootstrap.php';

// use function Bil\Helpers\redirect;

// if ( ! @$_SESSION['username'] ) {
//     redirect($_SESSION);
// }

?>

<?php include_once('includes/head.php') ?>

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
    ?> <div class="modal fade" id="userModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userModalLabel">Add User</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="" id="userform">
                        <input type="hidden" class="form-control" id="user_id" name="user_id">
                         <div class="form-group mb-3 col-md-12">
                            <label class="">Username </label>
                             <input type="text" class="form-control" id="username" name="username" required style="height:35px">
                         </div>
                         <div class="form-group mb-3 col-md-12 password-div">
                            <label class="">Password</label>
                             <input type="password" class="form-control" id="password" name="password" required style="height:35px">
                         </div>
                         <div class="form-group mb-3 col-md-12">
                            <label class="">User role</label>
                             <select name="user_role" id="user_role" class="form-control form-select">
                                    <option value="">Select User role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Report">Report</option>
                             </select>
                         </div>

       <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary" class="save_btn" id="save_user_btn">Save</button>
                </div>
                    </form>
                </div>
            </div>
        </div>
    </div>






    <div class="modal fade" id="passwordResetModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userModalLabel">Reset Passord</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="" id="passwordForm">
                        <input type="hidden" class="form-control" id="password_user_id" name="user_id">
                         <div class="form-group mb-3 col-md-12 password-div">
                            <label class="">Password</label>
                             <input type="password" class="form-control" id="password" name="password" required style="height:35px">
                         </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary" class="save_btn" id="save_password_btn">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <main class="main-content">
            <div class="placeholder mt-3">
           <?php include('includes/user_content.php') ?>
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
   
        <script type="text/javascript" src="js/user.js"></script>
        <script type="text/javascript" src="js/add_user.js"></script>
        <!-- <script src="js/datatables/datatables.min.js"></script> -->
        <script src="js/select2/js/select2.min.js"></script>
        <script src="js/sweetalert/sweetalert.js"></script>
</html>
