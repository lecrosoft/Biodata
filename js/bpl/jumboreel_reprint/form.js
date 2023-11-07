const wrapper = document.getElementById('wrapper');

let content = $(
    `
        <div class="container">
        <div class="reprintapproval">
            Reprint Approved Return 
        </div>
            <div class="selectTool">
                <table class="table table-striped" id="tableScan">

                    <thead>
                        <tr>
                            <th scope="col">SN</th>
                            <th scope="col">Barcode</th>
                            <th scope="col">Product</th>
                            
                            <th scope="col">Return Type</th>
                            <th scope="col">Current Weight</th>
                            <th scope="col">User</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody class="my-tbody" id="my-tbody">

                    <tbody>
                </table>
               
            </div>
           

        </div>
    `
)

content.find('#date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker( 'setDate');

$(wrapper).html(content)

getapproved();
$('#tableScan').DataTable();

    document.querySelector('#my-tbody').addEventListener('click',function(e){
        
        if(e.target.classList.contains('reprint')){
            let parent_td = e.target.parentElement;
            let parent_tr = parent_td.parentElement;
            let barcode = parent_tr.children[1].textContent

            //setdata(barcode);
           
        window.open('app/bpl_production_reprint/'+barcode, '_blank')

        }
    })

function setdata(code){
    console.log('code',code)
    fetch('app/jumboreel_return/setprintOut',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({code})
    })
    .then(response=>response.json())
    .then(rex=>{
        console.log(rex.status)
        if(rex.status){
            window.open('app/rawmaterials/newbarcode/'+rex.barcode, '_blank')
        }
    })
    .catch((err)=>{
        console.log(err)
    })
}

