document.getElementById('wrapper');

let user = document.getElementById('user').value;

let props = "";

let content = $(` <div class="contain">
                        <div class="return"><h3>Jumboreel Return</h3></div>
                    </div>
                    <div class="container">

                        
                        <div class="tabs-2">
                           
                            <div class="form-control" >
                                <input type="radio" value="Partial" class="radio"/><label class="label">Partially Consumed</label>
                            </div>

                            <div class="form-control">
                                 <input type="radio"  value="Total" class="radio"/><label class="label">Non Consumed</label>
                            </div>
                         
                        </div>
                        <div class="companySelect">
                            <select id="company_id" class="form-control">

                            </select>

                        </div>

                        <div class="scan">
                                <div class="returnScanner"> 
                                    <input type="text" class="form-control"  placeholder="Enter Barcode" id="scanbarcode"/>
                                   <input type="submit" class=" form-control-me " value="Enter" id="Save" disabled /> 
                                </div> 
                                
                                
                                <table class="table table-striped" id="tableScan">

                                <thead>
                                    <tr>
                                        <th scope="col">SN</th>
                                        <th scope="col">Barcode</th>
                                        <th scope="col">Product</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Weight</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="my-tbody" id="my-tbody">

                                <tbody>


                            </table>
                        </div>

                        


                    </div>

                `)

                //content.find('#date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker( 'setDate');
                
            
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
                        
                        content.find('#company_id').append(dataset)
                        
                })
                .catch(err=>{
                    console.log(err)
                })
            $(wrapper).html(content);



        document.querySelector('.tabs-2').addEventListener('click',function(e){
            let x =  document.querySelectorAll('.radio');
                for(let i=0;i<x.length;i++){

                    if(x[i].checked){
                       
                        x[i].checked = false
                    }
                }
                e.target.checked = true;

                if(e.target.value){
                    props = e.target.value
                    document.getElementById('Save').disabled = false
                    document.querySelector('tbody').innerHTML=""
                }
                else{
                    document.getElementById('Save').disabled = true
                    document.querySelector('tbody').innerHTML=""
                }

                // console.log(e.target.value)
            
        })


        document.getElementById('Save').addEventListener('click',function(e){
            
            var barcode = document.getElementById('scanbarcode').value;
            
            var company_id = document.getElementById('company_id').value
         

            if(!barcode){
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

            
            fetch('app/jumboreel_return/barcode',{
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify({barcode:barcode,props:props,company_id})
            })
            .then((response)=>response.json())
            .then(res=>{

                //    console.log(res)
                
                //     return false
                
                    console.log("res",res)
                    if(res.status){
                        if(props === "Partial"){
                                dataset = `
                                    <tr>
                                        <td>1</td>
                                        <td>${res.data.barcode}</td>
                                        <td>${res.data.productname}</td>
                                        <td><img src="/bil/js/bpl/rm_store_exit/check.svg" width="30"/></td>
                                        <td><input type="number" class="form-control weightedit" min="1" value=${res.data.weight} id="weightedit" ></td>
                                        <td><img src="/bil/js/bpl/rm_return/save.png" class="saveProp closed"  width="40"/></td>

                                    </tr>

                                `
                        }
                        else if(props === "Total"){
                            dataset = `
                                        <tr>
                                            <td>1</td>
                                            <td>${res.data.barcode}</td>
                                            <td>${res.data.productname}</td>
                                            <td><img src="/bil/js/bpl/rm_store_exit/check.svg" width="30"/></td>
                                            <td>${res.data.weight}</td>
                                            <td><img src="/bil/js/bpl/rm_return/save.png" class="saveProp closed" width="40"/></td>

                                        </tr>
                                    `

                        }

                           
                                
                            $(".my-tbody").append(dataset);
                            document.getElementById('scanbarcode').value=""
                            document.getElementById('Save').disabled = true
                            saveProps(res.data.weight,res.data.barcode,res.data.productname,company_id);
                    }
                    else{
                        Swal.fire(
                            'Error!',
                            res.data,
                            'error'
                        )
                        // $(".my-tbody").remove();
        
                    }
        
                    
            })
            .catch(err=>{

                console.log(err);
            })
        
        })


       

    function saveProps(oldweight,barcode,productname,company_id){
        document.querySelector('.saveProp').addEventListener('click',function(e){
            let newweight = 0;
            if(props === "Partial"){
                newweight  = document.getElementById('weightedit').value;
            }
            else if(props === "Total"){
                newweight = oldweight
            }

            if(props === "Total" && parseInt(newweight) > oldweight){
                Swal.fire(
                    'Weight Error!',
                    props,
                    'error'
                )
                return false;
            }
            if(props === "Partial" && parseInt(newweight) >= oldweight){
                Swal.fire(
                    'Weight Error!',
                    'Invalid Weight',
                    'error'
                )
                return false;
            }

          

            if(parseInt(newweight) < 1){
                Swal.fire(
                    'Weight Error!',
                    'Invalid Weight',
                    'error'
                )

                return false;
            }

            const last = barcode.charAt(barcode.length - 1);
            let UsedType = false
            if((/[a-zA-Z]/).test(last)){
                 UsedType = true;
            }
            else{
                 UsedType = false;
            }

            
            fetch('app/jumboreel_return/savereturn',{
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify({
                    barcode:barcode,
                    productname:productname,
                    newweight:newweight,
                    user:user,
                    props:props,
                    UsedType:UsedType,
                    company_id

                })
            })
            .then((response)=>response.json())
            .then(res=>{
                console.log(res);
                
                if(res.status){
                    Swal.fire(
                        'Success!',
                        res.data,
                        'success'
                    )

                   
                    document.querySelector('tbody').innerHTML=""
                    let x =  document.querySelectorAll('.radio');
                    for(let i=0;i<x.length;i++){

                        if(x[i].checked){
                           
                            x[i].checked = false
                        }
                    }
                    // if(props === "Partial"){
                    //     window.open('app/rawmaterials/newbarcode/'+barcode, '_blank')
                    // }
                   
                }
                else{
                    Swal.fire(
                        'Error!',
                        res.data,
                        'error'
                    )
                }
        

        
                    
            })
            .catch(err=>{
                console.log(err);
            })







        })

    }
           
              

