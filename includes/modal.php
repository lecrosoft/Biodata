    <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <a class="btn btn-primary" href="login">Logout</a>
                </div>
            </div>
        </div>
    </div>
  
    <div class="modal fade" id="problemModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Problem</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="card">
                        <div class="card-body">
                         <div class="mb-3 d-flex justify-content-between">
                            <h6><span style="font-weight: bold;">Date: </span><span class="date" id="p-date">30-5-2023</span></h6>
                            <!-- <h6><span style="font-weight: bold;">Repair Type: </span><span class="repair_type">30-5-2023</span></h6> -->
                         </div>
                         <div class="mb-3 d-flex justify-content-between">
                            <h6><span style="font-weight: bold;">Machine Name: </span><span class="machine_name" id="p-machine-name">30-5-2023</span></h6>
                            <h6><span style="font-weight: bold;">Unit: </span><span class="unit" id="p-unit-name">30-5-2023</span></h6>
                         </div>
                         <div class="mb-3 d-flex justify-content-between">
                            <h6><span style="font-weight: bold;">Maintenance Type: </span><span class="maintenance_type" id="p-maintenance_type">30-5-2023</span></h6>
                            <h6><span style="font-weight: bold;">Sub Unit: </span><span class="subunit" id="p-sub_unit_name">30-5-2023</span></h6>
                         </div>
                         <hr>
                          <div class="mb-3">
                            <label for="" style="font-weight: bold;">Problem</label>
                            <p id="maintenanceProblem"></p>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a class="btn btn-primary" id="printButton" href="print_problem">Print</a>
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                 
                </div>
            </div>
        </div>
    </div>
   <!-- $query_sql = $db->query($sql);--->
 


    <!-- machine modal -->

       <div class="modal fade" id="unitModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="unitModalLabel">Add Unit</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="" id="unitform">
                        <input type="hidden" class="form-control" id="unit_id" name="unit_id">
                         <div class="form-group mb-3 col-md-12">
                            <label class="">Unit Name</label>
                             <input type="text" class="form-control" id="unit_name" name="unit_name" required style="height:35px">
                         </div>
                         <div class="form-group mb-3 col-md-12">
                            <label class="">Machine Name</label>
                             <select name="machine_id" id="machine_id" class="form-control form-select" required>
                                <option value="">Select Machine</option>
                                    <?php 
                                         $sql = "SELECT * FROM `machine`";
                                $querySql = mysqli_query($db->con, $sql);
                                while($row = mysqli_fetch_assoc($querySql)){
                                extract($row);
                                ?>
                                    <option value="<?php echo $machine_id?>"><?php echo $machine_name?></option>
                                <?php
                                    }
                                    ?>
                             </select>
                         </div>

       <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary" class="save_btn" id="save_btn">Save</button>
                </div>
                    </form>
                </div>
               
            </div>
        </div>
    </div>


    <!-- machine modal -->

       <div class="modal fade" id="machineModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="machineModalLabel">Add Machine</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="" id="machineform">
                        <input type="hidden" class="form-control" id="machine_ID" name="machine_id">
                         <div class="form-group mb-3 col-md-12">
        <label class="">Machine Name</label>
        <input type="text" class="form-control" id="machine_name" name="machine_name" required style="height:35px">
      </div>

       <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary" class="save_btn" id="save_btn">Save</button>
                </div>
                    </form>
                </div>
               
            </div>
        </div>
    </div>





        <!-- sub unit  modal -->

       <div class="modal fade" id="subUnitModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="subUnitModalLabel">Add Unit</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="" id="subUnitform">
                        <input type="hidden" class="form-control" id="sub_unit_id" name="sub_unit_id">
                         <div class="form-group mb-3 col-md-12">
                            <label class="">Sub Unit Name</label>
                             <input type="text" class="form-control" id="sub_unit_name" name="sub_unit_name" required style="height:35px">
                         </div>
                         <div class="form-group mb-3 col-md-12">
                            <label class="">Machine Name</label>
                             <select name="machine_id" id="sub_machine_id" class="form-control form-select" required>
                                <option value="">Select Machine</option>
                                    <?php 
                                         $sql = "SELECT * FROM `machine`";
                                $querySql = mysqli_query($db->con, $sql);
                                while($row = mysqli_fetch_assoc($querySql)){
                                extract($row);
                                ?>
                                    <option value="<?php echo $machine_id?>"><?php echo $machine_name?></option>
                                <?php
                                    }
                                    ?>
                             </select>
                         </div>
                         <div class="form-group mb-3 col-md-12">
                            <label class="">Unit Name</label>
                             <select name="unit_name" id="my_unit_name" class="form-control form-select" required>
                                <option value="">Select Unit</option>
                          
                             </select>
                         </div>
                     

       <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary" class="save_btn" id="save_btn">Save</button>
                </div>
                    </form>
                </div>
               
            </div>
        </div>
    </div>



    <div class="modal fade" id="filterModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Search Options</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="">
                    <div class="row">
     <div class="col-lg-3 col-md-3 form-group">
         <label for="">
             Machine</label>
 <select name="" id="machine_value" class="form-control">
    <option value="">Select All Machines</option>
    <?php 
                                        $sql = "SELECT * FROM `machine`";
                                $querySql = mysqli_query($db->con, $sql);
                                while($row = mysqli_fetch_assoc($querySql)){
                                extract($row);
                                ?>
                                    <option value="<?php echo $machine_id?>"><?php echo $machine_name?></option>
                                <?php
                                    }
                                    ?>
 </select>
     </div>
     <div class="col-lg-3 col-md-3 form-group">
         <label for="">
             Repair Type</label>
 <select name="" id="repair_type" class="form-control">
    <option value="">Select All Types</option>
    <option value="Repair">Repair</option>
    <option value="Preventive">Preventive</option>
 </select>
     </div>
     <div class="col-lg-3 col-md-3 form-group">
         <label for="">FROM</label>
       <input type="date" class="form-control" id="from" value="<?php echo date('Y-m-d')?>" max="<?php echo date('Y-m-d')?>">
     </div>
     <div class="col-lg-3 col-md-3 form-group">
         <label for="">TO </label>
         <input type="date" class="form-control" id="to" value="<?php echo date('Y-m-d')?>" max="<?php echo date('Y-m-d')?>">
     </div>
 </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <button class="btn btn-secondary" type="button" id="searchBtn">Search</button>
                </div>
            </div>
        </div>
    </div>

    
        <!-- REAL USER MODAL  modal -->

      