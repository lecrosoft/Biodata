"use strict"

class Scanner {

    constructor ( file, table, title = 'Scanning' ) {
        this.file = this.checker(file)
        this.table = table
        this.api = 'app/' + this.file
        this.title = title
    }

    getEntries ( container, date ) {
        
       
        _fetch( `${this.api}?query=WHERE date = '${date}' AND ${this.table}.deleted_at IS NULL` )
        .then( data => {
            container.html(`
                <table class="table table-md">
                    <thead>
                        <tr>
                            <th><input type="checkbox" class="pointer check-all" /></th>
                            <th>Location</th>
                            <th>Barcode</th>
                            <th>Product</th>
                            <th>Weight</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${
                            JSON.parse(data).map( ({ id, user, barcode, location, productname, weight, ...prop }) => {
                                let disabled = ( prop.status ) ? 'disabled' : ''
                                return `
                                    <tr>
                                        <td>
                                            <input type="checkbox" class="pointer checker ${disabled}" data-id="${id}" ${disabled} />
                                        </td>
                                        <td>${location}</td>
                                        <td>${barcode}</td>
                                        <td>${productname}</td>
                                        <td>${weight}</td>
                                    </tr>
                                `
                            } ).join('')                          
                        }
                    </tbody>                      
                </table>
            `)

            table = container.find('table').DataTable({ lengthChange: false, info: false, pageLength:  10, ordering: false })
        } )
        .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) )
    }

    entries () {
        let content = $(`
            <div class="content hide-dtsearch">
                <div class="content-head d-flex justify-content-between p-3 position-relative mb-4">
                    <div class="bulk-actions d-flex align-items-center justify-content-between position-absolute px-4 w-100 h-100" style="transition: all 0.4s ease-in-out; background: #eaecf7; bottom: 100px; left: 0;"> 
                        <label class="font-weight-bold selected" />

                        <span class="btn btn-sm text-danger delete"><i class="fa fa-trash" /> DELETE</span>
                    </div>

                    <div class="d-flex">
                        <input type="search" class="form-control form-control-sm mr-5 table-search" placeholder="Search" onkeyup="searchEntries(this)" />
                        <input type="text" class="form-control form-control-sm" id="_dateSearch" autocomplete="off" />
                    </div>

                    <div class="_action">
                        <a href="${this.file}" class="btn btn-sm anchor"><i class="fa fa-qrcode" /> Scan</a>
                    </div>
                </div>

                <div class="content-body" />            
            </div>
        `)

        let container = content.find('.content-body')

        content.find('#_dateSearch')
            .datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true })
            .datepicker( 'setDate', 'now')
            .on('changeDate', () => this.getEntries(container, $('#_dateSearch').val()) )

        this.getEntries(container, content.find('#_dateSearch').val())

        return content
    }

    form (fields, rows = '') {
        window.fields = fields
        
        for ( let i = 0; i < 10; i++ ) {
            let required = (i === 0) ? 'required' : ''
            rows += `
                <tr>
                    <td class="w-25"><input type="text" name="barcode" class="form-control form-control-sm barcode" id="input${i}" autocomplete="off" minlength="7" maxlength="18" ${required}/></td>
                    <td class="text-center icon"></td>
                    <td class="w-50 productname"></td>
                    <td class="text-right value" data-field="weight"></td>
                </tr>
            `
        }

        let content = $(`
            <div class="d-flex justify-content-between border-bottom pt-1 mb-3">
                <h5 class="font-weight-bold">${this.title}</h5>
                <a href="report_${this.file}" class="nounderline" target="_blank">View entries</a>
            </div>

            <form name="barcode_scanned" class="row submit-disabled" onsubmit="return submitForm(this, fields)">
                <div class="col-lg-4">
                    ${ fields.map( field => {
                        if ( field.type === 'select' ) {
                            return `<div class="form-group">${this.dropdown(field)}</div>`
                        }

                        return `<div class="form-group">${this.input(field)}</div>`
                    } ).join('') }

                    <div class="d-none d-lg-block">
                        <hr />
                        <button type="submit" name="save" class="btn btn-primary" id="submit" disabled>Save</button>
                    </div>
                </div>

                <div class="col-lg-8">
                    <table class="table table-md vertical-top edge-pad borderless-top">
                        <thead>
                            <tr>
                                <th>Barcode</th>
                                <th class="text-center">Status</th>
                                <th>Product</th>
                                <th class="text-right">Weight</th>
                            </tr>
                        </thead>

                        <tbody>${rows}</body>                   
                    </table>
                    
                    <div class="d-lg-none">
                    <hr />
                        <button type="submit" name="save" class="btn btn-primary" id="submit" disabled>Save</button>
                    </div>
                </div>            
            </form>
        `)
        
        content.find('#date')
            .datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true })
            .datepicker( 'setDate', 'now')

        return content
    }

    input (params = {}) {
        let defs = {
            name: 'field',
            type: 'text',
            value: '',
            _require: false,
            disable: false,
        }

        const { name, type, label, value, _require, disable } = { ...defs, ...params }
        let required = _require ? 'required' : '',
            disabled = disable ? 'disabled' : ''

        return `
            <label for="${name}">${label}</label>
            <input type="${type}" name="${name}" class="form-control form-control-sm" id="${name}" autocomplete="off" value="${value}" ${required} ${disabled}>
        `
    }

    dropdown (params) {
        const { name, type, label, options, selected, _require } = params
        let required = _require ? 'required' : ''
        
        return `
            <label for="${name}">${label}</label>

            <select name="${name}" class="form-control form-control-sm" id="${name}" ${required}>
                ${ options.map(option => createOption(option.text, option.value, selected)) }                            
            </select>
        `        
    }

    checker ( str ) {
        if ( typeof(str) === 'undefined' )
            throw "Missing parameters"
        else if ( typeof(str) !== 'string' )
            throw "String data type expected, "+typeof(str)+' given'
        else
            return str
    }

}


function searchEntries (input) {
    table.search( input.value ).draw()
}


function submitForm (form, fields) {
    const button = $(form['save']).attr('disabled', true)

    let data = { scanned: successScanned }
    for ( let field of fields ) {
        let i = field.name
        data[i] = form[i].value
    }  
    
    if ( data.scanned.length > 0 ) {
        
        _fetch(url, { method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'} })
        .then( data => {
            if ( parseInt(data) === 1 ) {
                setTimeout( () => window.location.reload(), 500 )
                feedback({ message: 'Entry submitted successfully', className: 'fixed-top', alert: 'success' }) 
            } else {
                feedback({ message: 'Oops, something went wrong! Entry not submitted', className: 'fixed-top', alert: 'danger' })
            }
        } )
        .catch( error => feedback({ message: error, className: 'fixed-top', alert: 'danger' }) )
    } else {
        feedback({ message: 'No valid entry to save', className: 'fixed-top', alert: 'danger' })
        button.attr('disabled', false)
    }

    return false
}

function hardrollCheck (input) {
    const id = input.attr('id')
    const barcode = $(input).val()
    const scannedIndex = successScanned.findIndex(item => item.id === id)

    if ( barcode !== '' && ! scanned.includes(barcode) ) {
        
        _fetch(`${url}/${barcode}?company=${$('#company').val()}&location=${$('#location').val()}`)
        .then( response => {
            let data = JSON.parse(response),
                row = $(input).parent('td').parent('tr'),
                field = $('td.value').data('field'),
                tdIcon = row.find('td.icon'),
                tdProduct = row.find('td.productname'),
                tdValue = row.find('td.value')                
            
            if ( 'success' in data ) {
                const obj = data.success, product = obj.productname, value = parseFloat(obj[field])

                tdIcon.html('<i class="fa fa-2x fa-check text-success" />')
                tdProduct.text(product)
                tdValue.text(value)

                if (scannedIndex < 0) {
                    successScanned.push({ id, barcode, product, [field]: value })
                } else {
                    successScanned[scannedIndex].barcode = barcode
                    successScanned[scannedIndex].product = product
                    successScanned[scannedIndex][field] = value
                }

                inputFocus(input)   
                document.getElementById("company").disabled=true;                     
            } else {
                tdProduct.text('')
                tdValue.text('')                
                tdIcon.html(`<i class="fa fa-2x fa-close text-danger pointer" data-toggle="tooltip" data-placement="right" title="${data.error}" />`)
                
                $('[data-toggle="tooltip"]').tooltip()
                
                if (scannedIndex > -1) {
                    successScanned.splice(scannedIndex, 1)
                }

                inputFocus(input)
            }

            $('#currentcount').text(successScanned.length || '')         
        } )
        .catch( error =>{
            console.log(error);
            feedback({ message: error, className: 'fixed-top', alert: 'danger' })
        })

    } else {
        $(input).val(current)
    }

    scanned = inputBarcode()
}


function inputBarcode () {
    let inputs = $('input.barcode'),
        barcode = []

        for ( let i = 0; i < inputs.length; i++ ) {
            let code = $(inputs[i]).val()
            if ( code !== '' )
                barcode.push(code)
        }

    return barcode
}


function inputFocus (param) {
    param
        .parent('td')
            .parent('tr')
                .next()
                    .find('input.barcode')
                        .focus()
}


function updateSelection () {
    let checked = $('input.checker:checked'), len = checked.length
    
    $('label.selected').text(`${len} item${len > 1 ? 's' : ''} selected`)
    $('.bulk-actions').css({ bottom: (len > 0) ? '0' : '100px' })

    $('input.check-all').prop( 'checked', len === $('input.checker').length && len > 0 )
}


$(document).on( 'keypress', 'input.barcode', function(e) {
    if ( e.keyCode === 13) {
        trigger = true
        hardrollCheck($(this))
        e.preventDefault()
    }
} )

$(document).on( 'change', 'input.barcode', function(e) {
    if ( ! trigger )
        hardrollCheck($(this))
    else trigger = false
} )

$(document).on( 'focus', 'input.barcode', data => {
    current = $(data.currentTarget).val()
} )

$(document).on( 'click', 'input.check-all', function() {
    $('input.checker:not(.disabled)').prop('checked', $(this).is(':checked'))
    updateSelection()
} )

$(document).on( 'click', 'input.checker', () => updateSelection() )


$(document).on( 'click', '.bulk-actions .delete', () => {
    let items = [], rows = []
    for ( let item of $('input.checker:checked') ) {
        items.push($(item).data('id'))
        rows.push($(item).parents('tr'))
    }

    _fetch( `${url}/${items.join()}`, {method: 'DELETE'} )
    .then( data => {
        table.table().rows(rows).remove().draw(false)
        updateSelection()
    } )
    .catch( error => feedback({ message: error, className: 'fixed-top', alert: 'danger' }) )
} )


var trigger = false,
    scanned = inputBarcode(),
    successScanned = [],
    current = '',
    table
