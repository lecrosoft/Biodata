let barcodeArray = [];
function ScanCode(){

let barcode = document.getElementById('scanbarcode').value;

    let company_id = document.getElementById('select_company').value
    if(company_id ===""){
        Swal.fire(
            'Error!',
            'Select a company',
            'error'
        )
            return false;
    }
    if(barcodeArray.includes(barcode)){
        Swal.fire(
            'Error!',
            'Barcode Already Scanned',
            'error'
        )
        return false; 
    }

    fetch('app/rawmaterials/storeexit',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({barcode,company_id})
    })
    .then((response)=>response.json())
    .then(res=>{
        console.log(res)

        // console.log(res)

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
                        document.getElementById('select_company').disabled= true
                        document.getElementById('select_store').disabled= true 
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





    