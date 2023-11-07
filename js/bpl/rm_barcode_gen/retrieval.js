async function getSuppliers(){

     fetch('app/rawmaterials/getsuppliers',{
        method:'GET', 
        headers: {
            'Content-Type': 'application/json',
          }

    })
    .then(response=>response.json())
    .then(res=>{
        let dataset = ''
            res.forEach(d => {
                dataset+=`<option value=${d.supplierid}>${d.suppliername}</option>`
            });
            return dataset;
            
    })
    .catch(err=>{
        return err;
    })

    
}

async function getProducts(){
    fetch('app/rawmaterials/getproducts',{
        method:'GET', 
        headers: {
            'Content-Type': 'application/json',
          }

    })
    .then(response=>response.json())
    .then(res=>{
        let dataset = ''
            res.forEach(d => {
                dataset+=`<option value=${d.storecode}>${d.productname}</option>`
            });
            return dataset;
            
    })
    .catch(err=>{return err})

    

}





