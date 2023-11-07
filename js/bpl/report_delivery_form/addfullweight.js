function addfullweight(id){
    //var loader = $(`<div class="loader justify-content-center"></div>`);
    
    var content = $(`
                    <div class="container">
                        <div>
                            <div class="circleSemi" id="semi-circle"></div>
                            <div class="d-flex justify-content-center">
                                <img src="/bil/images/belpapyrus_companies logo.png" width="150px" height="100px"/>

                            </div>
                        </div>
                           
                        <div class="container" style="margin-top:5%">
                                <div class="d-flex justify-content-between mb-3">
                                    <div class="col-4 text-center" style="font-size:25px">Update Weight</div>
                                    <div class="col-3 text-center align-self-end" style="font-size:14px;cursor:pointer;color:#3C7FBD;font-weight:bold"><a href="/bil/report_bpl_delivery">View Details</a></div>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-4 justify-content-center">
                                        <span class="mb-2">Date</span>
                                        <input type="text" class="form-control" placeholder="Date" id="date" value="" disabled/>
                                    </div>
                                    <div class="col-6">
                                    <span class="mb-2">Customer Name</span>
                                    <input type="text" autocomplete="off" name="vechiles" id="customer" list="Datalist_vechiles" class="form-control customer-dep" placeholder="Customer Selected" value="" disabled>
                                    </div>
                                </div>

                                <div class="row justify-content-center mt-3">
                                    <div class="col-4 justify-content-center">
                                        <span class="mb-2">Truck Number</span>
                                        <input type="text" autocomplete="off" name="vechiles" id="vechiles" list="Datalist_vechiles" class="form-control customer-dep" placeholder="Truck Number" value="" disabled>
                                            
                                    </div>
                                    <div class="col-3">
                                        <span class="mb-2">Loader</span>
                                        <input type="text" autocomplete="off" name="loader" id="loader" list="Datalist_loader" class="form-control customer-dep" placeholder="Loader Selected" value="" disabled>
                                            
                                    </div>
                                    <div class="col-3 ">
                                        <span class="mb-2">Container Number</span>
                                        <input type="text" autocomplete="off" name="container_number" id="container_number" list="Datalist_container_number" class="form-control customer-dep" placeholder="container_number Selected" value="" disabled>
                                            
                                    </div>
                                </div>

                                <div class="row justify-content-center mt-3">
                                    <div class="col-4 justify-content-center ">
                                        <span class="mb-2">Driver</span>
                                        <input type="text" autocomplete="off" name="driver" id="driver" list="Datalist_driver" class="form-control customer-dep" value="" placeholder="Driver Selected" disabled>
                                            
                                    </div>
                                    <div class="col-3 ">
                                        <span class="mb-2">Truck Weight</span>
                                        <input type="number" class="form-control customer-dep" placeholder="Truck Weight" value="" id="empty_truck_weight" disabled/>
                                        
                                    </div>
                                    <div class="col-3">
                                        <span class="mb-2">Full Weight</span>
                                        <input type="number" class="form-control" placeholder="Enter Full Weight" value="" id="fullweight"/>
                                    </div>
                                </div>

                                <div class="row justify-content-center mt-3">
                                    <div class="col-6 text-center mt-4">
                                        <button class="form-control" style="background-color:#3cbdaf;color:#fff" id="update_weight">Update Weight</button>
                                    </div>
                                     
                                </div>

                        </div>
                    </div>

    `)

    
    $("#wrapper").html(content)
    
    fetch('app/addfullweight/'+ id)
    .then(response=>response.json())
    .then(data=>{
       
        
        data.forEach(d => {
            
            document.getElementById('empty_truck_weight').value = d['truck_weight'];
            document.getElementById('loader').value= d['loader'];
            document.getElementById('driver').value= d['driver'];
            document.getElementById('vechiles').value= d['vechile_number'];
            document.getElementById('date').value= d['date'];
            document.getElementById('customer').value= d['customer_name'];
            document.getElementById('container_number').value= d['container_number'];
        });
    })
    loadComponent(id);
}


function loadComponent(id){
document.querySelector('#update_weight').addEventListener('click',function(e){
    var fullweight = document.getElementById('fullweight').value;
    if(fullweight!=""){
        fetch('app/updatefullweight/'+id,{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
            body:JSON.stringify({full_weight:fullweight,id:id,status:'completed'})
        })
        .then(response=>response.json())
        .then(data=>{
          // console.log(data)
            
            if(data["status"] == "Update was Successful"){
                history.replaceState(null, null, ' ');
                var barcode = data['barcode'];
                window.open('app/print_out/'+barcode, '_blank')
                setTimeout(() => _push('report_bpl_delivery'), 500)
               // loadUrl(document.location.href)
            }
            else if(data["status"]== "Full Weight Error"){
                Swal.fire({
                    icon: 'error',
                    title: data['status'],
                    text: data["details"],
                    
                  }) 
            }
            else if(data["status"] == "Weight Error"){
                Swal.fire({
                    icon: 'error',
                    title: data['status'],
                    text: data["details"],
                    
                  }) 
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Internal Server Error',
                    text: 'Contact Your Tech Dev Team!',
                    
                  }) 
            }
        })
    }
    else{
        Swal.fire({
            icon: 'error',
            title: 'Input Error',
            text: 'Full Weight Cannot Be Empty!!',
            
          })
    }
    

})

}