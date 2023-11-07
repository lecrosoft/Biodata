"use strict"

function form() {
    let search = location.hash.replace('#', '')
    let _new = search === 'new'

    if (_new) {
        $(wrapper).html(content())
    } else {
        _fetch(`app/bpl_sales/${search}`)
        .then( data => $(wrapper).html(content(JSON.parse(data))) )
        .catch ( () => _push('bpl_sales') )    
    }

    function content(data = {}) {
        const { id, ref, customername, date, items } = data
        const customers = xhr({ url: 'app/bpl_customers', methodType: 'GET' })
        const products = xhr({ url: 'app/bpl_products', methodType: 'GET' })
        const count = items ? items.length : 5
     
        let content = $(`
            <div class="d-flex justify-content-between border-bottom pb-2 mb-4">
                <h5>${id ? 'Modify Sales Order' : 'Add Sales Order'}</h5>
                ${ id ? `<a href="app/bpl_sales_print/${id}" title="Reprint" target="_blank"><i class="fa fa-lg fa-print" /></a>` : '' }
            </div>
			
            <form class="row submit-disabled" method="POST">
                <div class="col-lg-6">
                    <input type="hidden" name="id" value="${formVal(id)}">
                    
                    <div style="max-width: 400px">
                        <div class="form-group">
                            <label for="date">Date</label>
                            <input type="text" name="date" class="form-control" id="date" value="${formVal(date)}" autocomplete="off" required>
                        </div>
                        <div class="form-group">
                            <label for="customer">Company</label>
                            <select name="company" class="form-control" id="company" required>
                                <option value="">Select Company</option>
                                <option value="Belimpex">Belimpex</option>
                                <option value="Belpapyrus">Belpapyrus</option>
                            </select> 
                        </div>

                        <div class="form-group">
                            <label for="customer">Customer</label>
                            <select name="customer" class="form-control" id="customer" required>
                                <option value="">Select customer</option>
                            </select> 
                        </div>

                        ${id ? `
                            <div class="form-group">
                                <label for="ref">Order ref</label>
                                <input type="text" name="ref" class="form-control" id="ref" value="${formVal(ref)}" autocomplete="off" required>
                            </div>
                        ` : ''}						
                    </div>
                </div>

                <div class="col-lg-6">
                    <table class="table table-md">
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Product</th>
                                <th class="text-right">Weight (kg)</th>
                            </tr>
                        </thead>

                        <tbody />
                    </table>
                </div> 

                <div class="col-lg-12 mt-4">
                    <div class="d-flex align-items-center justify-content-between py-3 border-top">
                        ${ data.proforma ? '<p class="text-danger">Proforma invoice generated</p>' : `
                            <div>
                                <button type="submit" class="btn btn-primary" id="submit" disabled><i class="fa fa-save" /> Save</button>
                                <button type="button" class="btn ml-4" onClick="addRow()"><span class="fa fa-plus text-success"></span></button>
                            </div>

                            ${ !_new ? `<button type="button" class="btn btn-sm text-danger" onClick="handleDelete('${id}')"><i class="fa fa-trash" /> DELETE</button>` : '' }
                        ` }
                    </div>  
                </div>                             
            </form>
        `)

        resolver( customers, data => {
            for (let res of data) {
                content.find('#customer').append(createOption(res.customername, res.id, customername))
            }
        } )

        resolver( products, data => {
            for ( let i = 1; i <= count; i++ ) {
                let options = `<option value="">Select product</option>`, key = i - 1

                for (let res of data) {
                    options += createOption(res.productname, res.id, items ? items[key].productname : '')
                }

                content.find('tbody').append(`
                    <tr ${(items) ? `class="filled" data-item="${items[key].id}"` : ''}>
                        <td>${i}</td>
                        <td>
                            <select name="product" class="form-control form-control-sm product">${options}</select> 
                        </td>
                        <td class="w-25">
                            <input type="number" name="weight" class="form-control form-control-sm text-right weight" min="1" step="0.01" value="${items ? items[key].weight : ''}"  autocomplete="off">
                        </td>
                    </tr>
                `)
            }
            selecter(content.find('.product'))
            productValidation()
        } )      

        content.find('#date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker( 'setDate', date ? date : 'now')
        selecter(content.find('#customer'))

        return content        
    }
}

$(document).on( 'change', 'select.product', function() {
    let row = $(this).parent('td').parent('tr'),
        input = row.find('td:eq(2)').find('input')

    if ($(this).val() === '') {
        input.attr('required', false).val('')
        row.removeAttr('class')
    } else {
        input.attr('required', true)
        row.attr('class', 'filled')
    }

    productValidation()
    checkDuplicates()
} )

function productValidation() {
    let rows = document.getElementsByClassName('filled'),
        product = document.getElementsByClassName("product")[0]

    if (rows.length === 0) {
        product.setCustomValidity("Add product(s) to form to place order.")
    } else {
        product.setCustomValidity('')
    }
}

function checkDuplicates() {
    let values = [], el = document.getElementById("submit")

    $(".duplicate").removeClass("duplicate")
    let selects = $('select.product')

    selects.each( function() {
        let v = this.value
        if (!v) return true

        let val = this.value + $(this).parents('tr')

        if (values.includes(val)) selects.filter(function() { return this.value + $(this).parents('tr') == val }).addClass("duplicate")

        values.push(val)
    } )

    if ($(".duplicate").length) el.setCustomValidity('Remove duplicate items to place order.')
    else el.setCustomValidity('')
}

function addRow(options = `<option value="">Select product</option>`) {
    let tbody = $('form table tbody')
    
    if (tbody.find('tr:not(.filled)').length === 0) {
        _fetch('app/bpl_products')
        .then( data => {
            for (let res of JSON.parse(data)) {
                options += createOption(res.productname, res.id, null)
            }

            tbody.append(`
                <tr>
                    <td>${tbody.find('tr').length + 1}</td>
                    <td>
                        <select name="product" class="form-control form-control-sm product">
                            ${options}
                        </select> 
                    </td>
                    <td class="w-25">
                        <input type="number" name="weight" class="form-control form-control-sm text-right weight" min="1" step="0.01" autocomplete="off">
                    </td>
                </tr>
            `)
            selecter(tbody.find('.product'))
        } )
        .catch( error => feedback({ message: 'Could not get products', wrapper, alert: 'danger' }) )
    }
}

function salesItems(items = []) {
    for (let row of $('tr.filled')) {
        
        items.push({
            id: $(row).data('item'),
            productid: parseInt($(row).find('.product').val()),
            weight: parseFloat($(row).find('.weight').val())
        })
    }

    return items    
}
