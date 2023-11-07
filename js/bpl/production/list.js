"use strict"

$(document).on('keyup', '.table-search', function() {
    table.search( this.value ).draw()
}) 

function index() {
    const retrieval = date => {
        let query = "WHERE `prod`.`dateofmanufacture` = '"+date+"' AND `prod`.`deleted_at` IS NULL",
            tbl = $(`
                <table class="table table-md vertical-top edge-pad">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Hardroll Number</th>
                            <th>Barcode</th>
                            <th>Core Diameter</th>
                            <th>Joints</th>
                            <th>Weight</th>
                        </tr>
                    </thead>

                    <tbody />                      
                </table>
            `)

        _fetch(`app/bpl_production?query=${query}`)
        .then( data => {
            const rows = JSON.parse(data).map( ({ id, customername, productname, hardrollnumber, barcode, corediameter, joints, weight }) => `
                <tr class="pointer bg-hover" onClick="openEntry(${id})">
                    <td>${customername}</td>
                    <td>${productname}</td>
                    <td>${hardrollnumber}</td>
                    <td>${barcode}</td>
                    <td>${formVal(corediameter)}</td>
                    <td>${joints}</td>
                    <td>${weight}</td>
                </tr>
            ` )    

            tbl.find('tbody').html(rows)
            content.find('.content-body').html(tbl)
            table = tbl.DataTable({ lengthChange: false, info: false, pageLength:  10, ordering: false })
        } )
        .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )        
    }

    let content = $(`
            <div class="content">
                <div class="content-head d-flex justify-content-between p-3 position-relative border-bottom mb-4">
                    <div class="d-flex">
                        <input type="search" class="form-control form-control-sm mr-5 table-search" placeholder="Search" />
                        <input type="text" class="form-control form-control-sm" id="_dateSearch" autocomplete="off" />
                    </div>

                    <div class="_action">
                        <a href="bpl_production#new" class="btn btn-sm anchor"><i class="fa fa-plus" /> New</a>
                    </div>
                </div>

                <div class="content-body" />            
            </div>
        `)

        content.find('#_dateSearch')
            .datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true })
            .datepicker( 'setDate', 'now')
            .on('changeDate', () => retrieval($('#_dateSearch').val()) )

        retrieval(content.find('#_dateSearch').val())

        return content
}
