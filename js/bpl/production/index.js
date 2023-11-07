"use strict"

let errorComponent = `Not Found! <button class="btn btn-sm btn-danger" onClick="_push('bpl_production')">Go back</button>`

let wrapper = 'div#wrapper', level = parseInt($('#access').val()), table

$('body').prepend(modal({footer: false}))

window.onpopstate = e => loadUrl(document.location.href)

const _push = url => {
    history.pushState(null, null, url)
    loadUrl(document.location.href)
}

const loadUrl = url => {
    if ( url === location.origin + location.pathname ) {
        $(wrapper).html(index)
    } else {
        switch (location.hash.split('#')[1]) {
            case 'printout':
                _push('bpl_production')
                break              
            default:
                $(wrapper).html(form)
        }
    }
}

loadUrl(document.location.href)

const openEntry = id => [1, 30, 49].includes(level) ? _push(`bpl_production#${id}`) : ''
const handleDelete = id => {
    bbConfirm( 'Are you sure you wish to delete?', data => {
        if (data) {
            _fetch( `app/bpl_production/${id}`, {method: 'DELETE'} )
            .then( () => _push('bpl_production') )
            .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )
        }
    } )    
}

$(document).on( 'submit', 'form.submit-disabled', function() {
    let checkedComment = []
    for (let comment of this['comments'] ) {
        if ($(comment).is(':checked')) {
            checkedComment.push(comment.value)
        }
    }

    let id = this['id'].value
    let data = {
        date: this['date'].value,
        customer_id: this['customer'].value,
        product_id: this['product'].value,
        corediameter: this['corediameter'].value,
        papermachine: this['papermachine'].value,
        joints: this['joints'].value,
        weight: this['weight'].value,
        hold: this['hold'].value === 'No' ? null : 'hold',
        comments: checkedComment.join()           
    }

    _fetch(`app/bpl_products/${data.product_id}`)
    .then( resp => {
        data.product = JSON.parse(resp)
        if (id) {
            data.hardrollnumber = this['hardrollnumber'].value
            data.barcode = this['barcode'].value
            postData('app/bpl_production/'+id, 'PUT', data)
        } else {
            data.cart = this['cart'].value
            data.customername = $('#customer').find('option:selected').text()
            confirm(data)
        }        
    } )
    .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )

    return false
} )

$(document).on( 'change', '#customer', function() {
    console.log($(this).find('option:selected').data('products'))
} )

function confirm(data) {
    const { date, customername, product, papermachine, corediameter, joints, weight, hold, comments } = data

    let hardroll = _fetch(`app/generate_hardroll?date=${data.date}&machine=${data.papermachine}&cart=${data.cart}`),
        modal = $('#bsModal'),
        content = $(`
            <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center">
                    <span class="hardroll_prepend"></span>
                    <input type="text" name="hardrollnumber" class="form-control form-control-sm w-50 hardroll_append" autocomplete="off">
                </div>
                <button type="button" class="btn btn-sm btn-primary confirm">Confirm</button>
            </div>
            <table class="table table-sm">
                <tr><th>Date</th> <td>${date}</td></tr>
                <tr><th>Customer</th> <td>${customername}</td></tr>
                <tr><th>Grade</th> <td>${product.gradetype}</td></tr>
                <tr><th>Grade Name</th> <td>${product.gradename}</td></tr>
                <tr><th>Product</th> <td>${product.productname}</td></tr>
                <tr><th>Paper Machine</th> <td>${papermachine}</td></tr>
                <tr><th>Core Diameter</th> <td>${corediameter}</td></tr>
                <tr><th>Slice</th> <td>${product.slice}</td></tr>
                <tr><th>Joints / Breaks</th> <td>${joints}</td></tr>
                <tr><th>Ply</th> <td>${product.ply}</td></tr>
                <tr><th>Brightness</th> <td>${product.brightness}</td></tr>
                <tr><th>GSM (g/m<sup>2</sup>)</th> <td>${product.gsm}</td></tr>
                <tr><th>Width (cm)</th> <td>${product.width}</td></tr>
                <tr><th>Diameter (cm)</th> <td>${product.diameter}</td></tr>
                <tr><th>Weight (kg)</th> <td>${weight}</td></tr>
                <tr><th>On Hold</th> <td>${hold}</td></tr>
                <tr><th>Comments</th> <td>${comments}</td></tr>
            </table>
        `)

    resolver( hardroll, number => {
        let piece = number.split('-')
        content.find('.hardroll_prepend').text(piece[0] + '-')
        content.find('.hardroll_append').val(piece[1])
    } ) 

    modal.find('.modal-title').text('Confirm Jumboreel').addClass('m-0')
    modal.find('.modal-body').html(content)
    modal.modal({ backdrop: 'static' })

    $('button.confirm').click(() => {
        let _val = content.find('.hardroll_append').val()

        if (_val !== '') {
            data.hardrollnumber = content.find('.hardroll_prepend').text() + _val
            postData('app/bpl_production', 'POST', data)
        } else {
            feedback({ message: 'Invalid hardrollnumber', wrapper: '.modal-body', alert: 'danger' })
        }
    })
}

function postData(url, method, body) {
    for (let key of ['customername', 'cart']) {
        delete body[key]
    }

    _fetch(url, { method, body: JSON.stringify(body), headers: {'Content-Type': 'application/json'} })
    .then( data => {
        const {message, id} = JSON.parse(data)
        feedback({ message, wrapper, alert: 'success' })
        $('#bsModal').modal('hide')
        window.open('app/bpl_production_print/'+id, '_blank')
        setTimeout(() => _push('bpl_production'), 500)
    } )
    .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )
}
