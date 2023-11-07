"use strict"

let wrapper = 'div#wrapper'

$('body').prepend(modal({footer: false}))

window.onpopstate = e => loadUrl(document.location.href)

const _push = url => {
    history.pushState(null, null, url)
    loadUrl(document.location.href)
}

const loadUrl = url => {
    if ( url === location.origin + location.pathname ) {
        $(wrapper).html(show)
    } else {
        let search = location.hash.replace('#', '')        
        $(wrapper).html( search === 'new' ? _new : form )
    }
}

loadUrl(document.location.href)

const openEntry = id => [1, 2, 73].includes(level) ? _push(`bpl_proforma#${id}`) : ''

const handleDelete = id => {
    bbConfirm( 'Are you sure you wish to delete?', data => {
        if (data) {
            _fetch( `app/bpl_proforma/${id}`, {method: 'DELETE'} )
            .then( () => _push('bpl_proforma') )
            .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )
        }
    } )    
}

$(document).on( 'submit', 'form.submit-disabled', function() {
    let id = this['pfi'].value
    let url = id ? 'app/bpl_proforma/'+id : 'app/bpl_proforma'
    let method = id ? 'PUT' : 'POST'
    let body = JSON.stringify({
        order_id: this['id'].value,
        customer_ref: this['customer_ref'].value.toUpperCase(),
        freight: this['freight'].value,
        container: this['container'].value,
        freight_price: this['freight_price'].value,
        terms: this['terms'].value,
        shipment: this['shipment'].value,
        payment_term_id: this['payment'].value,
        nxp: this['nxp'] ? this['nxp'].value : null,
        currency_id: this['currency'].value,
        account_id: this['account'].value,
        date: this['date'].value,
        items: proformaItems() 
    })

    _fetch(url, { method, body, headers: {'Content-Type': 'application/json'} })
    .then( data => {
        const {message, id} = JSON.parse(data)
        feedback({ message, wrapper, alert: 'success' })
        window.open('app/bpl_proforma_print/'+id, '_blank')
        setTimeout( () => _push('bpl_proforma'), 500 )
    } )
    .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )

    return false
} )

const approval = id => {
    bbConfirm( 'Are you sure you want to approve?', data => {
        if (data) {
            _fetch( `app/bpl_proforma_customer_approve/${id}`, {method: 'PUT'} )
            .then( () => _push('bpl_proforma') )
            .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )
        }
    }, 'Approve' )    
}

const cancelApproval = (id, approved_id) => {
    bbConfirm( 'Are you sure you want to cancel approval?', data => {
        if (data) {
            _fetch( `app/requests/${approved_id}`, {method: 'DELETE'} )
            .then( () => _push('bpl_proforma#'+id) )
            .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )
        }
    }, 'Yes, cancel!' )    
}

const handleNXP = id => {
    let append = $('#nxp').val() ? `${id}/${$('#nxp').val()}` : id

    _fetch( `app/bpl_proforma_nxp/${append}`, {method: 'PUT'} )
    .then( () => {
        feedback({ message: 'NXP updated!', wrapper, alert: 'success' })
        setTimeout(() => _push('bpl_proforma'), 1000)
    } )
    .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )
}

const handleDate = (e, id) => {
    bbConfirm( 'Are you sure you want to do this? This proforma invoice has been approved', data => {
        if (data) {
            const date = e.currentTarget.value.replace(/\//g, '-')

            _fetch( `app/bpl_proforma_date/${id}/${date}`, {method: 'PUT'} )
            .then( () => {
                _push('bpl_proforma#'+id)
                setTimeout(() => feedback({ message: 'Proforma invoice date updated!', wrapper, alert: 'success' }), 500)
            } )
            .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )
        }
    }, 'Yes, update!' )
}
