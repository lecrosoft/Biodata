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
            <div class="form-check form-check-inline">
                <input class="form-check-input all" type="radio" name="flexRadioDefault" id="all" value="All">
                <label class="form-check-label" for="flexRadioDefault2">
                    All
                </label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input pending" type="radio" name="flexRadioDefault" id="pending" value="Pending" >
                <label class="form-check-label" for="flexRadioDefault2">
                    Pending
                </label>
            </div>
            <div class="form-check form-check-inline ml-auto">
                <input class="form-check-input completed" type="radio" name="flexRadioDefault"  value="completed" id="completed" >
                <label class="form-check-label" for="flexRadioDefault2">
                    Completed
                </label>
            </div>
            <div>
                <input type="text" id="min" name="min" class="form-control" autocomplete=off placeholder="Filter Start Date" style="font-size:12px" >
            </div>
            <div>
               
                <input type="text" id="max" name="max" class="form-control ml-2" autocomplete=off placeholder="Filter End Date" style="font-size:12px" >
            </div>
        </div>
        
        <div class="d-none ml-auto restriction">
            <div>
                <button class="btn my_btn btn_edit">Edit</button>
            </div>
            <div>
                <button class="btn my_btn btn_delete">Delete</button>
            </div>
        </div>
        
    </div>
    
    <div class="mt-4 p-2">
       
        <table class="table table-hover" id="reportTable">
            <thead class="bel-thead">
                    <tr>
                        <th scope="col">S/N</th>
                        <th scope="col">Delivery Barcode</th>
                        <th scope="col">Date</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Status</th>
                        <th scope="col">Truck Number</th>
                        <th scope="col">Ordered</th>
                        <th scope="col">Truck Weight</th>
                        <th scope="col">Weight</th>
                        <th scope="col">Action</th>
                    </tr>
            </thead>
            <tfoot class="text-bold">
                <tr>
                    <td class="font-weight-bold">Total</td>
                    <td colspan="4"></td>
                    <td ></td>
                    <td class="font-weight-bold"></td>
                </tr>
            </tfoot>
        </table>
    </div>
    `)
    
    $('#wrapper').html(content);
    var url = "app/getDeliveryReport"
    //Display DataTable
    restriction();
    getTable(url)
   
    filterFunction();
}

function filterFunction(){
    
    document.querySelector('.filter').addEventListener('click',function(e){
        console.log(e.target.classList)
        if(e.target.classList.contains('all')){
            var filter = "all";
            var url = "app/getFilterReport/"+filter;
            getTable(url)
        }
        if(e.target.classList.contains('pending')){
            var filter = "pending"
            var url = "app/getFilterReport/"+filter;
            getTable(url)
        }
        if(e.target.classList.contains('completed')){
            var filter = "completed";
            var url = "app/getFilterReport/"+filter;
            getTable(url)
        }
        
    })
}
function restriction(){
    var authorizedAccessLevel = ["1"];
    var getUseraccess = document.querySelector('#access').value
   
    var check = authorizedAccessLevel.includes(getUseraccess)
    if(check){
        document.querySelector('.restriction').classList.remove('d-none');
        document.querySelector('.restriction').classList.add('d-flex');
    }
    
}
