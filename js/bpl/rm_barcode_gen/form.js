
    const wrapper = document.getElementById('wrapper');

    function barcodeForm (){
        let content = $(`<div class="container">
                <div class="title">Rawmaterial Barcode Generator</div>
                <div class="mini-section">
                    <label>Current Date</label>
                    <input type="text" id="date" value=${new Date}  class="form-control date"/>
                </div>
                <div class="mini-section">
                    <label>Company Name</label>
                    <select class="form-control select-form" id="select_form">
                        <option>Select Company</option>
                       
                    </select>
                </div>
                <div class="section">
                    <div>
                        <label> Product Name</label>
                        
                            <select class="form-control" id="products" required>
                                <option value="">Select Product</option>
                            </select>
                    </div>

                    <div>
                        <label> Supplier</label>
                        
                            <select class="form-control supplier" id="supplier" required>
                                <option value="">Select Supplier</option>
                            </select>
                    </div>


                </div>

                <div class="mini-section">
                    <label>Weight/Kg</label>
                    <input type="number" id="weight"  class="form-control date" required/>

                </div>

                <div class="mini-section">
                    <label>Number Of Barcode</label>
                    <input type="number" id="numBarcode"  class="form-control date" required/>

                </div>

                <div class="btn-div">
                    <input type="submit" id="save" value="Create Barcode" class="form-control btn"/>
                </div>


            <div>

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
                    
                    content.find('#select_form').append(dataset)
                    
            })
            .catch(err=>{
                console.log(err)
            })


            $(wrapper).html(content)
            $('#products').select2();
            $("#supplier").select2();
            document.getElementById('supplier').value=""
            document.getElementById('products').value=""
            document.getElementById('weight').value=""
            document.getElementById('numBarcode').value=""
            attached();


            document.querySelector('#select_form').addEventListener('change',function(e){

                    var company_id = document.getElementById('select_form').value;
                    console.log(company_id)
                    document.getElementById('supplier').innerHTML=""
                    document.getElementById('products').innerHTML=""

                    document.getElementById('supplier').value=""
                    document.getElementById('products').value=""

                    fetch('app/rawmaterials/getsuppliers',{
                        method:'POST', 
                        headers: {
                            'Content-Type': 'application/json',
                          },
                        body:JSON.stringify({company_id})
                
                    })
                    .then(response=>response.json())
                    .then(res=>{

                        console.log(res)
                        let dataset = ''
                            res.forEach(d => {
                                dataset+=`<option value=${d.suppliercode}>${d.suppliername}</option>`
                            });
                            
                            content.find('#supplier').append(dataset)
                            
                    })
                    .catch(err=>{
                        console.log(err)
                    })



                    
                    fetch('app/rawmaterials/getproducts',{
                        method:'POST', 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify({company_id})
                
                    })
                    .then(response=>response.json())
                    .then(res=>{
                        console.log(res)
                        let dataset = ''
                            res.forEach(d => {
                                dataset+=`<option value=${d.id}>${d.productname}</option>`
                            });
                            content.find('#products').append(dataset)
                            
                    })
                    .catch(err=>{console.log(err)})

                   


            });
           
        
           
    }


    function attached(){
        
        document.getElementById('save').addEventListener('click',function(){
           
            

            if(document.getElementById('date').value === ""){
                Toastify({
                    text: "Date Cannot Be Empty",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                    //   background: "linear-gradient(to right, #00b09b, #96c93d)",
                    background:"#ff0000"
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();
                  return false
            }

            if(document.getElementById('products').value === ""){
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
                    background:"#ff0000"
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();
                  return false
            }

            if(document.getElementById('supplier').value === ""){
                Toastify({
                    text: "Select Supplier",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                    //   background: "linear-gradient(to right, #00b09b, #96c93d)",
                    background:"#ff0000"
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();
                  return false
            }

            if(document.getElementById('weight').value === ""){
                Toastify({
                    text: "Input Weight",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                    //   background: "linear-gradient(to right, #00b09b, #96c93d)",
                    background:"#ff0000"
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();
                  return false
            }
            if(document.getElementById('numBarcode').value === ""){
                Toastify({
                    text: "Input Number of Barcode To be Generated",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                    //   background: "linear-gradient(to right, #00b09b, #96c93d)",
                    background:"#ff0000"
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();
                  return false
            }
            if(document.getElementById('numBarcode').value > 50){
                
                Swal.fire(
                    'Error!',
                    'Barcode Generated Numbers cannot Exceed 50 @ once',
                    'error'
                )
                return false
            }

            if(document.getElementById('date') !="" && document.getElementById('products') !="" && document.getElementById('supplier') !="" && document.getElementById('weight') !="" && document.getElementById('numBarcode') !=""){
            
                
                //loadUrl("rawmaterial_barcode_generator#confirmweight");
                _push("rawmaterial_barcode_generator#confirmweight")
                
                // if(document.getElementById('numBarcode').value > 1){
                //     $barcodeText="barcodes";
                // }
                // else{
                //     $barcodeText= "barcode";
                // }
                
                // Swal.fire({
                //     title: `You are about to Create ${document.getElementById('numBarcode').value} ${$barcodeText}`,
                //     text: "Click Yes to Confirm!",
                //     icon: 'warning',
                //     showCancelButton: true,
                //     confirmButtonColor: '#3085d6',
                //     cancelButtonColor: '#d33',
                //     confirmButtonText: 'Yes, Confirm'
                //   }).then((result) => {
                //     if (result.isConfirmed) {
                //     //   Swal.fire(
                //     //     'Deleted!',
                //     //     'Your file has been deleted.',
                //     //     'success'
                //     //   )
                //     generateBarcode();
                //     }
                //   })
                
                
            }
            

            // generateBarcode();
        })
    }

    



