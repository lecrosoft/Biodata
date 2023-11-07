"use strict"

function printOut() {
    let content = $(`<div class='print-layout' />`)

    if (location.search) {
        _fetch(`app/bpl_production_print/${parseInt(location.search.split('=')[1])}`)
        .then( data => $('html').html(data) )
        .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )
    } else {
        $('html').html('Not Found!')
    }
}
