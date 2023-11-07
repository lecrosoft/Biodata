let barcodeArray = [];
function ScanCode(){

let barcode = document.getElementById('scanbarcode').value;
let company = document.getElementById('company').value

    if(barcodeArray.includes(barcode)){
        Swal.fire(
            'Error!',
            'Barcode Already Scanned',
            'error'
        )
        return false; 
    }

    fetch('app/jumboreel/barcode',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({barcode,company})
    })
    .then((response)=>response.json())
    .then(res=>{
       
          
            let dataset = "";
            
            if(res.status){
               
                barcodeArray.push(res.data[0].barcode)
                    dataset = `
                                    <tr>
                                        <td>${barcodeArray.length}</td>
                                        <td>${res.data[0].barcode}</td>
                                        <td>${res.data[0].productname}</td>
                                        <td><img src="/bil/js/bpl/rm_store_exit/check.svg" width="30"/></td>
                                        <td>${res.data[0].weight}</td>
                                        <td><img src="/bil/js/bpl/rm_store_exit/close.svg" class="closed" width="20"/></td>

                                    </tr>

                                `
                        
                    $(".my-tbody").append(dataset);
                    document.getElementById('scanbarcode').value=""
                    
                    if(barcodeArray.length > 0){
                        document.getElementById('Save').disabled = false
                        document.getElementById('company').disabled = true
                    }
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



}





    