<?php include_once('includes/head.php') ?>
<?php
if (($_SESSION['user_role'] != "Admin")) {
    header('location: index?Message="Access Denied"');
}
?>
<?php
if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $student_id = $id;
    $sql = "SELECT `reg_form` .*, religion FROM `reg_form` LEFT JOIN religion ON `reg_form`.`religion_id` = `religion`.`id` 
WHERE `reg_form`.`id` = $id
";
    $query_sql = $db->query($sql);
    $row = mysqli_fetch_assoc($query_sql);
    extract($row);
    $sql1 = "SELECT YEAR(dob) as year FROM `reg_form` WHERE `id` = $id";
    $query_sql = $db->query($sql1);
    $row2 = mysqli_fetch_assoc($query_sql);
    $year = $row2['year'];
    $current_year = date('Y');
}

?>

<body>
    <div class="preloader">
        <div class="loader">
            <div class="loader__figure"></div>
            <p class="loader__label">Biodata</p>
        </div>
    </div>
    <?php
    include("includes/main_header.php");
    include("includes/main_nav.php");
    ?>

    <main class="main-content">
        <div class="placeholder mt-3">
            <?php include('includes/personal_profile_content.php') ?>
        </div>
    </main>
    <?php include('includes/modal.php'); ?>
</body>
<?php include('includes/external_js.php');

?>
<!-- <script src="js/jquery/3.2.1/jquery.min.js"></script> -->
<script type="text/javascript" src="js/nav.js"></script>
<!-- <script type="text/javascript" src="vendor/bootstrap/js/bootstrap.min.js"></script> -->
<script src="js/toast/dist/jquery.toast.min.js">
    //    <script type="text/javascript" src="js/proper.js">
</script>
<script src="js/dropify/dist/js/dropify.min.js">
</script>
<script type="text/javascript" src="js/biodata.js"></script>
<script type="text/javascript" src="js/add_biodata.js"></script>

<!-- <script type="text/javascript" src="js/add_machine.js"></script> -->
<!-- <script src="js/datatables/datatables.min.js"></script> -->
<script src="js/select2/js/select2.min.js"></script>
<script src="js/sweetalert/sweetalert.js"></script>

</html>