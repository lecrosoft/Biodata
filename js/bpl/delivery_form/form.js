


function form (){
    //const { id,date,customer_name, vechile_number,loader,driver_name,Emptyweight } = data
    //console.log(data)
   // fetch();
   if (sessionStorage.getItem("formData") === null) {
    
   }
   else{
    var data = JSON.parse(sessionStorage.getItem('formData'));
        
        
    
   }
   
   
   let content = $(`
                    <div class="container">
                        <div>
                            <div class="circleSemi" id="semi-circle"></div>
                            <div class="d-flex justify-content-center">
                                <img src="/bil/images/belpapyrus_companies logo.png" width="150px" height="100px"/>
    
                            </div>
                        </div>
                        
                        <div style="width:100%;margin:auto;margin-top:50px">
                            
                            <div class="container">
                                <div class="d-flex justify-content-between mb-4">
                                    <div class="col-4 text-center" style="font-size:25px">Fill in the details</div>
                                    <div class="col-3 text-center align-self-end" style="font-size:14px;cursor:pointer;color:#3C7FBD;font-weight:bold"><a href="/bil/report_bpl_delivery">View Details</a></div>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-4 justify-content-center text-center">
                                    
                                        <input type="text" class="form-control" placeholder="Date" id="date" value="${sessionStorage.getItem("formData") === null ? new Date:  formVal(data[0].date)}"/>
                                    </div>
                                    <div class="col-6 text-center">
                                        
                                        <select id="customers" name="customers" class="form-control">
                                              <option value=""> Select Customer</option>
                                              
                                        </select>
                                    </div>
                                </div>

                                <div class="row justify-content-center mt-3">
                                    <div class="col-4 justify-content-center text-center">
                                        <input type="text" autocomplete="off" name="vechiles" id="vechiles" list="Datalist_vechiles" class="form-control customer-dep" placeholder="Truck Number" value="${sessionStorage.getItem("formData") === null ? "":  formVal(data[0].vechile_number)}" disabled>
                                            <datalist id="Datalist_vechiles">
                                                
                                            </datalist>
                                    </div>
                                    <div class="col-6 text-center">
                                        <input type="text" autocomplete="off" name="loader" id="loader" list="Datalist_loader" class="form-control customer-dep" placeholder="Loader" value="${sessionStorage.getItem("formData") === null ? "":  formVal(data[0].loader)}" disabled>
                                            <datalist id="Datalist_loader">
                                        
                                            </datalist>
                                    </div>
                                </div>

                                <div class="row justify-content-center mt-3">
                                    <div class="col-4 justify-content-center text-center">
                                        <input type="text" autocomplete="off" name="driver" id="driver" list="Datalist_driver" class="form-control customer-dep" value="${sessionStorage.getItem("formData") === null ? "":  formVal(data[0].driver)}" placeholder="Driver name" disabled>
                                            <datalist id="Datalist_driver">
                                
                                            </datalist>
                                    </div>
                                    <div class="col-6 text-center">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <input type="text" class="form-control customer-dep" placeholder="Container Number" value="${sessionStorage.getItem("formData") === null ? "":  formVal(data[0].container_number)}" id="container_number" disabled/>
                                            </div>
                                            <div class="col-md-6">
                                             <input type="number" class="form-control customer-dep" placeholder="Empty Truck Weight" value="${sessionStorage.getItem("formData") === null ? "":  formVal(data[0].truck_weight)}" id="empty_truck_weight" disabled/>
                                            </div>
                                            
                                        
                                       
                                        </div>
                                        
                                    </div>
                                </div>

                                <div class="row justify-content-center mt-3">
                                    <div class="col-6 text-center mt-4">
                                        <button class="form-control" style="background-color:#3cbdaf;color:#fff" id="next">Next</button>
                                    </div>
                                     
                                </div>

                        </div>

                    <div>       
                       
                 `);
                 //${sessionStorage.getItem("formData") === null ? "":  formVal(data[0].customerid)}
                 
                 fetch('app/getcustomers')
                 .then(response => response.json())
                 .then(fetch_data => {

                    
                    
                    fetch_data[3].forEach(d => {
                        //console.log(d['customername'])
                        content.find('#customers').append(`<option value="${d['customername']}">${d['customername']}</option>`)
                        
                    });
                    fetch_data[0].forEach(d => {
                        //console.log(d['loader'])
                        content.find('#Datalist_loader').append(`<option value="${d['loader']}"></option>`)
                        
                    });
                    fetch_data[1].forEach(d => {
                        //console.log(d['customername'])
                        content.find('#Datalist_vechiles').append(`<option value="${d['vechile_number']}"></option>`)
                        
                    });
                    fetch_data[2].forEach(d => {
                        //console.log(d['customername'])
                        content.find('#Datalist_driver').append(`<option value="${d['driver']}"></option>`)
                        
                    });
                    
                    var x = document.querySelectorAll('.customer-dep')
                    var customer_name = formVal(data[0].customer_name)
                    console.log('here')
                    if(customer_name !== "Belimpex Limited"){
                        
                      
                        for (let index = 0; index < x.length; index++) {
                            x[index].removeAttribute('disabled')
                        }
                    }
                    else{
                        
                        document.getElementById('vechiles').value=""
                        document.getElementById('loader').value ="";
                        document.getElementById('driver').value="";
                        document.getElementById('empty_truck_weight').value=""
                        document.getElementById('container_number').value="";
                        //var x = document.querySelectorAll('.customer-dep')
                        for (let index = 0; index < x.length; index++) {      
                            x[index].setAttribute('disabled',"") 
                        }
                    }

                    document.querySelector('#customers').value = sessionStorage.getItem("formData") === null ? "":  formVal(data[0].customer_name)
                 });
                 content.find('#date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker( 'setDate');
            $("#wrapper").html(content)
            restriction();
            //var customerList = document.getElementById('customers');
                 
           // $('#customers option[value="'+formVal(data[0].customerid)+'"]').attr('selected',true);
           //console.log('Before',document.querySelector('#customers').value)
           //document.querySelector('#customers').value = "aaab";
           //console.log('After',document.querySelector('#customers').value)
           // $('#customers').val('Belimpex Limited'); 
            /*    
            if(document.getElementById('customers').value === 17){
                
                var x = document.querySelectorAll('.customer-dep')
                for (let index = 0; index < x.length; index++) {      
                    x[index].setAttribute('disabled',"") 
                }
            }
            else{
                var x = document.querySelectorAll('.customer-dep')
                for (let index = 0; index < x.length; index++) {      
                    x[index].removeAttribute('disabled')  
                }
            }
            */



            $('#customers').on('select2:select', function (e) {
                var data = e.params.data.text;
                console.log(data)
                var x = document.querySelectorAll('.customer-dep')
                if(data != "Belimpex Limited"){
                    
                    for (let index = 0; index < x.length; index++) {
                        x[index].removeAttribute('disabled')
                    }
                        
                }
                else{
                   // alert("I am here",e.target.value)
                    for (let index = 0; index < x.length; index++) {
                        x[index].value=""
                        x[index].setAttribute('disabled',"")
                    }
                }

            });
            // customerList.addEventListener('change',function(e){
            //     console.log('hello')
                
            //    console.log(e.target)
                
            // })
            
    var next = document.getElementById('next');
    
    next.addEventListener('click',function(e){
        
        var date = document.getElementById('date').value;
        var customer = document.getElementById('customers').value;
        var vechiles = document.getElementById('vechiles').value;
        var loader = document.getElementById('loader').value;
        var driver = document.getElementById('driver').value;
        var empty_truck_weight = document.getElementById('empty_truck_weight').value;
        var container_number = document.getElementById('container_number').value;
        
        if(customer == ""){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Select the customer name!',
                
              })
            
        }
       
        if(customer == "Belimpex Limited"){
            
            //data = [date,customer,empty_truck_weight,loader,vechiles,driver]
            
            data = [
                {
                'date':date,
                'customer_name':customer,
                'truck_weight':0,
                'loader':loader,
                'vechile_number':vechiles,
                'driver':driver,
                'created_at':new Date(),
                'updated_at':new Date(),
                'container_number':container_number
                }
            ]
                sessionStorage.setItem('formData',JSON.stringify(data))
                scan_barcode()
                location="#scan"
          
        }
        else if(customer != "Belimpex Limited" && customer!= ""){
            
            if(vechiles == ""){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'The vechicle Number is Required!',
                    
                  })
            }
            else if(loader == ""){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'The Loader is Required!',
                    
                  })
            }
            else if(driver == ""){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'The Driver Name is Required!',
                    
                  })
            }
            else if(empty_truck_weight == ""){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'The Truck Weight is Required!',
                    
                  })
            }
            else{
                data = [
                        {
                        'date':date,
                        'customer_name':customer,
                        'truck_weight':empty_truck_weight,
                        'loader':loader,
                        'vechile_number':vechiles,
                        'driver':driver,
                        'created_at':new Date(),
                        'updated_at':new Date(),
                        'container_number':container_number,
                        }
                    ]
                sessionStorage.setItem('formData',JSON.stringify(data))
                scan_barcode()
                location="#scan"
            }
        }
    })
    //dEFINE SELEC2
    $('#customers').select2({
        placeholder: "Select Customer",
        selectOnClose: true,
            
    });
    
   
}

function restriction(){
    
        var authorizedAccessLevel = ["1"];
        var getUseraccess = document.querySelector('#access').value
       
        var check = authorizedAccessLevel.includes(getUseraccess)
        if(!check){
            $("input").attr('disabled','disabled');
        }
        
    
}
