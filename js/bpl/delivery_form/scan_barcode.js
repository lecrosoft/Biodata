const mybarcode_data=[];
var weight_sum = 0;
var save_details = [];
function scan_barcode(){
    
    var params = JSON.parse(sessionStorage.getItem('formData'))
        if(params == "" || params == null){
            history.replaceState(null, null, ' ');
             loadUrl(document.location.href)
        }
        let content = $(`
                        <div class="">
                            <div class="mb-4">
                                <div class="circleSemi" id="semi-circle"></div>
                                <div class="d-flex justify-content-center">
                                    <img src="/bil/images/belpapyrus_companies logo.png" width="150px" height="100px"/>
        
                                </div>
                            </div>
                            
                            <div class="d-flex mt-4">
                                <div class="col-3">
                                    <div class="card shadow-lg  mb-5 bg-body rounded">
                                        <div class="card-header">
                                            <img src="/bil/images/back.png" class="card-img-top class-back" alt="back" style="width:25px;cursor:pointer">
                                        </div>
                                        
                                        <div class="card-body p-4">
                                            <div class="d-flex justify-content-start">
                                                <div class="col-6 align-self-start" style="font-weight:bold">
                                                    Date:
                                                </div>

                                                <div class="col-6" style="font-size:bold">
                                                    ${params[0].date}
                                                </div>
                                            </div>
                                            <div class="d-flex justify-content-start mt-2">
                                                <div class="col-6 align-self-start" style="font-weight:bold">
                                                    Customer name:
                                                </div>

                                                <div class="col-6 " style="font-size:bold">
                                                    ${params[0].customer_name}
                                                </div>
                                            </div>
                                                ${params[0].customer_name == "Belimpex Limited" ? "" :`
                                                
                                                <div class="d-flex justify-content-start mt-2">
                                                    <div class="col-6 align-self-start" style="font-weight:bold">
                                                    Driver:
                                                    </div>

                                                    <div class="col-6" style="font-size:bold">
                                                        ${params[0].driver}
                                                    </div>
                                                </div>
                                                
                                                <div class="d-flex justify-content-start mt-2">
                                                    <div class="col-6 align-self-start" style="font-weight:bold">
                                                        Vechile number:
                                                    </div>

                                                    <div class="col-6" style="font-size:bold">
                                                    ${params[0].vechile_number}
                                                    </div>
                                                </div>

                                                <div class="d-flex justify-content-start mt-2">
                                                    <div class="col-6 align-self-start" style="font-weight:bold">
                                                        Container number:
                                                    </div>

                                                    <div class="col-6" style="font-size:bold">
                                                    ${params[0].container_number}
                                                    </div>
                                                </div>

                                                <div class="d-flex justify-content-start mt-2">
                                                    <div class="col-6 align-self-start" style="font-weight:bold">
                                                    Loader:
                                                    </div>

                                                    <div class="col-6" style="font-size:bold">
                                                        ${params[0].loader}
                                                    </div>
                                                </div>` }
                                            
                                            
                                            
                                            
                                        </div>
                                    </div>
                                </div>
                                <div style="width:50px; height:50px;border-radius:25px;border:1px solid #3CBDAF;background:#3CBDAF;position:absolute;z-index:2px;bottom:20px;right:30px;" class="d-flex justify-content-center">
                                        <img src="/bil/images/savebutton.png" style="width:30px;cursor:pointer" class="align-self-center save_button"/>    
                                </div>
                                <div style="width:100%">
                                    
                                    <div class="d-flex">
                                        <h5 class="align-self-center" style="font-weight:bold">Barcode:</h5><input type="text" id="barcode" autocomplete="off" autofocus class="form-control  align-self-start" style="margin-left:20px;width:50%"/>
                                        <div class="setLoader ml-4"></div>
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
                                                <tr class="table-light">
                                                <td style="font-weight:bold" id="Total">${weight_sum === 0 ? "":"Total"}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td style="font-weight:bold" id="weight_sum">${weight_sum === 0 ? "":weight_sum}</td>
                                                <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    
                                </div>
                            </div>
                            
                        <div>       
                        
                    `);

        /*
                    fetch('app/getcustomers')
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(d => {
                            //console.log(d['customername'])
                            content.find('datalist').append(`<option value="${d['customername']}"></option>`)
                        });
                    });
                    content.find('#date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker( 'setDate', date ? date : "now");
    */
        $("#wrapper").html(content)

         document.querySelector('.class-back').addEventListener('click',function(e){
             //var replace = location.hash.replace("#",'')
             weight_sum = 0;
             history.replaceState(null, null, ' ');
             
             loadUrl(document.location.href)
         })

         
    
         var barcode = document.querySelector('#barcode')
         barcode.addEventListener('change',function(e){
            if(e.target.value !=""){
                document.querySelector('.setLoader').classList.add('loader')
                barcode.setAttribute('disabled',"")
                fetch('app/barcode_details/'+ e.target.value)
                .then(response => response.json())
                .then(data => {
                    document.querySelector('.setLoader').classList.remove('loader')
                    barcode.removeAttribute('disabled')
                    
                   
                    if(data === "Barcode Already Scanned Out Of Store" || data === "Barcode Does'nt Exit"){
                        Swal.fire({
                            icon: 'error',
                            title: 'Barcode Scan Error',
                            text: data,
                            
                          })
                    }
                    else{
                        
                            var body = document.querySelector('tbody').children;
 
                            if(body.length > 0){
                                
                                var checks = mybarcode_data.includes(e.target.value)

                                if(checks){
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Barcode Scan Error',
                                        text: 'Barcode Already Scanned!',
                                        
                                      })
                                }
                                else{
                                    data.forEach(d => {
                                        mybarcode_data.push(d.barcode)
                                        weight_sum = weight_sum + parseInt(d.weight)
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
                                    e.target.value=""
                                    
                                    content.find('#weight_sum').html(weight_sum);

                                }
                                
                                
                                
                            }
                            else if(body.length===0)
                            {
                                
                                data.forEach(d => {
                                    mybarcode_data.push(d.barcode)
                                    
                                    save_details.push()
                                    weight_sum = weight_sum + parseInt(d.weight)
                                    document.getElementById('Total').innerHTML = "Total"
                                    content.find('tbody').append(`
                                    <tr class="myrow">
                                        <td>${d.barcode}</td>
                                        <td>${d.hardrollnumber}</td>
                                        <td>${d.gradetype}</td>
                                        <td>${d.productname}</td>
                                        <td>${d.weight}</td>
                                        <td><img src="/bil/images/close.png" style="width:20px;cursor:pointer" class="remove_item"/></td>
                                    </tr>`)
                                });
                                e.target.value=""
                                
                                content.find('#weight_sum').html(weight_sum);
                                
                            }
                             
                    }
                });
            }

        
         })

   
document.querySelector('tbody').addEventListener('click',function(e){
    //var child = document.querySelector(".myrow")
    //var parent = child.parentNode
    e.preventDefault();
    var parent = document.querySelector('tbody');
    
   var former_weight = document.querySelector('#weight_sum');
    
   // return false
    //var indexof = Array.prototype.indexOf.call(parent.children, child)
    //console.log(indexof)
    if(e.target.classList.contains('remove_item')){
        
        var x = e.target.parentNode;
        var tr = x.parentNode;
        
        //var indexof = Array.prototype.indexOf.call(parent.children, x.parentNode)
        //console.log(tr.children[0].textContent)
        for( var i = 0; i < mybarcode_data.length; i++){ 

            if ( mybarcode_data[i] === tr.children[0].textContent) { 
        
                mybarcode_data.splice(i, 1); 
            }
        
        }
        weight_sum = weight_sum - parseInt(tr.children[4].textContent)
        
        document.querySelector('#weight_sum').innerHTML = weight_sum
        weight_sum === 0 ? document.getElementById('weight_sum').innerHTML = "" : weight_sum
        weight_sum === 0 ? document.getElementById('Total').innerHTML = "" : "Total"
        tr.parentNode.removeChild(tr)
        
    }
    else{
       
    }
})   


document.querySelector('.save_button').addEventListener('click',function(e){
    
    if(mybarcode_data.length > 0 && params.length > 0 ){
        fetch('app/save_delivery_form',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body:JSON.stringify({barcode:mybarcode_data,otherdetails:params})
        })
        .then(response => response.json())
        .then(data =>{
        //   console.log(data)
        //    return false;
           if(data['status'] == "completed"){
               var barcode = data['barcode'];
               sessionStorage.removeItem("formData");
               window.open('app/print_out/'+barcode, '_blank')
               setTimeout(() => _push('bpl_delivery_form'), 500)
            }
            else if(data['status'] == "pending"){
                Swal.fire(
                    'Delivery Saved!',
                    'Provide the Full Weight to complete the process!',
                    'success'
                  )
                  sessionStorage.removeItem("formData");
                  
                  history.replaceState(null, null, ' ');
                 loadUrl(document.location.href)
            }
        }
           
        );
    }
        
    
})
        
}


