let allbarcodes = [];

function scanbarcode(element){
    
    
    var x = document.getElementById('scanInput');
    var tbody = document.getElementById('barcode_tbody');
    x.addEventListener('change',function(e){
        
        if(e.target.value !=""){
            $check = allbarcodes.includes(e.target.value);
            if($check){
               
                Swal.fire(
                    'Scan Error!',
                    'Barcode Has Already Scanned!',
                    'error'
                  )
                return false;
            }
            document.getElementById('loader').classList.add('spinner-border')
           var barcode = e.target.value
           var location = document.getElementById('location').value;
                fetch('app/getbarcodedetails',{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({barcode:barcode,location:location})
                })
                .then(response=>response.json())
                .then(data=>{
                    console.log(data);
                    var dataset ="";
                    
                    if(data['status']){
                        document.getElementById('location').setAttribute('disabled','disabled');
                        document.getElementById('loader').classList.remove('spinner-border')
                        document.getElementById('scanInput').value=""
                        data['data'].forEach((d)=>{
                           allbarcodes.push(d['barcode']);
                            dataset += `
                                        <tr style="font-size:13px">
                                            <td>${d['created_at']}</td>
                                            <td>${d['barcode']}</td>
                                            <td>${d['productname']}</td>
                                            <td>${d['gradetype']}</td>
                                            <td>${d['location']}</td>
                                            <td>${d['weight']}</td>
                                            <td style="text-align:center;cursor:pointer"><img src="/bil/images/close.png" class="remove_barcode" /></td>
                                         </tr>
                                        `
                        })
                        $(tbody).append(dataset);
                    }
                    else{
                        document.getElementById('loader').classList.remove('spinner-border')
                        Swal.fire(
                            'Scan Error!',
                             data['data'],
                            'error'
                          )
                        //console.log(data)
                        
                    }
                    
                })
        }
        removeItem();
        //save(element);
    })
}

function removeItem(){
    document.getElementById('barcode_tbody').addEventListener('click',function(e){
      

        if(e.target.classList.contains('remove_barcode')){
            var child = e.target.parentNode 
            var parent = child.parentNode;
            
            
            for( var i = 0; i < allbarcodes.length; i++){ 
                
                if ( allbarcodes[i] === parent.children[1].textContent) { 
            
                    allbarcodes.splice(i, 1); 
                }
            
            }

            parent.remove(child);
            if(allbarcodes.length === 0){
                document.getElementById('location').removeAttribute('disabled');
            }
        }
        
        
        
    })
}


// function save(element){
//    element.addEventListener('click',function(){
    
//        element.setAttribute('disabled','disabled');
//        if(allbarcodes.length > 0){
       
//         console.log('I am here');
//         return false;
//            fetch('app/removeStoreItems',{
//                method:'POST',
//                headers:{
//                    'Content-Type':'application/json'
//                },
//                body:JSON.stringify({barcodes:allbarcodes})
//            })
//            .then(response=>response.json())
//            .then(res=>{
            
//                if(res['status']){
//                     Swal.fire(
//                         'Submitted!',
//                         res['data'],
//                         'success'
//                     )

//                     document.querySelector('tbody').innerHTML=""
//                     document.getElementById('scanInput').value=""
//                     allbarcodes=[];
//                     document.getElementById('location').removeAttribute('disabled');
                    
//                }
//                else{
//                 Swal.fire(
//                     'Oops!',
//                     res['data'],
//                     'error'
//                 )
//                }
//            })
//        }
//    })
// }


