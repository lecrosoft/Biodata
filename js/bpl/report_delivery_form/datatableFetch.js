function getTable(url){
    var count = 0;
   
    $('#reportTable').DataTable( {
    ajax: {
        url: url,
        dataSrc:''
    },
    dom: '<"top"<"left-col"B><"center-col"l><"right-col"f>>rtip',
    // dom: 'Blfrtip',
     buttons: [
        
        { extend: 'excel',text: '<i class="fa fa-file-excel-o" aria-hidden="true">Excel</i>',className: 'bgColor',exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
           }},
         { extend: 'print',text: '<i class="fa fa-print" aria-hidden="true">Print</i>',className: 'bgColor',exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
           }}
    ],
    
    destroy: true, 
    "bProcessing": true,
    'searching': true,
    "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
            
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            
            
            //Quantity

            // var quantityTotal = api
            //     .column( 4 )
            //     .data()
            //     .reduce( function (a, b) {
            //         return intVal(a) + intVal(b);
            //     }, 0 );
               
            // // Total over all pages
            // var total = api
            //     .column( 6 )
            //     .data()
            //     .reduce( function (a, b) {
            //         var x = intVal(a) + intVal(b);
                    
            //         return intVal(a) + intVal(b);
                    
            //     }, 0 );
                
            // Total over this page
            var pageTotal = api
                .column( 6, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            
                var pageTotalQuantity = api
                .column( 5, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
 
            // Update footer
            $( api.column( 6 ).footer() ).html(
                //pageTotal +' ( '+ total +' total)'
                pageTotal
            );
            $( api.column( 5 ).footer() ).html(
                pageTotalQuantity
            );
        },
     
    "aoColumns": [
        
        //{data:'id',"sTitle": "SN"},
        {
                "mData": null,
                "sTitle": "SN",
               "mRender": function (o) { 
                   return count = count+ 1;
                }
        },
        {data:'created_at',"sTitle": "Date"},
        {data:'delivery_barcode',"sTitle": "Delivery Barcode"},
        // {
        //     "mData": null,
        //     "sTitle": "Delivery Barcode",
        //    "mRender": function (o) { 
               
        //         return `<a href='#edit_${o.id}'>${o.delivery_barcode}</a>`
              
        //     }
        // },
        {data:'customer_name',"sTitle": "Customer Name"},
        
        {
                "mData": null,
                "sTitle": "Status",
               "mRender": function (o) { 
                   if(o.status == "pending"){
                    return '<span class="badge bg-danger" style="color:#fff">'+o.status+'</span>'; 
                   }
                   else{
                    return '<span class="badge bg-success" style="color:#fff">'+o.status+'</span>'; 
                   }
                }
        },
        {data:'vechile_number',"sTitle": "Truck Number"},
        {data:'Ordered',"sTitle": "Ordered"},
        
        {
                "mData":"full_weight" ,
                "sTitle": "Full Weight", 
                
                // "mRender":function(o){
                //     if(o.full_weight == null || o.full_weight == ""){
                //         return '<span class="badge bg-danger" style="color:#fff">Incomplete</span>'; 
                //     }
                //     else{
                //         return '<span class="badge bg-dark" style="color:#fff">'+o.full_weight+'</span>'; 
                //     }
                // }    
        },
        {data:'truck_weight',"sTitle": "Truck Weight"},
        {
            "mData":null,
            "sTitle":"Action",
            "mRender":function(o){
                if(o.status == "pending"){
                    return (
                        `<a  onclick="function hi(){
                            var authorizedAccessLevel = ['1','30'];
                            var getUseraccess = document.querySelector('#access').value
                            var check = authorizedAccessLevel.includes(getUseraccess)
                            
                                if(check){
                                    location='#updateweight_${o.id}';
                                    loadUrl(document.location.href);
                                }
                            };hi()"
                            class="d_add_weight">
                            <img src="/bil/images/1x/add.png" alt="addWeight" />
                        </a>`);
                   }
                   else{
                    return (`<div class="dropdown">
                                
                                <img src="/bil/images/1x/print.png" alt="addWeight" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" >
                                    <li><a class="dropdown-item" href="/bil/app/print_out/${o.delivery_barcode}" style="font-size:10px">Customer PrintSlip</a></li>
                                    <li><a class="dropdown-item" href="/bil/app/print_out_proccessor/${o.delivery_barcode}" style="font-size:10px">Processor PrintSlip </a></li>
                                    
                                </ul>
                            </div>
                    `);
                   }
            }
        }

     ],
     
    } );
    
 
    // Refilter the table
    

    clickableTable();
   filterTable();
}

function clickableTable(){
    

$('#reportTable tbody').on('click', 'tr', function (e) {
    var table = $('#reportTable').DataTable();
    var x = document.querySelectorAll('.selected')
   
   if(x.length > 0){
       
        for(let i=0;i<x.length;i++){
            x[i].parentNode.classList.remove('selected');
            console.log(x[i].classList.remove('selected'))
        }
       e.target.parentNode.classList.add('selected')
   }
   else{
    e.target.parentNode.classList.add('selected')
   }
    var data = table.row( this ).data();
  
    
   if(data["id"] != ""){
      
       document.querySelector('.btn_delete').addEventListener('click',function(e){
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1f7872',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                if (result.isConfirmed) {
                    var id = data["id"];
                    var status = data["status"];
                    console.log("data",status)
                    fetch('app/report/',{
                        method:'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify({id:id,status:status})
                    })
                    .then(response=>response.json())
                    .then(data=>{
                    
                        if(data["message"] == "Deleted"){
                            var url = "app/getDeliveryReport"
                            getTable(url);
                        }
                    })
                }
            })

        })
        
   }
   if(data['id']!="" && data['status'] === "pending"){
        document.querySelector('.btn_edit').addEventListener('click',function(e){
        location=`#edit_${data['id']}`
        loadUrl(document.location.href);
        
    })
   }
   else {
    
        
        
        // document.querySelector('.btn_edit').addEventListener('click',function(e){
        //      if(data['status'] === "completed"){
        //         toastr.error('Editting not allowed as the selected process is already completed', data['status']);
        // }
        
        // })

    
   }
   
    
} );
}

//$('#startdate').keyup( function() { table.draw();console.log('startdate') } );
//$('#enddate').keyup( function() { table.draw();console.log('enddate') } );
function filterTable(){
    

    var minDate, maxDate;
    
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            // console.log('Checks',minDate.val())
            var min = minDate.val() === "" ? null : new Date(minDate.val());
            var max = maxDate.val() === "" ? null : new Date(maxDate.val());
            
            var date = new Date( data[1] );
            
         
            if (
                ( min === null && max === null ) ||
                ( min === null && date <= max ) ||
                ( min <= date   && max === null ) ||
                ( min <= date   && date <= max )
            ) {
                console.log('HERE')
            return true;
            }
            console.log('THERE')
            return false;
        }
    );

    minDate = $('#min').datepicker({
        dateFormat: 'yyyy/mm/dd'
    });
    maxDate = $('#max').datepicker({
        dateFormat: 'yyyy/mm/dd'
  });
    
    var table = $('#reportTable').DataTable();
    $('#min, #max').on('change', function () {
        console.log(minDate.val())
        console.log(maxDate.val())
        table.draw();
        
    });

    

}