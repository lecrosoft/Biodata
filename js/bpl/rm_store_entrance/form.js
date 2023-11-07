document.getElementById('wrapper');

let user = document.getElementById('user').value;
let access = document.getElementById('access').value;


let content = $(` 
                    <div class="contain">
                        <div><h3>Raw Material Store Entrance</h3></div>

                        <div></div>
                    </div>
                    <div class="xcontain">

                        <div class="flex1">
                                <div class="cover">
                                        <label>User</label>
                                        <input type="text" class="form-control" value=${user} disabled/>
                                    
                                </div>
                               

                                <div class="cover">
                                    <label>Date</label>
                                    <input type="text" id="date" value=${new Date}  class="form-control" ${access == 1 ? '' : 'disabled'} />
                                    
                                </div>
                                <div class="cover">
                                    <label>Company</label>
                                    <select class="form-control" id="select_company">

                                    </select>
                                    
                                </div>

                                <div class="coverx">
                                
                                    <input type="submit" class="form-control" value="Save" id="Save" disabled/>    
                                    
                                </div>
                        </div>

                        <div class="flex2">
                                <div class="cover">
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

        $(wrapper).html(content);

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
                
                content.find('#select_company').append(dataset)
                
        })
        .catch(err=>{
            console.log(err)
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
            }
            else{
                document.getElementById('Save').disabled = true
            }

            tr.removeChild(td)

           
            
    }
})

document.getElementById('Save').addEventListener('click',function(e){
    let date = document.getElementById('date').value;
    let company_id = document.getElementById('select_company').value;
    fetch('app/rawmaterials/storeentrance/save',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            barcodes:barcodeArray,
            user:user,
            date:date,
            location_id:1,
            company_id

        })
    })
    .then((response)=>response.json())
    .then(res=>{
        
       if(res.status){
            Swal.fire(
                'Success!',
                res.message,
                'success'
            )
            document.getElementById('my-tbody').innerHTML=" ";
            barcodeArray=[];
            document.getElementById('select_company').disabled=false
            console.log('barcode',barcodeArray)
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
        console.log(err)
    })
})
       
