document.getElementById('wrapper');

let user = document.getElementById('user').value;


let content = $(` <div class="contain">
                        <div class=""><h3>Return Awaiting Approvals</h3><hr/></div>
                    </div>
                    <div class="container">

                        <div class="scan">

                                <table class="table table-striped" id="tableScan">

                                <thead>
                                    <tr>
                                        <th scope="col">SN</th>
                                        <th scope="col">Barcode</th>
                                        <th scope="col">Product</th>
                                        <th scope="col">Company</th>
                                        <th scope="col">Return Type</th>
                                        <th scope="col">Current Weight</th>
                                        <th scope="col">User</th>
                                        <th scope="col">Status</th>
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
                
                
            $(wrapper).html(content);

            fetchAwaiting(user);
          






        // document.getElementById('Save').addEventListener('click',function(e){
            
        //     var barcode = document.getElementById('scanbarcode').value;
            
        //     if(!barcode){
        //         Toastify({
        //             text: "Scan Barcode",
        //             duration: 3000,
        //             destination: "https://github.com/apvarun/toastify-js",
        //             newWindow: true,
        //             close: true,
        //             gravity: "top", // `top` or `bottom`
        //             position: "right", // `left`, `center` or `right`
        //             stopOnFocus: true, // Prevents dismissing of toast on hover
        //             style: {
        //             //   background: "linear-gradient(to right, #00b09b, #96c93d)",
        //             background:"#500000"
        //             },
        //             onClick: function(){} // Callback after click
        //         }).showToast();
        //         return false;
        //     }

            
        //     fetch('app/rawmaterials_return/barcode',{
        //         method:'POST',
        //         headers:{
        //             'Content-type':'application/json'
        //         },
        //         body:JSON.stringify(barcode,props)
        //     })
        //     .then((response)=>response.json())
        //     .then(res=>{
        //         console.log(res)
        
                   
        //     })
        //     .catch(err=>{
        //         console.log(err);
        //     })
        
        // })


     