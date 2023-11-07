"use strict"

function show() {
    let content = $(`
        <div class="content">
            <table class="table table-md vertical-top edge-pad">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Order ID</th>
                        <th>Order Ref</th>
                        <th>Customer</th>
                        <th class="text-right">No. Items</th>
                    </tr>
                </thead>

                <tbody />                      
            </table>          
        </div>
    `)

    content.find('table').DataTable({
        dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4 my-3 my-md-0'f><'col-sm-12 col-md-4 toolbar text-center text-md-right'>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        pageLength: 10,
        ordering: false,
        processing: true,
        serverSide: true,
        ajax: 'app/bpl_sales_server_processing'
    })

    content.find('.toolbar').html(`<a href="bpl_sales#new" class="btn btn-sm anchor"><i class="fa fa-plus" /> New order</a>`)

    return content
}
