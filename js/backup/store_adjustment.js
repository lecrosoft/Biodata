
const WRAPPER = 'div#wrapper',
      FILE = 'Report\\Store\\productMovement',
      URL = 'app/route.php'

let report = 'option-4'

generateContent({ report, arg: '' })

function generateClause (input) {
    clause = ''

    let date = `date BETWEEN '${input.datefrom}' AND '${input.dateto}'`

    pusher(input.warehouse, `warehousecode = '${input.warehouse}'`)
    pusher(input.product, `store_adjustment.productid = '${input.product}'`)

    return clause !== '' ? `WHERE ${clause} AND ${date}` : `WHERE ${date}`
}

function searchoption() {
    let form = document.forms['searchform'],
        data = { warehouse: form['warehouse'].value, product: form['product'].value, datefrom: form['datefrom'].value, dateto: form['dateto'].value }

    document.getElementById('myModal').style.display = 'none'

    generateContent({ report, arg: generateClause(data) })

    return false;
}

function form ( data = {} ) {
    let delBtn = ''

    if ( 'id' in data ) {
        data.type = ( data.bundles > 0 ) ? 1 : 0
        data.bundle = Math.abs(data.bundles)
        delBtn = `<button type="button" class="btn btn-sm float-right btn-danger delete" data-value="${data.id}">Delete</button>`
    }
    const { id, bundle, comment, date, floor, productid, type, warehousecode } = data

    let warehouse = xhr({url: URL, data: { request: JSON.stringify({ handler: 'Store\\Warehouse@all', argument: '' }) }, methodType: 'GET'}),
        floors = xhr({url: URL, data: { request: JSON.stringify({ handler: 'Store\\Floor@all', argument: '' }) }, methodType: 'GET'}),
        product = xhr({url: URL, data: { request: JSON.stringify({ handler: 'Product\\Factory@all', argument: data.product_id }) }, methodType: 'GET'}),
    form = $(`
        <form class="submit-disabled adjust-stock">
            <input type="hidden" name="id" id="id" value="${formVal(id)}">

            <div class="form-group row">
                <label for="receive" class="col-sm-4 col-form-label">
                    <input type="radio" name="type" class="fancy-input round" id="receive" value="1" ${checker(type === 1)} required> Receive
                </label>

                <label for="return" class="col-sm-4 col-form-label">
                    <input type="radio" name="type" class="fancy-input round" id="return" value="0" ${checker(type === 0)}> Return
                </label>
            </div>

            <div class="form-group row">
                <label for="warehouse" class="col-sm-4 col-form-label">Warehouse</label>
                <div class="col-sm-8">
                    <select name="warehouse" class="form-control form-control-sm" id="warehouse" disabled>
                        <option value="">Select Warehouse</option>
                    </select>
                </div>
            </div>

            <div class="form-group row">
                <label for="floor" class="col-sm-4 col-form-label">Floor</label>
                <div class="col-sm-8">
                    <select name="floor" class="form-control form-control-sm" id="floor" required>
                        <option value="">Select floor</option>
                    </select>
                </div>
            </div>

            <div class="form-group row">
                <label for="product" class="col-sm-4 col-form-label">Product</label>
                <div class="col-sm-8">
                    <select name="product" class="form-control form-control-sm" id="product" required>
                        <option value="">Select Product</option>
                    </select>
                </div>
            </div>

            <div class="form-group row">
                <label for="bundles" class="col-sm-4 col-form-label">Bundles</label>
                <div class="col-sm-8">
                    <input type="number" name="bundles" class="form-control form-control-sm" id="bundles" min="1" value="${formVal(bundle)}" required>
                </div>
            </div>

            <div class="form-group row">
                <label for="bundles" class="col-sm-4 col-form-label">Comments</label>
                <div class="col-sm-8">
                    <textarea name="comments" class="form-control form-control-sm" rows="2" id="comments">${formVal(comment)}</textarea>
                </div>
            </div>

            <div class="form-group row">
                <label for="date" class="col-sm-4 col-form-label">Date</label>
                <div class="col-sm-8">
                    <input type="text" name="date" class="form-control form-control-sm" id="date" value="${formVal(date)}" onkeydown="return false" data-provide="datepicker" autocomplete="off" required>
                </div>
            </div>

            <hr/>
            <button type="submit" class="btn btn-primary" id="submit" disabled>Save</button>
            ${delBtn}
        </form>
    `)
    
    resolver( warehouse, data => {
        for (res of data) {
            form.find('#warehouse').append(`<option value='${res.warehousecode}' ${generateAttr(res.warehousecode, '01', 'selected')}>${res.warehouselocation}</option>`)
        }
    } )

    resolver( floors, data => {
        for (res of data) {
            form.find('#floor').append(`<option value='${res.id}' ${generateAttr(res.id, floor, 'selected')}>${res.floor_name.titleCase()}</option>`)
        }
    } )

    resolver( product, data => {
        for (res of data) {
            form.find('#product').append(`<option value='${res.productid}' ${generateAttr(res.productid, productid, 'selected')}>${res.productname}</option>`)
        }
    } )

    return form
}

$(document).on( 'click', '.adjust', function() {
    let modal = $('#bsModal'),
    	data = $(this).parents('tr').data('json')

    modal.find('.modal-title').html(`<span class='text-info'>Stock Adjustment</span>`).addClass('m-0')
    modal.find('.modal-body').html(form(data ? data : {}))
    modal.modal({ backdrop: 'static' })
} )

$(document).on( 'submit', '.adjust-stock', function() {
    let data = {
        handler: `Store\\Movement@_save`,
        argument: {
            id: this['id'].value,
            type: this['type'].value,
            warehousecode: this['warehouse'].value,
            floor: this['floor'].value,
        	productid: this['product'].value,
        	bundles: this['bundles'].value,
            comment: this['comments'].value,
            date: this['date'].value,
        }
    }

    $.post( URL, { request: JSON.stringify(data) }, function(data) {
        if ( data === '1' || data === 'true' ) {
        	$('#bsModal').modal('hide')
            feedback({ message: 'Stock adjustment made', wrapper: WRAPPER, alert: 'success' })
            generateContent({ report, arg: '' })
        } else {
            feedback({ message: data, wrapper: WRAPPER, alert: 'danger' })
        }
    } )

    return false
} )

$(document).on( 'click', '.delete', function() {
    bbConfirm( `Are you sure you wish to delete entry?`, data => {
        if (data) {
            let payload = {
                handler: `Store\\Movement@_delete`,
                argument: $(this).data('value')
            }

            $.post( URL, { request: JSON.stringify(payload) }, function(data) {
                if ( data === '1' || data === 'true' ) {
                    $('#bsModal').modal('hide')
                    generateContent({ report, arg: '' })
                } else {
                    feedback({ message: data, wrapper: WRAPPER, alert: 'danger' })
                }
            } )
        }
    } )
} )
