function details_table(url){
    console.log('I am HERE');
    var count = 0;
    $('#detailsTable').DataTable( {
        ajax: {
            url: url,
            dataSrc:'',
           
        },
        dom: 'Bfrtip',
        buttons: [
             'excelHtml5'
        ],
        
        // buttons: [

            
        
        //     // { extend: 'excel',text: '<i class="fa fa-file-excel-o" aria-hidden="true">Excel</i>',className: 'bgColor',exportOptions: {
        //     //     columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
        //     //    }
        //     // },
        //     //  { extend: 'print',text: '<i class="fa fa-print" aria-hidden="true">Print</i>',className: 'bgColor'}
        // ],
        
        destroy: true, 
        "bProcessing": true,
        'searching': true,
        "aoColumns": [
            
           
                  
            {data:'deletion_id',"sTitle": "Date of StoreEntrance"},
            {data:'barcode',"sTitle": "Barcode"},
            {data:'user',"sTitle": "User"},
            {data:'productname',"sTitle": "Productname"},
            {data:'gradetype',"sTitle": "GradeType"},
            {data:'location',"sTitle": "Location"},
            {data:'weight',"sTitle": "Weight"},
            {data:'created_at',"sTitle": "Deleted ON"},
           
         ],
         
        } );
}