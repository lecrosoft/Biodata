function generateBarcode(){
    let date = document.getElementById('date').value
    let product= document.getElementById('products').value
    let supplier = document.getElementById('supplier').value
    let weight = document.getElementById('weight').value
    let numBarcode = document.getElementById('numBarcode').value
    let user = document.getElementById('user').value

    const item = {
        date:date,
        product:product,
        supplier:supplier,
        weight:weight,
        numBarcode:numBarcode,
        user:user
        
    }

    fetch('app/rawmaterials/generatebarcode',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(item)
    })
    .then(response=>response.json())
    .then(res=>{
        console.log("result",res)

        if(res.status){
             document.getElementById('products').value =""
            document.getElementById('supplier').value = ""
            document.getElementById('weight').value = ""
            document.getElementById('numBarcode').value = ""
            
            
            window.open('app/rawmaterials/printout', '_blank')
            
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

}