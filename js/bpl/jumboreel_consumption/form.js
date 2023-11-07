document.getElementById('wrapper');

let user = document.getElementById('user').value;


let content = $(` <div class="contain">
                        <div><h3>Jumboreel Consumption</h3></div>
                    </div>
                    <div class="container">

                        <div class="tabs">
                                <div class="">
                                        <label>User</label>
                                        <input type="text" id="user" class="form-control" value=${user} disabled/>
                                    
                                </div>
                                <div class="">
                                    <label>Shift</label>
                                    <select class="form-control" id="shift">
                                            <option value="Day">Day Shift</option>
                                            <option value="Night">Night Shift</option>
                                    </select>
                                    
                                </div>

                                <div class="">
                                    <label>Date</label>
                                    <input type="text" id="date" value=${new Date}  class="form-control"/>
 
                                </div>

                             
                        </div>
                        <div class="tabs-2">
                           

                            <div class="">
                                <label>Factory</label>
                                <select class="form-control" id="factory">
                                    <option value=''>Select Factory</option>
                                </select>
                            </div>
                            <div class="">
                                <label>Machine Line</label>
                                <select class="form-control" id="line">
                                    
                                </select>
                            </div>
                            
                            <div class="">
                                <label>Product On Line</label>
                                <select class="form-control" id="product">
                                    
                                </select>
                            </div>
                            <div class="">
                                <label>Select Company</label>
                                <select class="form-control" id="company">
                                    
                                </select>
                            </div>
                           
                        </div>

                        <div>
                            <div class="SaveDiv">
                                <input type="submit" class="btn-primary" value="Enter" id="Save" /> 
                            </div>
                        </div>

                        <div class="scan">
                                <div class=""> 
                                   <label>Scan Barcode</label> <input type="text" class="form-control" id="scanbarcode" onChange="ScanCode()"/>
                                </div>
                                
                                    <table class="table table-striped" id="tableScan">

                                        <thead>
                                            <tr>
                                                <th scope="col">SN</th>
                                                <th scope="col">Barcode</th>
                                                <th scope="col">Product</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Weight</th>
                                                <th scope="col">Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody class="my-tbody" id="my-tbody">

                                        <tbody>


                                    </table>
                                  
                                
                                
                        </div>


                    </div>

                `)

                content.find('#date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker( 'setDate');
                

                fetch('app/rawmaterials/getcompany',{
                    method:'GET', 
                    headers: {
                        'Content-Type': 'application/json',
                      }
            
                })
                .then(response=>response.json())
                .then(res=>{
                    let dataset = ''
                        res.forEach(d => {
                            dataset+=`<option value=${d.id}>${d.company_name}</option>`
                        });
                        
                    content.find('#company').append(dataset);
                   
                        
                })
                .catch(err=>{
                    console.log(err)
                })


                
                fetch('app/rawmaterials/getfactory',{
                    method:'GET', 
                    headers: {
                        'Content-Type': 'application/json',
                      }
            
                })
                .then(response=>response.json())
                .then(res=>{
                   
                    let dataset = ''
                        res.forEach(d => {
                            dataset+=`<option value=${d.id}>${d.location}</option>`
                        });
                        
                    content.find('#factory').append(dataset);
                        
                })
                .catch(err=>{
                    console.log(err)
                })

                $(wrapper).html(content);


            document.getElementById('factory').addEventListener('change',function(e){
                if(e.target.value){
                    
                     
                fetch('app/rawmaterials/getline/'+e.target.value,{
                    method:'GET', 
                    headers: {
                        'Content-Type': 'application/json',
                      }
            
                })
                .then(response=>response.json())
                .then(res=>{
                //    console.log(res);
                    let dataset = ''
                        res.forEach(d => {
                            dataset+=`<option value="${d.linename}">${d.linename}</option>`
                        });

                        document.getElementById('line').innerHTML=""
                        
                        content.find('#line').append(`<option value=''>Select Line</option>`)
                        content.find('#line').append(dataset)
                        
                })
                .catch(err=>{
                    console.log(err)
                })

                }
            })
            document.getElementById('line').addEventListener('change',function(e){
               
                if(e.target.value){
                    fetch('app/rawmaterials/getmachine/'+e.target.value,{
                        method:'GET', 
                        headers: {
                            'Content-Type': 'application/json',
                          }
                
                    })
                    .then(response=>response.json())
                    .then(res=>{

                        
                        let dataset1 = ''

                            res.products.forEach(d=>{
                                if(d.productname === res.preproduction){
                                    dataset1+=`<option value="${d.productid}" selected>${d.productname}</option>`
                                }
                                
                                
                            })

                         
    
                            // document.getElementById('machine').innerHTML=""
                            document.getElementById('product').innerHTML=""

                            // content.find('#machine').append(`<option value=''>Select Machine</option>`);
                            // content.find('#machine').append(dataset);

                            // content.find('#products').append(`<option value=''>Select Machine</option>`);
                            content.find('#product').append(dataset1);

                            
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }

            })

            var table  = document.getElementById('tableScan');

table.addEventListener('click',function(e){
    
    if(e.target.classList.contains('closed')){
            
            var x  = e.target.parentNode;
            
            var td = x.parentNode;

            var tr = td.parentNode;
        
            
            for( var i = 0; i < barcodeArray.length; i++){ 

                if ( barcodeArray[i] === td.children[1].textContent) { 
            
                    barcodeArray.splice(i, 1); 
                }
            
            }

            if(barcodeArray.length > 0){
                document.getElementById('Save').disabled = false
                document.getElementById('company').disabled = true
            }
            else{
                document.getElementById('Save').disabled = true
                document.getElementById('company').disabled = false
            }

            tr.removeChild(td)

           
            
    }
})

document.getElementById('Save').addEventListener('click',function(e){
    
    var factory = document.getElementById('factory').value;
    var line = document.getElementById('line').value;
    var machine = "machine"
    var product = document.getElementById('product').value;
    var date = document.getElementById('date').value;
    var shift = document.getElementById('shift').value;
    var user = document.getElementById('user').value;
    var company = document.getElementById('company').value;
    
    if(factory === ""){
        Toastify({
            text: "Select Factory",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            //   background: "linear-gradient(to right, #00b09b, #96c93d)",
            background:"#500000"
            },
            onClick: function(){} // Callback after click
          }).showToast();
          return false;
    }

    if(line === ""){
        Toastify({
            text: "Select Line",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            //   background: "linear-gradient(to right, #00b09b, #96c93d)",
            background:"#500000"
            },
            onClick: function(){} // Callback after click
          }).showToast();
          return false;
    }

    if(machine === ""){
        Toastify({
            text: "Select Machine Type",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            //   background: "linear-gradient(to right, #00b09b, #96c93d)",
            background:"#500000"
            },
            onClick: function(){} // Callback after click
          }).showToast();
          return false;
    }

    if(product === ""){
        Toastify({
            text: "Select Product",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            //   background: "linear-gradient(to right, #00b09b, #96c93d)",
            background:"#500000"
            },
            onClick: function(){} // Callback after click
          }).showToast();
          return false;
    }

    if(barcodeArray.length === 0){
        Toastify({
            text: "Scan Barcode",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            //   background: "linear-gradient(to right, #00b09b, #96c93d)",
            background:"#500000"
            },
            onClick: function(){} // Callback after click
          }).showToast();
          return false;
    }


    fetch('app/jumboreel/consumption/save',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            barcodes:barcodeArray,
            user:user,
            date:date,
            shift:shift,
            factory:factory,
            line:line,
            machine:machine,
            product:product,
            company


        })
    })
    .then((response)=>response.json())
    .then(res=>{

        console.log(res);

       
       if(res.status){
            Swal.fire(
                'Success!',
                res.message,
                'success'
            )
            document.getElementById('my-tbody').innerHTML=" ";

            barcodeArray=[];
            document.getElementById('company').disabled = false
            // console.log('barcode',barcodeArray)
       }
       else{
        Swal.fire(
            'Error!',
            res.message,
            'error'
        )
        
       }
    })
    .catch(err=>{
        console.log(err);
        Swal.fire(
            'Error!',
            err.error,
            'error'
        )
    })

    





})
           
              

