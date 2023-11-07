var barcode_list = [];
var barcode_array = [];
function editreport(id){
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
                                    <div class="col-4 text-center" style="font-size:25px">Edit Report</div>
                                    <div class="col-3 text-center align-self-end" style="font-size:14px;cursor:pointer;color:#3C7FBD;font-weight:bold"><a href="/bil/report_bpl_delivery">View Details</a></div>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-4 justify-content-center">
                                        <span>Date</span>
                                        <input type="text" class="form-control" placeholder="Date" id="date" value=""/>
                                    </div>
                                    <div class="col-6">
                                    <span>Customer Name</span>
                                    <select id="customer" name="customers" class="form-control">
                                     <option value=""> Select Customer</option>
                                    
                                    </select>
                                    
                                    </div>
                                </div>

                                <div class="row justify-content-center mt-3">
                                    <div class="col-4 justify-content-center">
                                        <span>Truck Number</span>
                                        <input type="text" autocomplete="off" name="vechiles" id="vechiles" list="Datalist_vechicles" class="form-control customer-dep" placeholder="Truck Number" value="">
                                        <datalist id="Datalist_vechicles">
                                                
                                        </datalist>
                                    </div>
                                    <div class="col-6">
                                        <span>Loader</span>
                                        <input type="text" autocomplete="off" name="loader" id="loader" list="Datalist_loader" class="form-control customer-dep" placeholder="Loader Selected" value="" >
                                        <datalist id="Datalist_loader">
                                                
                                        </datalist>
                                    </div>
                                </div>

                                <div class="row justify-content-center mt-3">
                                    <div class="col-4 justify-content-center">
                                        <span>Driver</span>
                                        <input type="text" autocomplete="off" name="driver" id="driver" list="Datalist_driver" class="form-control customer-dep" value="" placeholder="Driver Selected">
                                        <datalist id="Datalist_driver">
                                                
                                        </datalist>  
                                    </div>
                                    <div class="col-3 ">
                                        <span>Empty Truck Weight</span>
                                        <input type="number" class="form-control customer-dep" placeholder="Truck Weight" value="" id="empty_truck_weight" />
                                          
                                    </div>
                                    <div class="col-3">
                                        <span>Full Weight</span>
                                        <input type="number" class="form-control" placeholder="Enter Full Weight" value="" id="fullweight"/>
                                    </div>
                                </div>

                                

                                <div class="d-flex mt-4">
                                            <table class="table table-striped">
                                            <thead>
                                            <tr>
                                                <th scope="col">Barcode</th>
                                                <th scope="col">Hardroll Number</th>
                                                <th scope="col">Grade</th>
                                                <th scope="col">Product</th>
                                                <th scope="col">Weight</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            </tbody>
                                            <tfoot>
                                               
                                            </tfoot>
                                        </table>
                                </div>
                                <div class="row justify-content-center mt-3">
                                    <div class="col-6 text-center mt-4">
                                        <button class="form-control" style="background-color:#3cbdaf;color:#fff" id="save">Save</button>
                                    </div>
                                     
                                </div>


                        </div>
                    </div>

    `)

    
    $("#wrapper").html(content)
    
    fetch('app/editreport/'+ id)
    .then(response=>response.json())
    .then(data=>{
       
        console.log(data["details"])
        
         
         data["customer"].forEach(d => {
            //console.log(d['customername'])
            content.find('#customer').append(`<option value="${d['customername']}">${d['customername']}</option>`)
            
        });
        data["loader"].forEach(d => {
            //console.log(d['loader'])
            content.find('#Datalist_loader').append(`<option value="${d['loader']}"></option>`)
            
        });
        data["vechicle"].forEach(d => {
            //console.log(d['customername'])
            content.find('#Datalist_vechicles').append(`<option value="${d['vechile_number']}"></option>`)
            
        });
        data["driver"].forEach(d => {
            //console.log(d['customername'])
            content.find('#Datalist_driver').append(`<option value="${d['driver']}"></option>`)
            
        });
        data["details"].forEach(d => {
            
            document.getElementById('empty_truck_weight').value = d['truck_weight'];
            document.getElementById('loader').value= d['loader'];
            document.getElementById('driver').value= d['driver'];
           document.getElementById('vechiles').value= d['vechile_number'];
           document.getElementById('date').value= d['date'];
            document.getElementById('customer').value= d['customer_name'];
            document.getElementById('fullweight').value= d['full_weight'];
            //$('#customer option[value="'+ d['customer_name'] +'"]').attr('selected',true);
            //console.log('customer_name',document.getElementById('customer').value)
            //document.querySelector('#customer').value =d['customer_name'];
            
            
           var x = barcode_list.includes(d.barcode);
           if(!x){
               barcode_list.push(d.barcode)
               barcode_array.push(d.barcode)
           }
               content.find('tbody').append(`
                   <tr class="myrow">
                       <td>${d.barcode}</td>
                       <td>${d.hardrollnumber}</td>
                       <td>${d.gradetype}</td>
                       <td>${d.productname}</td>
                       <td>${d.weight}</td>
                       <td ><img src="/bil/images/close.png" style="width:20px;cursor:pointer" class="remove_item"/></td>
                   </tr>`)
            
        });
        
    })
    //loadComponent(id);
    document.querySelector('tbody').addEventListener('click',function(e){
        console.log('barcodeList',barcode_list)
            if(e.target.classList.contains('remove_item')){
                var td = e.target.parentNode;
                var tr = td.parentNode;
                for( var i = 0; i < barcode_list.length; i++){ 

                    if ( barcode_list[i] === tr.children[0].textContent) { 
                
                        barcode_list.splice(i, 1); 
                    }
                
                }
                tr.parentNode.removeChild(tr);
                console.log('barcodeList',barcode_list)
            }
    })
    saveEdit(id);
    $('#customer').select2({
        placeholder: "Select Customer",
        selectOnClose: true,
            
    });
}


function saveEdit(id){
    document.querySelector('#save').addEventListener('click',function(e){
        var date = document.getElementById('date').value;
        var customer = document.getElementById('customer').value;
        var vechicles = document.getElementById('vechiles').value;
        var loader = document.getElementById('loader').value;
        var driver = document.getElementById('driver').value;
        var empty_truck_weight = document.getElementById('empty_truck_weight').value;
        var full_weight = document.getElementById('fullweight').value;
        
        if(date == ""){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Date is Required!',
                
              })
            
        }

        if(customer == ""){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Select the customer name!',
                
              })
            
        }
        if(vechiles == ""){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Truck Number is Required!',
                
              })
            
        }
        if(loader == ""){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Select Loader!',
                
              })
            
        }
        if(driver == ""){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Select Driver!',
                
              })
            
        }
        if(empty_truck_weight == ""){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Input Truck Weight!',
                
              })
            
        }
        if(full_weight == ""){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Input Full Weight!',
                
              })
            
        }
        var difference = barcode_array.filter(x => barcode_list.indexOf(x) === -1);
        
       
        var params = {"date":date,"customer":customer,"vechicles":vechicles,"loader":loader,"driver":driver,"empty_truck_weight":empty_truck_weight,"full_weight":full_weight};
        fetch('app/save_edit',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body:JSON.stringify({barcode_diff:difference,otherdetails:params,id:id})
        })
        .then(response=>response.json())
        .then(data=>{
            
            
            if(data== "Update Completed"){
                 history.replaceState(null, null, ' ');
                 loadUrl(document.location.href)
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops..',
                    text: data,
                    
                  })
            }
        })
         

    })

}