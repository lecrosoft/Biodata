function loadReport(){
    var content = $(`

    <section class="d-flex justify-content-between p-2">

        <div class="logo">
            <img src="/bil/images/belpapyrus_companies logo.png" alt="Belpapyrus Logo">
        </div>

         

    </section>
    <hr>

    <div class="d-flex gap-2 p-2">
        <div class="d-flex filter">
           
            <div>
                <input type="" id="min" name="min" class="form-control" autocomplete=off placeholder="Filter Start Date" style="font-size:12px" >
                <small id="emailHelp" class="form-text text-muted">Start Date</small>
            </div>
            <div>
               
                <input type="text" id="max" name="max" class="form-control ml-2" autocomplete=off placeholder="Filter End Date" style="font-size:12px" >
                <small id="emailHelp" class="form-text text-muted pl-2">End Date</small>
            </div>
            <div> 
                <button class="btn btn-sm btn-secondary ml-4 search" >Search</button>
            </div>
        </div>
        
        
    </div>
    
    <div class="mt-4 p-2">
       
        <table class="table table-hover" id="deleteTable">
            <thead class="bel-thead">
                    <tr>
                        <th scope="col">S/N</th>
                        <th scope="col">Deletion Code</th>
                        <th scope="col">User</th>
                        <th scope="col">Date Of Deletion</th>
                        <th scope="col">Action</th>
                        
                    </tr>
            </thead>
            
        </table>
    </div>
    `)
    
    content.find('#min').datepicker({ format: 'yy-mm-dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker('setDate');
    content.find('#max').datepicker({ format: 'yy-mm-dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker('setDate');
    $('#wrapper').html(content);
    var url = "app/get_deleted_storeentrance"
    
    fetch('app/get_deleted_storeentrance')
    .then(response=>response.json())
    .then(res=>console.log(res));

    getTable(url)
    
    document.querySelector('.search').addEventListener('click',function(){
        var min = document.getElementById('min').value
        var max = document.getElementById('max').value
    
        if(min && max){
            var delete_url = 'app/filter_deleted_storeentrance/'+ min + '/'+ max;
            getTable(delete_url);
        }
    })

   
}

