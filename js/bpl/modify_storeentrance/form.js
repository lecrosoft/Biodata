function deleteForm(){
    
    var main = document.getElementById('wrapper');
    var content = $(
                     ` 
                    
                        
                        <div class="container">
                            <div class="header">
                            <img src="/bil/images/belpapyrus_companies logo.png" width="150px" height="100px"/>
                             <a href="report_bpl_delete_storeentrance"><button class="btn btn-custom-color btn-sm">View Entries</button></a>
                            </div>   
                        
                            <div class="main_modify">
                                
                                <div class="main_modify_section1">
                                    <form>
                                        <div class="form-group">
                                            <label for="date">Date</label>
                                            <input type="text" id="date" class="form-control" value="${new Date}" disabled>
                                            <small id="emailHelp" class="form-text text-muted">Current Date is automatically selected.</small>
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Location</label>
                                            <select class="form-control" id="location">
                                                <option value="">Select Location</option>
                                                
                                            </select>
                                    </div>
                                    </form>
                                </div>

                                <div class="main_modify_section2">
                                    <div class="formsection">
                                            <div class="form-group">
                                                <label for="exampleInputEmail1">Scan Barcode</label>
                                                <input type="text" class="form-control" style="width:100%" id="scanInput" aria-describedby="emailHelp" placeholder="Scan Barcode">
                                                <div class=" mt-2"  role="status" id="loader">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                            
                                    </div>
                                    <div class="formsection" id="result">
                                        <table class="table table-striped">
                                            <thead>
                                                <tr style="font-size:13px"> 
                                                    <th scope="col">Date Of Entrance</th>
                                                    <th scope="col">Barcode</th>
                                                    <th scope="col">Productname</th>
                                                    <th scope="col">GradeType</th>
                                                    <th scope="col">Location</th>
                                                    <th scope="col">Weight</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                                </thead>
                                                <tbody id="barcode_tbody">
                                                
                                                </tbody>
                                            </table>
                                    </div>
     
                                </div>
                                
                            
                            </div>
                            
                            <div style="width:50px; height:50px;border-radius:25px;border:1px solid #3CBDAF;background:#3CBDAF;position:absolute;z-index:2px;bottom:25vh;right:30px;" class="d-flex justify-content-center" id="save_delete">
                                        <img src="/bil/images/savebutton.png" style="width:30px;cursor:pointer" class="align-self-center save_button"/>    
                            </div>
                        
                    </div>
                                            `
                    ) 
                    content.find('#date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker('setDate');
                    fetch('app/getlocations')
                    .then(response => response.json())
                    .then(fetch_data => {
                            var dataset="";
                            fetch_data.forEach((d,key)=>{
                                d.forEach((x)=>{
                                    dataset += '<option value='+ x['id']+'>'+x['location'] +'</option>'
                                })
                            })
                            content.find('#location').html(dataset);
                    })
                $(main).html(content)
                
                scanbarcode(document.querySelector('.circle'));
                
                
                
                document.getElementById('save_delete').addEventListener('click',function(){
                    if(allbarcodes.length > 0){
                        
                        var user = document.getElementById('user').value;
                        console.log(user);
                        Swal.fire({
                            title: 'Are you sure?',
                            text: "You won't be able to revert this!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, delete it!'
                          }).then((result) => {
                            if (result.isConfirmed) {
                                fetch('app/removeStoreItems',{
                                    method:'POST',
                                    headers:{
                                        'Content-Type':'application/json'
                                    },
                                    body:JSON.stringify({barcodes:allbarcodes,user:user})
                                })
                                .then(response=>response.json())
                                .then(res=>{
                                     
                                     console.log(res);
                                     
                                    if(res['status']){
                                         Swal.fire(
                                             'Deleted Successfully!',
                                             'You can now edit the deleted product/products in the Production Page',
                                             'success'
                                         )
                     
                                         document.querySelector('tbody').innerHTML=""
                                         document.getElementById('scanInput').value=""
                                         allbarcodes=[];
                                         document.getElementById('location').removeAttribute('disabled');
                                         
                                    }
                                    else{
                                     Swal.fire(
                                         'Oops!',
                                         res['data'],
                                         'error'
                                     )
                                    }
                                })
                            }
                          })
                        
                           
                       }
                })


                
}