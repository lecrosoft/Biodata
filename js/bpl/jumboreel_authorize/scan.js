
    function fetchAwaiting(user){

        fetch('app/jumboreel_return/awaiting_approval',{
            method:'GET',
            headers:{
                'Content-type':'application/json'
            },
            
        })
        .then((response)=>response.json())
        .then(res=>{
            console.log(res);
            let dataset ='';

                if(res.status){
                    res.data.forEach((d,index)=>{

                        dataset += `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${d.barcode}</td>
                                        <td>${d.product}</td>
                                        <td>${d.company_name}</td>
                                        <td>${d.type} </td>
                                        <td>${d.weight}</td>
                                        <td>${d.user}</td>
                                        <td><span class="badge bg-warning">${d.status}</span> </td>
                                        
                                        <td><button class="btn-primary mr-4" >Approve</button><button class="btn-danger">Reject</button></td>
                                    </tr>
                                    `
                    
                    })
        
                    content.find('#my-tbody').append(dataset);
                }
                else{
                    // <div style="width:100%;text-align:center">{res.data}</div>
                    content.find('#my-tbody').append(res.data);
                }
            
            action(user);
            
        })
        .catch(err=>{
            console.log(err);
        })
            
            
         
        
    }  

    function action (){
        document.getElementById('my-tbody').addEventListener('click',function(e){
           
            if(e.target.textContent == "Approve"){
                
                let x = e.target.parentElement;
                let y = x.parentElement

                let barcode = y.children[1].textContent;
                let company_name = y.children[3].textContent;
                let return_type = y.children[4].textContent;
                let weight=y.children[5].textContent;
                
                
                e.target.textContent = "Please Wait"
                e.target.disabled = true

                fetch('app/jumboreel_return/approved',{
                    method:'POST',
                    headers:{
                        'Content-type':'application/json'
                    },
                    body:JSON.stringify({
                        barcode:barcode,
                        return_type:return_type,
                        weight:weight,
                        user:user,
                        company_name
                    })
                    
                })
                .then((response)=>response.json())
                .then(res=>{
                    console.log(res);
                    
                e.target.disabled = false
                    if(res.status){
                         if(return_type === "Partially Consumed "){
                            //window.open('app/jumboreel/newbarcode/'+barcode, '_blank')
                            window.open('app/bpl_production_print/'+res.newbarcode, '_blank')
                        }
                        Swal.fire(
                            'Success!',
                            res.message,
                            'success'
                        )
                        document.getElementById('my-tbody').innerHTML=""
                        fetchAwaiting();
                    }
        
                    // content.find('#my-tbody').append(dataset);
                    // action();
                    
                })
                .catch(err=>{
                    console.log(err);
                })



                
                
            }
            else if(e.target.textContent == "Reject"){
                let x = e.target.parentElement;
                let y = x.parentElement

                let barcode = y.children[1].textContent;
                let return_type = y.children[3].textContent;
                let company_name = y.children[3].textContent;

                e.target.textContent = "Please Wait"
                e.target.disabled = true

                fetch('app/jumboreel_return/rejected',{
                    method:'POST',
                    headers:{
                        'Content-type':'application/json'
                    },
                    body:JSON.stringify({
                        barcode:barcode,
                        return_type:return_type,
                        company_name
                    })
                    
                })
                .then((response)=>response.json())
                .then(res=>{
                    console.log(res);
                    
                e.target.disabled = false
                    if(res.status){
                        Swal.fire(
                            'Success!',
                            "Item Successfully Rejected",
                            'success'
                        )
                        document.getElementById('my-tbody').innerHTML=""
                        fetchAwaiting();
                    }
                    else{
                        Swal.fire(
                            'Error!',
                            "Internal Server Error",
                            'Error'
                        )
                    }
        
                    // content.find('#my-tbody').append(dataset);
                    // action();
                    
                })
                .catch(err=>{
                    console.log(err);
                })

            }
        })
    }