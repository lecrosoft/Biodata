function details(){
    var hash = location.hash.replace('#','');
    var content = $(`

    <section class="d-flex justify-content-between p-2">

        <div class="logo">
            <img src="/bil/images/belpapyrus_companies logo.png" alt="Belpapyrus Logo">
        </div>

         

    </section>
    <hr>

    <div class="d-flex gap-2 p-2 justify-content-center h2">
        ${hash}    
    </div>
    
    <div class="mt-4 p-2">
       
        <table class="table table-hover" id="detailsTable">
            <thead>
                    <tr>
                        
                        <th scope="col">Date of StoreEntrance</th>
                        <th scope="col">Barcode</th>
                        <th scope="col">User</th>
                        <th scope="col">Productname</th>
                        <th scope="col">GradeType</th>
                        <th scope="col">Location</th>
                        <th scope="col">Weight</th>
                        <th scope="col">Deleted ON</th>
                        
                    </tr>
            </thead>
            <tbody>


            </tbody>
            
        </table>
    </div>
    `)
    
    //content.find('#min').datepicker({ format: 'yy-mm-dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker('setDate');
    //content.find('#max').datepicker({ format: 'yy-mm-dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker('setDate');
    var url = 'app/fetchdetails/'+ hash
    

    // fetch('app/fetchdetails/'+ hash)
    // .then(response=>response.json())
    // .then(res=>{
    //     console.log(res)

        
    //     var dataset = "";

    //     res.forEach((d)=>{
    //         dataset += `
    //                         <tr>
    //                             <td>#</td>
    //                             <td>${d.date_of_entrance}</td>
    //                             <td>${d.barcode}</td>
    //                             <td>${d.user}</td>
    //                             <td>${d.productname}</td>
    //                             <td>${d.gradetype}</td>
    //                             <td>${d.location}</td>
    //                             <td>${d.weight}</td>
    //                             <td>${d.created_at}</td>

    //                         </tr>
    //                     `
    //     })
    //     content.find('tbody').html(dataset)
    // })
    $('#wrapper').html(content);
    details_table(url);
    
}