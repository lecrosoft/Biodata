"use strict"

function _new() {
    $(document).on( 'submit', '.generate-proforma', function() {
        _push('bpl_proforma#'+this.id.value)
        return false 
    } )

    return `
        <form class="border-bottom py-3 mb-5 generate-proforma">
            <input type="number" name="id" class="form-control form-control-sm d-inline" autocomplete="off" placeholder="Order ID" style="max-width: 200px" required>
            <button type="submit" class="btn btn-sm text-secondary">Generate Proforma</button>
        </form>
    `
}

function form() {
    let search = location.hash.replace('#', '')    
    let _new = true

    _fetch(`app/bpl_proforma/${search}`)
    .then( data => $(wrapper).html(content(JSON.parse(data))) )
    .catch ( () => _push('bpl_proforma') ) 

    function content(data = {}) {
        const { id, number, customername, payment, tolerance, origin, supplycountry, port, date, items, } = data
        const customers = xhr({ url: 'app/bpl_customers', methodType: 'GET' })
        const products = xhr({ url: 'app/bpl_products', methodType: 'GET' })
        const count = items ? items.length : 5
     
        let content = $(`
            <form class="row submit-disabled" method="POST">
                <div class="col-lg-6">
                    <input type="hidden" name="id" value="${formVal(id)}">
                    
                    <div class="form-row border-bottom mb-3">
                        <div class="form-group col-md-6">
                            <label for="number">Number</label>
                            <input type="text" name="number" class="form-control form-control-sm" value="${formVal(number)}" readonly>
                        </div>

                        <div class="form-group col-md-6">
                            <label for="date">Date</label>
                            <input type="text" name="date" class="form-control form-control-sm" value="${formVal(date)}" readonly>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label for="terms">Terms of Delivery</label>
                            <select name="terms" class="form-control form-control-sm" id="terms" required>
                                <option value="">Choose</option>
                            </select> 
                        </div>

                        <div class="form-group col-md-4">
                            <label for="shipment">Shipment</label>
                            <select name="shipment" class="form-control form-control-sm" id="shipment" required>
                                <option value="">Choose</option>
                            </select> 
                        </div>

                        <div class="form-group col-md-4">
                            <label for="payment">Payment</label>
                            <input type="text" name="payment" class="form-control form-control-sm" id="date" value="${formVal(payment)}" autocomplete="off" required> 
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label for="packing">Packing</label>
                            <select name="packing" class="form-control form-control-sm" id="packing" required>
                                <option value="">Choose</option>
                            </select> 
                        </div>

                        <div class="form-group col-md-4">
                            <label for="insurance">Insurance</label>
                            <select name="insurance" class="form-control form-control-sm" id="insurance" required>
                                <option value="">Choose</option>
                                <option value="To be covered by buyer">To be covered by buyer</option>
                                <option value="To be covered by seller">To be covered by seller</option>
                            </select> 
                        </div>

                        <div class="form-group col-md-4">
                            <label for="tolerance">Tolerance</label>
                            <input type="text" name="tolerance" class="form-control form-control-sm" id="tolerance" value="${formVal(tolerance)}" autocomplete="off" required> 
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label for="origin">Country of Origin</label>
                            <input type="text" name="origin" class="form-control form-control-sm" id="origin" value="${formVal(origin)}" autocomplete="off" required>
                        </div>

                        <div class="form-group col-md-4">
                            <label for="supplycountry">Country of Supply</label>
                            <input type="text" name="supplycountry" class="form-control form-control-sm" id="supplycountry" value="${formVal(supplycountry)}" autocomplete="off" required>
                        </div>

                        <div class="form-group col-md-4">
                            <label for="port">Port of Loading</label>
                            <input type="text" name="port" class="form-control form-control-sm" id="port" value="${formVal(port)}" autocomplete="off" required> 
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label for="date">For Account of</label>
                            <input type="text" name="date" class="form-control form-control-sm" id="date" value="${formVal(date)}" autocomplete="off" required>
                        </div>

                        <div class="form-group col-md-4">
                            <label for="date">Payment Account</label>
                            <input type="text" name="date" class="form-control form-control-sm" id="date" value="${formVal(date)}" autocomplete="off" required>
                        </div>

                        <div class="form-group col-md-4">
                            <label for="customer">Account Number</label>
                            <select name="customer" class="form-control form-control-sm" id="customer" required>
                                <option value="">Select customer</option>
                            </select> 
                        </div>
                    </div>                    
                </div>

                <div class="col-lg-6">
                    <table class="table table-md">
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Product</th>
                                <th class="text-right">Weight</th>
                            </tr>
                        </thead>

                        <tbody />
                    </table>
                </div> 

                <div class="col-lg-12 mt-4">
                    <div class="d-flex align-items-center justify-content-between py-3 border-top">
                        <div>
                            <button type="submit" class="btn btn-primary" id="submit" disabled><i class="fa fa-save" /> Save</button>
                            <button type="button" class="btn ml-4" onClick="addRow()"><span class="fa fa-plus text-success"></span></button>
                        </div>

                        ${ !_new ? `<button type="button" class="btn btn-sm text-danger" onClick="handleDelete('${id}')"><i class="fa fa-trash" /> DELETE</button>` : '' }
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
