"use strict"

function show() {
    let content = $(`
        <div class="content">
            <table class="table table-md vertical-top edge-pad">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Number</th>
                        <th>Customer</th>
                        <th>Shipment</th>
                        <th>Payment</th>
                        <th>NXP Number</th>
                        <th class="text-right">Currency</th>
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
        ajax: 'app/bpl_proforma_server_processing'
    })

    content.find('.toolbar').html([1, 2, 73].includes(level) ? `<a href="bpl_proforma#new" class="btn btn-sm anchor"><i class="fa fa-plus" /> New</a>` : '')

    return content
}
