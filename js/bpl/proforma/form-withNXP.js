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
    .catch ( () => _push('bpl_proforma') ) 

    function content(data = {}) {
        const { id, number, freight, freight_price, payment, currency, account, nxp_number, date, items, } = data
        const accounts = xhr({ url: 'app/bpl_accounts', methodType: 'GET' })
        const currencies = xhr({ url: 'app/currencies', methodType: 'GET' })

        let content = $(`
            <form class="row submit-disabled" method="POST">
                <div class="col-lg-6">
                    <input type="hidden" name="id" value="${formVal(number)}">
                    
                    <div class="form-row border-bottom mb-3">
                        <div class="form-group col-md-6">
                            <label for="number">Number</label>
                            <input type="text" name="number" class="form-control form-control-sm" value="${`BPL/GC/${id}`}" readonly>
                        </div>

                        <div class="form-group col-md-6">
                            <label for="date">Date</label>
                            <input type="text" name="date" class="form-control form-control-sm" value="${date}" readonly>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="freight">Freight</label>
                            <select name="freight" class="form-control form-control-sm" id="freight" required>
                                <option value="">Choose</option>
                                ${
                                    ['Freight 40\" high cubes', 'Freight 20\" high cubes'].map(val => createOption(val, val, freight))
                                }
                            </select> 
                        </div>

                        <div class="form-group col-md-6">
                            <label for="freight_price">Freight Price</label>
                            <input type="number" name="freight_price" class="form-control form-control-sm text-right" id="freight_price" min="1" step="0.01" value="${freight_price}" autocomplete="off" required> 
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="payment">Payment</label>
                            <input type="text" name="payment" class="form-control form-control-sm" id="payment" value="${formVal(payment)}" autocomplete="off" required> 
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
                            <label for="nxp">NXP Number</label>
                            <input type="text" name="nxp" class="form-control form-control-sm" id="nxp" value="${formVal(nxp_number)}" autocomplete="off" required> 
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

                <div class="col-lg-12 mt-4">
                    <div class="d-flex align-items-center justify-content-between py-3 border-top">
                        <button type="submit" class="btn btn-primary" id="submit" disabled><i class="fa fa-save" /> Save</button>

                        ${ number ? `<button type="button" class="btn btn-sm text-danger" onClick="handleDelete('${id}')"><i class="fa fa-trash" /> DELETE</button>` : '' }
                    </div>  
                </div>                             
            </form>
        `)

        resolver( currencies, data => {
            for (let res of data) {
                content.find('#currency').append(createOption(res.code, res.id, currency))
            }
        } )

        resolver( accounts, data => {
            for (let res of data) {
                content.find('#account').append(createOption(`${res.account} (${res.bank})`, res.id, account))
            }
        } )

        const rows = items.map( ({ id, order_item_id, productname, weight, price }) => `         
            <tr class="item" data-item="${id}" data-order-item="${order_item_id}">
                <td>${productname}</td>
                <td class="text-center">${weight / 1000}<small>MT</small></td>
                <td>
                    <input type="number" name="price" class="form-control form-control-sm text-right price" min="1" step="0.01" value="${price}" autocomplete="off" required>
                </td>                
            </tr>
        ` )

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
