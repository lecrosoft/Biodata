<!-- Page Heading -->
<div class="d-sm-flex align-items-center justify-content-between mb-4" id="page_title">
    <h1 class="h3 mb-0 text-gray-800">Maintenence Report From <span style="font-size:21px;color:blue;font-weight:bold">20-10-2023</span> To <span style="font-size:21px;color:blue;font-weight:bold">20-10-2023</span></h1>
    <!-- <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-download fa-sm text-white-50"></i> Generate Report</a> -->
</div>

<!-- Content Row -->
<?php //include('students_stats.php') 
?>

<!-- Content Row -->

<!-- Pie Chart -->

<?php 
   
   // include('maintenance_report_filter_box.php');
?> 

<?php
echo '<div class="mb-4"><button class="btn btn-secondary" id="filterBtn">Search Filter</button></div>';
include('tables.php');
reportTable();
?>

<!-- Content Row -->

<!-- ===========after the page content and container fluidd closing tag ============== -->