"use strict"

//var loader = $('.loaderdiv');
$( ".print" ).click(function() {
  	$('.title,.title2,.responsive-table-single').printThis({
		importStyle: true,
	});
});

$(document).ready(function() {
    let modal = $('.w3-modal-content')
    let modalBody = $('.modal-body')
    let modalTitle = $('.modal-title')

    $(document).on('click', 'table tbody tr td a.popup', function() {
        let req_data = {invoiceid: $(this).attr('data-inv'), productcode: $(this).attr('data-code'), productname: $(this).attr('data-name'), foc: $(this).attr('data-foc'), sod: $(this).attr('data-sod')}

        $.get( 'connections/delivery_records.php', { req_data: JSON.stringify(req_data) }, function(data) {
            if (data) {
                try {
                    var ret_data = JSON.parse(data)
                    
                    if (ret_data.status) {
                        if ( 'empty' in ret_data.data ) {
                            modalBody.html("<p class='w3-margin'>"+ret_data.data.empty+"</p>")                            
                        } else {
                            modalBody.html("<div class='w3-responsive'><table class='w3-table'><thead><tr class='w3-blue-gray'><th>Date</th> <th>Delivered</th> <th>Balance</th></tr></thead> <tbody></tbody> <tfoot></tfoot></table></div>")
                            
                            let tbody = $('#myModal .modal-body table tbody')
                            let tfoot = $('#myModal .modal-body table tfoot')
                            let rows

                            ret_data.data.forEach( function(records) {
                                rows += "<tr><td>"+records.date+"</td> <td>"+accounting.formatNumber(records.delivered)+"</td> <td>"+accounting.formatNumber(records.balance)+"</td></tr>"
                            } )

                            tbody.html(rows)

                            let deliveredArray = []

                            for (let i = 0; i < ret_data.data.length; i++) {
                                deliveredArray.push(ret_data.data[i].delivered)
                            }

                            tfoot.html("<th>TOTAL</th><th>"+sum(deliveredArray)+"</th> <th>-</th>")
                        }

                        modalTitle.html("Delivery Record(s) for <span style='font-weight: 600'>"+req_data.productname+"</span> on <span style='font-weight: 600'>"+req_data.invoiceid+"</span> ")
                            document.getElementById('myModal').style.display = 'block'
                                $(document).scrollTop(0)

                    } else
                        console.log(ret_data.message)

                } catch(err) {
                    console.log('Error message: ', err)
                }            
            } else
                console.log('... Server request failed')
        } )
    })

    $(document).on('mouseup', function(e){
        if( ! modal.is(e.target) && modal.has(e.target).length === 0) {
            document.getElementById('myModal').style.display = 'none'
        }
    })                        
})