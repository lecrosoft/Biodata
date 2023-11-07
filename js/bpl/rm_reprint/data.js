const tbody = document.getElementById('my-tbody');

function getapproved(){
    fetch('app/rawmaterials_return/getapproved',{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response=>response.json())
    .then(res=>{
        console.log(res)
        let dataset = ""
        res.forEach((d,index) => {
            dataset += `
                            <tr>
                            <td>${index + 1}</td>
                            <td>${d.barcode}</td>
                            <td>${d.product}</td>
                            <td>${d.type}</td>
                            <td>${d.weight}</td>
                            <td>${d.user}</td>
                            <td>${d.status}</td>
                            <td><button class="btn btn-primary reprint">Reprint</button></td>
                            </tr>
                        `
        });
        document.getElementById('my-tbody').innerHTML = dataset
        


    })
    .catch((err)=>{
        console.log(err)
    })
}



// function setdata(code){
//     console.log('code',code)
//     fetch('app/rawmaterials_return/setprintOut',{
//         method:'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body:JSON.stringify({code})
//     })
//     .then(response=>response.json())
//     .then(rex=>{
//         console.log(rex)
//     })
//     .catch((err)=>{
//         console.log(err)
//     })
// }