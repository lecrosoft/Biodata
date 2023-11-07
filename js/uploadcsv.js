document.querySelector('.upload').addEventListener('click',function(e){
    e.preventDefault()
    let user = document.getElementById('username').value
    const filex = document.querySelector('[type=file]').files;
     console.log(filex)
    if(filex.length > 0){
        const formData = new FormData();
        for (let i = 0; i < filex.length; i++) {
            let file = filex[i]
            formData.append('files', file)
            formData.append('user',user)
            
          }

          const url ='app/factory_reel/load_jumboreels'
          fetch('app/factory_reel/load_jumboreels', {
            method: 'POST',
            body: formData,
          })
          .then(result=>result.json())
          .then((response) => {
            console.log(response.data)
            if(response.status){
                Swal.fire(
                    'Success!',
                    response.data,
                    'success'
                )
                document.querySelector('[type=file]').value="";
            }
            else if(!response.status){
                Swal.fire(
                    'Oops!',
                    response.data,
                    'error'
                )
            }
          })
          .catch(err=>console.log(err))
    }
    else{
        document.querySelector('.result').innerHTML='<div style="font-size:18px;margin-top:20px;color:#ff0000">Select a File</div>'
    }
    
    

})


