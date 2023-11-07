let weight = [];

function adjustbarcodeweight(){
  

    if(document.getElementById('numBarcode')){
            var numBarcode = document.getElementById('numBarcode').value;
            var inputtedweight = document.getElementById('weight').value;
            var supplier = document.getElementById('supplier').value;
            var product = document.getElementById('products').value;
            let date = document.getElementById('date').value
            let user = document.getElementById('user').value
            let company_id = document.getElementById('select_form').value

            
            let textfield = "";
            let content = $(
                ` 
                    <div class="container">
                            <h3>You are  about to print ${numBarcode} barcodes</h3>
                            <div class="spinnedbarcode" >
                            
                                
                            </div>
                            <div class="btn-confirm">
                                    <input type="submit" id="save" value="Confirm" class="form-control btn"/>
                            </div>
                            
                            
                    </div>

                `
            )


            for(let i=0;i<numBarcode;i++){
                textfield+= `<div style="margin:auto"><input type="text"  style="text-align:center;width:200px;margin-top:10px" class="form-control editted" value=${inputtedweight}><div>`;
            }
            content.find('.spinnedbarcode').append(textfield);
            $(wrapper).html(content);

            confirm(supplier,product,date,user,numBarcode,company_id);
        }
        else{
            _push('rawmaterial_barcode_generator')
        }
        
    }
    

function confirm(supplier,product,date,user,numBarcode,company_id){

    
        
    document.querySelector('#save').addEventListener('click',function(e){

        const x = document.querySelectorAll('.editted');
        
        for(let i=0;i<x.length;i++){
            weight.push(x[i].value)

        }

        const item = {
            date:date,
            product:product,
            supplier:supplier,
            weight:weight,
            numBarcode:numBarcode,
            user:user,
            company_id:company_id
            
        }

        // console.log(item);

        // return false;
        
    fetch('app/rawmaterials/generatebarcode',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(item)
    })
    .then(response=>response.json())
    .then(res=>{
        console.log(res)
        if(res.status){
            
            window.open('app/rawmaterials/printout', '_blank')
            weight=[];
            setTimeout(() => _push('rawmaterial_barcode_generator'), 50)
           
        }
        
    })
    .catch(err=>{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err,
            
          })
    })

        

        

    })
    

   
}