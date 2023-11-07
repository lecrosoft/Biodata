function getTable(url){
    
    var count = 0;
    $('#deleteTable').DataTable( {
        ajax: {
            url: url,
            dataSrc:'',
            
        },

        
        destroy: true, 
        "bProcessing": true,
        'searching': true,
        "aoColumns": [
            
            {
                    "mData": null,
                    "sTitle": "SN",
                   "mRender": function (o) { 
                       return count = count + 1;
                    }
            },
            
            {data:'deletion_id',"sTitle": "Deletion Code"},
            {data:'user',"sTitle": "User"},
            
            {data:'created_at',"sTitle": "Date Of Deletion"},
            
            {
                    "mData": null,
                    "sTitle": "Action",
                   "mRender": function (o) { 
                    
                    return '<a href="#'+ o.deletion_id+'"><button class="btn btn-info btn-sm">View More</button></a>';
                    }
            },
           
         ],
         
        } );
}