"use strict"

function form() {
    let search = location.hash.replace('#', '')
    let _new = search === 'new'

    if (_new) {
        return content()
    } else {
        _fetch(`app/bpl_production/${parseInt(search)}`)
        .then( data => {
            let json = JSON.parse(data)
            $(wrapper).html( json ? content(json) : errorComponent )
        } )
        .catch (() => $(wrapper).html(errorComponent))    
    }

    function content(data = {}) {
        const { id, customername, papermachine, productname, hardrollnumber, barcode, corediameter, joints, weight, hold, comments, dateofmanufacture } = data
        const customers = xhr({ url: 'app/bpl_customers', methodType: 'GET' })
        const products = xhr({ url: 'app/bpl_products?search=WHERE `bpl_products`.`deleted_at` IS NULL', methodType: 'GET' })
        const cart = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
        const checked = value => {
            if (hold === 'hold' && value === 'yes') {
                return 'checked'
            } else if (hold !== 'hold' && value === 'no') {
                return 'checked'
            } else {
                return ''
            }
        }

		let dateState = id ? 'disabled' : 'required'
		let pmState = id ? 'disabled' : 'required'

        let content = $(`
            <div class="d-flex justify-content-between border-bottom mb-4 text-info">
                <h5>${id ? 'Modify Jumboreel' : 'Add Jumboreel'}</h5>
                ${ id ? `<a href="app/bpl_production_print/${id}" title="Reprint" target="_blank"><i class="fa fa-lg fa-print" /></a>` : '' }
            </div>

            <form class="submit-disabled" method="POST">
                <input type="hidden" name="id" value="${formVal(id)}">

                <div class="form-row">
                    <div class="form-group col-md-3">
                        <label for="date">Date</label>
                        <input type="text" name="date" class="form-control" id="date" value="${formVal(dateofmanufacture)}" autocomplete="off" ${dateState}>
                    </div>

                    <div class="form-group col-md-5">
                        <label for="customer">Customer</label>
                        <select name="customer" class="form-control" id="customer" required>
                            <option value="">Select customer</option>
                        </select>         
                    </div>

                    <div class="form-group col-md-4">
                        <label for="product">Products</label>
                        <select name="product" class="form-control" id="product" required>
                            <option value="">Select product</option>
                        </select> 
                    </div>                                   
                </div>

                <div class="form-row">
                    <div class="form-group col-md-${_new ? 4 : 3}">
                        <label for="corediameter">Core Diameter</label>
                        <input type="text" name="corediameter" class="form-control" id="corediameter" value="${formVal(corediameter)}" autocomplete="off" required>
                    </div> 

                    <div class="form-group col-md-${_new ? 4 : 3}">
                        <label for="papermachine">Paper Machine</label>
                        <select name="papermachine" class="form-control" id="papermachine" ${pmState}>
                            <option value="PM2">2</option>
                            <option value="PM3" ${$('#user').val() === 'pm3' || papermachine === 'PM3' ? 'selected' : ''}>3</option>
                        </select>  
                    </div>

                    <div class="form-group col-md-${_new ? 4 : 3}">
                        ${ _new ? `
                            <label for="cart">Hardroll Cart</label>
                            <select name="cart" class="form-control" id="cart">
                                ${cart.map(item => `<option value="${item}">${item}</option>`)}
                            </select>
                        ` : `
                            <label>Hardroll Number</label>
                            <input type="text" name="hardrollnumber" class="form-control" value="${formVal(hardrollnumber)}" readonly>
                        ` }                                  
                    </div>

                    ${ !_new ? `
                        <div class="form-group col-md-3">
                            <label>Barcode</label>
                            <input type="text" name="barcode" class="form-control" value="${formVal(barcode)}" readonly>
                        </div>
                    ` : '' }                                        
                </div>

                <div class="form-row">
                    <div class="form-group col-md-4">
                        <label for="joints">Joints</label>
                        <input type="text" name="joints" class="form-control" id="joints" value="${joints ? joints : 0}" autocomplete="off" required>
                    </div>

                    <div class="form-group col-md-4">
                        <label for="weight">Weight (kg)</label>
                        <input type="text" name="weight" class="form-control" id="weight" value="${formVal(weight)}" autocomplete="off" required>
                    </div>

                    <div class="form-group col-md-4">
                        <label for="hold">On Hold</label>
                        <div class="d-flex align-items-end pt-2">
                            <input type="radio" name="hold" class="fancy-input round" id="yes" value="Yes" ${checked('yes')}>
                            <label for="yes" class="mr-3 mb-0">&nbsp;Yes</label>
                            <input type="radio" name="hold" class="fancy-input round" id="no" value="No" ${checked('no')}>
                            <label for="no" class="mb-0">&nbsp;No</label>                            
                        </div>
                    </div>                     
                </div>

                <div class="border-bottom mb-2">Comments</div>
                <div class="form-row">
                    <div class="form-group col-md-4">
                        <input type="checkbox" name="comments" class="fancy-input curve comments" id="winding" value="Loose winding at start">
                        <label for="winding">Loose winding at start</label>
                    </div>

                    <div class="form-group col-md-4">
                        <input type="checkbox" name="comments" class="fancy-input curve comments" id="partial" value="With partial break">
                        <label for="partial">With partial break</label>
                    </div>

                    <div class="form-group col-md-4">
                        <input type="checkbox" name="comments" class="fancy-input curve comments" id="ember" value="Suspected ember inside">
                        <label for="ember">Suspected ember inside</label>
                    </div>                                  
                </div>

                <div class="d-flex align-items-center justify-content-between mt-3 py-3 border-top">
                    ${ data.status ? '<p class="text-danger">Out of Factory</p>' : `
                        <button type="submit" class="btn btn-primary" id="submit" disabled>Save</button>
                        ${ !_new ? `<button type="button" class="btn btn-sm text-danger" onClick="handleDelete(${id})"><i class="fa fa-trash" /> DELETE</button>` : '' }
                    ` }
                </div>
            </form>
        `)

        for ( let comment of content.find('.comments') ) {
            if ( formVal(comments).split(',').includes($(comment).val()) ) {
                $(comment).attr('checked', true)
            }
        }

        resolver( customers, data => {
            for (let customer of data) {
                let selected = customer.customername === customername ? 'selected' : ''
                content.find('#customer').append(`<option value="${customer.id}" data-products='${customer.products}' ${selected}>${customer.customername}</option>`)
            }
        } )

        resolver( products, data => {
            for (let res of data) {
                content.find('#product').append(createOption(res.productname, res.id, productname))
            }
        } )        

        content.find('#date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker( 'setDate', dateofmanufacture ? dateofmanufacture : 'now')
        content.find('#product, #customer').css('width', '100%').select2({ theme: "bootstrap4" })

        return content        
    }
}  
