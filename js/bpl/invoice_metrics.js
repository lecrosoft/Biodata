"use strict"

$('body').prepend(modal({ footer: false, size: 'modal-lg' }))

const wrapper = 'div#wrapper', modalPop = $('#bsModal')

const metrics = () => {
    let content = $(`
        <div class="container-fluid packing-list mt-3">
            <table class="table table-md table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>Invoice Number</th>
                        <th>Proforma<br />Invoice Date</th>
                        <th>Customer<br />Approval Date</th>
                        <th>Production<br />Date</th>
                        <th>Invoice Date</th>
                        <th>Shipped on<br />Board Date</th>
                        <th>Arrival at<br />Destination Date</th>
                        <th>Duration</th>
                    </tr>
                </thead>                
            </table>
        </div>
    `)

    content.find('table').DataTable({
        pageLength:  10,
        ordering: false,
        processing: true,
        serverSide: true,
        ajax: 'app/bpl_invoice_metrics'
    })

    content.find('.dataTables_filter').prepend("<span style='font-size: 10px; display: block; font-weight: 700'>Search for Invoice Number only &nbsp;</span>")

    return content
}

const chart = () => {
    let content = $(`
        <div class="container-fluid p-3 border-bottom">
            <div class="row">
                <div class="col-md-6">
                    <div class="d-inline-block mr-4" style="min-width: 250px">
                        <select class="form-control proforma" onchange="openProforma(this)">
                            <option value="">Select proforma invoice</option>
                        </select>
                    </div>
                </div>

                <div class="col-md-6 text-md-right mt-3 mt-md-0">
                    <a href="javascript:_push('bpl_packing_list')" class="btn btn-sm btn-secondary">View packing entries</a>
                </div>
            </div>
        </div>

        <div class="container-fluid py-3">
            <div class="row">
                <div class="col-md-6 info">
                    <p class="text-info">Choose invoice to display items here</p>
                </div>

                <div class="col-md-5 offset-md-1 mt-2 mt-md-0" style="max-width: 400px">
                    <h4 class="mb-3">Container Inputs</h4>
                    <div class="container-list"></div>
                </div>                       
            </div>

            <div class="row border-top">
                <div class="col-sm-12 entries"></div>                 
            </div>
        </div>
    `)

    if ( location.hash && location.hash === '#new' ) {
        _fetch('app/bpl_packing_proforma')
        .then( data => {
            for (let res of JSON.parse(data)) {
                content.find('.proforma').append(`<option value="${res.id}" data-number="${res.number}" data-container="${res.container}">${res.proforma}</option>`)
                selecter(content.find('.proforma'))
            }
        } )
        .catch( error => feedback({ message: error, alert: 'danger' }) )
        
        return content
    }

    _fetch( 'app/bpl_packing_list' + location.hash.replace('#', '/') )
    .then( data => loadProforma(JSON.parse(data)) )
    .catch( error => {
        feedback({ message: error, alert: 'danger', timeout: 3500 })
        $($('.col-md-6')[0]).html(createBtn('bpl_packing_list#new'))
        $('.container-fluid')[1].remove()
    } )
    
    return content
}

const _push = url => {
    history.pushState(null, null, url)
    loadUrl(document.location.href)
}

const loadUrl = url => $(wrapper).html( ( url === location.origin + location.pathname ) ? metrics : chart )

window.onpopstate = e => loadUrl(document.location.href)

loadUrl(document.location.href) // Load content