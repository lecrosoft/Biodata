<div class="row">
     <!-- <div class="col-lg-4 col-md-6 form-group">
         <label for="">
             SEARCH</label>
         <input type="text" class="form-control" placeholder="search by name,ADM No,Email,Phone number" id="searchInput">
     </div> -->
     <div class="col-lg-3 col-md-3 form-group">
         <label for="">FROM</label>
       <input type="date" class="form-control" id="from" value="<?php echo date('Y-m-d')?>" max="<?php echo date('Y-m-d')?>">
     </div>
     <div class="col-lg-3 col-md-3 form-group">
         <label for="">TO </label>
         <input type="date" class="form-control" id="to" value="<?php echo date('Y-m-d')?>" max="<?php echo date('Y-m-d')?>">
     </div>
     <div class="col-lg-3 col-md-6 form-group ml-auto">
         <label for="">
             ADD</label>
         <div class="row d-flex">
             <!-- <button type="button" class="btn btn-outline-primary mr-2" id="bulk_upload"><i class="fas fa-download fa-sm text-white-50"></i> Bulk Upload</button> -->
             <button type="button" class="btn btn-primary shadow-sm " id="add"><i class=" fas fa-download fa-sm text-white-50"></i> Add Maintenence</button>
         </div>
     </div>

   
 </div>