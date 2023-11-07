"use strict"

const showEntries = () => {
    let content = $(`
        <div class="container-fluid packing-list mt-3">
            <table class="table table-md vertical-top">
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Customer</th>
                        <th>Container</th>
                        <th>No of Rolls</th>
                        <th>Net Weight</th>
                        <th>Gross Weight</th>
                        <th class="bg-light"><i class='fa fa-tasks'></i> <span>Tasks</span></th>
                    </tr>
                </thead>

                <tbody />                      
            </table>
        </div>
    `)

    content.find('table').DataTable({
        dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4 my-3 my-md-0'f><'col-sm-12 col-md-4 toolbar text-center text-md-right'>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        pageLength:  10,
        ordering: false,
        processing: true,
        serverSide: true,
        ajax: 'app/bpl_packing_list_server_processing',
        initComplete: () => $('.tool-tip').tooltip()
    })

    content.find('.toolbar').html(createBtn('bpl_packing_list#new'))
    content.find('.dataTables_filter').prepend("<span style='font-size: 10px; display: block; font-weight: 700'>Valid for Number, Customer and Container</span>")

    return content
}

const openInvoice = id => window.open('app/bpl_final_invoice/'+id, '_blank')

const openPacking = id => window.open('app/bpl_packing_printout/'+id, '_blank')

const deletePacking = id => {
    bbConfirm( 'Irrevocable action, do you want to continue?', data => {
        if (data) {
            _fetch( `app/bpl_packing_list/${id}`, {method: 'DELETE'} )
            .then( () => $('.packing-list table').DataTable().draw(false) )
            .catch( error => feedback({ message: error, alert: 'danger' }) )
        }
    } )    
}  

const addPayment = (e, target) => {
    let body = JSON.stringify({
        packing_id: target['id'].value,
        amount: target['amount'].value,
        date: target['date'].value
    })

    _fetch('app/bpl_invoice_payment', { method: 'POST', body, headers: {'Content-Type': 'application/json'} })
    .then( data => {
        modalPop.modal('hide')
        feedback({ message: 'Payment added', alert: 'success' })
    } )
    .catch( error => feedback({ message: error, alert: 'danger' }) )

    e.preventDefault()
}

const paymentForm = (e, id, amount, date) => {
    modalPop.find('.modal-dialog').removeClass('modal-lg')
    modalPop.find('.modal-title').text($(e).parents('tr').find('td')[0].innerText)
    modalPop.find('.modal-body').html(`
        <form class="submit-disabled" onsubmit="addPayment(event, this)">
            <input type="hidden" name="id" value="${id}">

            <div class="form-row">
                <label>Date of Payment:</label>
                <input type="text" name="date" class="form-control form-control-sm ml-3 date" autocomplete="off" value="${date}" required style="max-width: 250px;">
            </div>

            <div class="form-row my-4">
                <label>Amount Payed:</label>
                <input type="number" name="amount" class="form-control form-control-sm ml-3" step="0.01" autocomplete="off" value="${amount}" required style="max-width: 250px;">
            </div>

            <button type="submit" class="btn btn-primary" id="submit" disabled>Add Payment</button>
        </form>
    `)

    modalPop.find('.date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true })
    modalPop.modal({ backdrop: 'static' })     
}

const dividePacking = (e, label, number) => {
    modalPop.find('.modal-title').html(`<span>Partial Shipments for</span> <span id="packingNumber" data-number="${number}">${label}</span>`).addClass('m-0')
    modalPop.find('.modal-body').html(`
        <label>Number of Shipments</label>
        <input type="number" class="form-control form-control-sm mt-2" placeholder="Type in number > 1 and Press Enter" data-containers='${JSON.stringify($(e).data('containers'))}' onkeydown="partialShipments(event, this)">
    `)

    modalPop.modal({ backdrop: 'static' })     
}

const partialShipments = (e, target) => {
    let $this = $(target)
    if ( e.keyCode === 13 && $this.val() > 1 ) {
        let containers = $this.data('containers'), shipments = ''

        for (let i = 1; i <= parseInt($this.val()); i++) {
            shipments += `
                <label class="pb-1 pt-2">Shipment ${i}</label>
                <div class="border p-1 shipment-holder" id="shipment${i}" ondrop="drop(event)" ondragover="allowDrop(event)" style="min-height: 100px;"></div>
            `
        }

        modalPop.find('.modal-body').html(`
            <div class="row">
                <div class="col-sm-12 col-md-3">
                    <p class="h5">Containers:</p>
                    ${
                        containers.map((container, i) => `
                            <p>
                                <span class="btn btn-sm btn-secondary m-1" id="drag${i}" draggable="true" ondragstart="drag(event)" data-container='${JSON.stringify(container)}'>${container.name}</span>
                            </p>
                        `).join('')
                    }
                </div>
                <div class="col-sm-12 col-md-9">${shipments}</div>
            </div>

            <button class="btn btn-outline-secondary" onclick="createPartialShipments()">Create Shipments</button>
        `)
    }
}

const createPartialShipments = () => {
    let payload = { number: $('#packingNumber').data('number'), shipments: [] }
    
    for (let i = 0; i < $('.shipment-holder').length; i++) {
        let nodeChildren = $($('.shipment-holder')[i]).children()

        if ( nodeChildren.length > 0 ) {
            let shipment = []
            nodeChildren.map( (i, el) => {
                let container = $(el).data('container')
                container.id = `container_${i+1}`
                shipment.push(container)
            } )

            payload.shipments.push(shipment)
        } else {
            alert('Empty shipment is not allowed!')
            return false
        }
    }

    _fetch('app/bpl_partial_shipments', { method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type': 'application/json'} })
    .then( data => {
        modalPop.modal('hide')
        feedback({ message: 'Success', alert: 'success' })
        setTimeout( () => _push('bpl_packing_list'), 500 )
    } )
    .catch( error => feedback({ message: error, alert: 'danger' }) )    
}

const allowDrop = e => e.preventDefault()

const drag = e => e.dataTransfer.setData("text", e.target.id)

const drop = e => {
    e.preventDefault()
    e.target.appendChild(document.getElementById(e.dataTransfer.getData("text")))
}
