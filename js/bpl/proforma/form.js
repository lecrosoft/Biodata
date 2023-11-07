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
    .then( data => {
        let json = JSON.parse(data)
        $(wrapper).html(json ? content(json) : `<h5 class="text-danger">Sales order does not exist</h5>`)
    } )
    .catch( error => feedback({ message: error, wrapper, alert: 'danger' }) ) 

    function content(data = {}) {
        const { id, pfi, ref, customer_ref, freight, container, freight_price, terms, shipment, payment_terms, nxp, currency, account_id, customerlabel, date, sales_date, items, customer_approve, deleted_at } = data
        const accounts = xhr({ url: 'app/bpl_accounts', methodType: 'GET' })
        const currencies = xhr({ url: 'app/currencies', methodType: 'GET' })
        const db_payment_terms = xhr({ url: 'app/bpl_payment_terms', methodType: 'GET' })
        const _disabled = deleted_at ? '' : 'disabled'
        const open = pfi && deleted_at === null
		
		const printBtn = (open) ? `<a href="app/bpl_proforma_print/${id}" target="_blank"><i class="fa fa-lg fa-print ml-5" /></a>` : ''

        let set_freight_price = freight_price ? freight_price : 0

        let content = $(`
            <form class="row submit-disabled" method="POST">
                <div class="col-lg-6">
                    <input type="hidden" name="id" value="${formVal(id)}">
                    <input type="hidden" name="pfi" value="${formVal(pfi)}">
                    
                    <div class="form-row border-bottom mb-3">
                        <div class="form-group col-md-6">
                            <label for="number">Number</label>
                            <input type="text" name="number" class="form-control form-control-sm" value="${`BPL/${data.iso}/${customerlabel}/${ref}`}" readonly>
                        </div>

                        <div class="form-group col-md-6">
                            <label for="date">Date</label>
                            <input type="text" name="date" class="form-control form-control-sm" id="date" autocomplete="off" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-5">
                            <label for="freight">Freight</label>
                            <select name="freight" class="form-control form-control-sm" id="freight" required>
                                <option value="">Choose</option>
                                ${
                                    ['40ft High Cube Container', '20ft High Cube Container', 'Inland Transport'].map(val => createOption(val, val, freight))
                                }
                            </select> 
                        </div>

                        <div class="form-group col-md-3">
                            <label for="container">Container Quantity</label>
                            <input type="number" name="container" class="form-control form-control-sm" id="container" min="1" value="${formVal(container)}" autocomplete="off" required> 
                        </div>

                        <div class="form-group col-md-4">
                            <label for="freight_price">Freight Price per Container</label>
                            <input type="number" name="freight_price" class="form-control form-control-sm text-right" id="freight_price" step="0.01" value="${set_freight_price}" autocomplete="off" required> 
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="terms">Terms of Delivery</label>
                            <select name="terms" class="form-control form-control-sm" id="terms" required>
                                <option value="">Choose</option>
                                ${
                                    [ 'CFR', 'Door to Door', 'FOB' ].map(val => createOption(val, val, terms))
                                }                                
                            </select>
                        </div>

                        <div class="form-group col-md-6">
                            <label for="shipment">Shipment</label>
                            <select name="shipment" class="form-control form-control-sm" id="shipment" required>
                                <option value="">Choose</option>
                                ${
                                    [ 'Vessel', 'Truck' ].map(val => createOption(val, val, shipment))
                                }                                
                            </select> 
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="payment">Payment</label>
                            <select name="payment" class="form-control form-control-sm" id="payment" required>
                                <option value="">Choose</option>
                            </select>
                        </div>

                        <div class="form-group col-md-6">
                            <label for="currency">Currency</label>
                            <select name="currency" class="form-control form-control-sm" id="currency" required>
                                <option value="">Choose</option>
                            </select> 
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="account">For Account of</label>
                            <select name="account" class="form-control form-control-sm" id="account" required>
                                <option value="">Choose</option>
                            </select>
                        </div>

                        <div class="form-group col-md-6">
                            <label for="customer_ref">Customer Ref</label>
                            <input type="text" name="customer_ref" class="form-control form-control-sm" id="customer_ref" value="${formVal(customer_ref)}" autocomplete="off">
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <table class="table table-md">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th class="text-center" style="width: 100px;">Qty/MT</th>
                                <th class="text-right" style="width: 150px;">Unit Price</th>
                            </tr>
                        </thead>

                        <tbody />
                    </table>
                </div> 

                ${ customer_approve
                    ? `
                        <div class="col-lg-6 my-3 font-weight-bold">
                            <label for="nxp">NXP Number</label>
                            <input type="text" name="nxp" class="form-control form-control-sm mb-4" id="nxp" value="${formVal(nxp)}" placeholder="nxp" autocomplete="off">
                            <button type="button" class="btn btn-sm btn-secondary" onClick="handleNXP('${pfi}')">Save NXP</button>
							${printBtn}
                        </div>

                        <div class="col-lg-6">
                            ${ (!nxp) ? `<button type="button" class="btn btn-sm btn-danger" onClick="cancelApproval(${pfi},${customer_approve})">Cancel Approval</button>` : '' }
                        </div>
                    `
                    : [1, 2, 73].includes(level)
                    ? `<div class="col-lg-12 mt-4">
                        <div class="d-flex align-items-center justify-content-between py-3 border-top">
                            <div>
                                <button type="submit" class="btn btn-primary" id="submit" ${_disabled}><i class="fa fa-save" /> Save</button>
								${printBtn}
                            </div>

                            <div>
                                ${ (open) ? `<button type="button" class="btn btn-sm btn-secondary mr-5" onClick="approval(${pfi})">Customer Approved</button>` : '' }

                                ${ (open) ? `<button type="button" class="btn btn-sm text-danger" onClick="handleDelete('${pfi}')"><i class="fa fa-trash" /> DELETE</button>` : '' }
                            </div>
                        </div>  
                    </div>` : '<p class="text-info p-3">Customer approval pending</p>'
                }                         
            </form>
        `)

        resolver( db_payment_terms, data => {
            for (let res of data) {
                content.find('#payment').append(createOption(res.payment_terms, res.id, payment_terms))
            }
        } )

        resolver( currencies, data => {
            for (let res of data) {
                content.find('#currency').append(createOption(res.code, res.id, currency))
            }
        } )

        resolver( accounts, data => {
            for (let res of data) {
                const bank = (res.currency) ? `${res.bank} (${res.currency})` : res.bank
                content.find('#account').append(createOption(bank, res.id, account_id))
            }
        } )

        const rows = items.map( ({ id, order_item_id, productname, weight, price }) => `         
            <tr class="item" data-item="${id}" data-order-item="${order_item_id}">
                <td>${productname}</td>
                <td class="text-center">${weight / 1000}<small>MT</small></td>
                <td>
                    <input type="number" name="price" class="form-control form-control-sm text-right price" min="1" step="0.01" value="${formVal(price)}" autocomplete="off" required>
                </td>                
            </tr>
        ` )

        content.find('#date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker( 'setDate', date ? date : sales_date).on( 'changeDate', e => customer_approve ? handleDate(e, pfi) : null )

        content.find('tbody').append(rows)

        return content        
    }
}

function proformaItems(items = []) {
    for (let row of $('tr.item')) {
        items.push({
            id: $(row).data('item'),
            order_item_id: $(row).data('order-item'),
            price: parseFloat($(row).find('.price').val())
        })
    }

    return items    
}
