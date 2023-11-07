"use strict"

let wrapper = 'div#wrapper', level = parseInt($('#access').val())

$('body').prepend(modal({footer: false}))

window.onpopstate = e => loadUrl(document.location.href)

const _push = url => {
    history.pushState(null, null, url)
    loadUrl(document.location.href)
}

const loadUrl = url => $(wrapper).html( url === location.origin + location.pathname ? show : form )

loadUrl(document.location.href)

const openEntry = id => [1, 2, 73].includes(level) ? _push(`bpl_sales#${id}`) : ''
const handleDelete = id => {
    bbConfirm( 'Are you sure you wish to delete?', data => {
        if (data) {
            _fetch( `app/bpl_sales/${id}`, {method: 'DELETE'} )
            .then( () => _push('bpl_sales') )
            .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )
        }
    } )    
}

$(document).on( 'submit', 'form.submit-disabled', function() {
    let id = this['id'].value
    let url = id ? 'app/bpl_sales/'+id : 'app/bpl_sales'
    let method = id ? 'PUT' : 'POST'
    let req_data = {
        date: this['date'].value,
        customerid: this['customer'].value,
        company:this['company'].value,
        username: document.getElementById('user').value,
        items: salesItems() 
    }

    if(id) {
        req_data.ref = this['ref'].value
    }

    _fetch(url, { method, body: JSON.stringify(req_data), headers: {'Content-Type': 'application/json'} })
    .then( data => {
        const {message, id} = JSON.parse(data)
        feedback({ message, wrapper, alert: 'success' })
        window.open('app/bpl_sales_print/'+id, '_blank')
        setTimeout( () => _push('bpl_sales'), 500 )
    } )
    .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )

    return false
} )
