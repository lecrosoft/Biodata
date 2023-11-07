
$('body').prepend(modal({footer: false, size: 'modal-lg'}))

const ROOT = document.getElementById("root")

setTimeout(() => {
    try {
        render()
    } catch (err) { console.log(err) }
}, 1000)

$(document).on( 'submit', 'form#order', function() {
    let rows = $('tr.filled'),
        details = [],
        $button = $('button#submit'),
        $method = $button.attr('data-method'),
        $orderid = $(this).attr('data-id')

    $('i.loader').fadeIn('slow')
    $button.attr('disabled', 'disabled')

    for (row of rows) {
        let p = JSON.parse($(row).find('.productname').val())
        details.push({
            item: $(row).data('item'),
            product: parseInt(p.id),
            quantity: parseInt($(row).find('#quantity').val()),
            foc: $(row).find('#foc').is(':checked') ? 1 : 0
        })
    }

    const req_data = {
        handler: `Sales\\Order@${$method}`,
        argument: {
            id: $orderid,
            number: this['number'].value.toUpperCase(),
            user: this['user'].value,
            customer: parseInt(this['customer'].value),
            company:this['company'].value,
            date: this['date'].value,
            details: details
        }
    }

    $.post ( 'app/route.php', {'request': JSON.stringify(req_data) }, function( data ) {
        if (data === 'true') {
            bbAlert(`Sales Order ${($orderid === 'null') ? 'placed' : 'modified'} successfully.`, 3000)
            render()
        } else {
            bbAlert(data)
            $('i.loader').fadeOut('slow')
            $button.removeAttr('disabled')            
        }
    } )

    return false
} )

$(document).on( 'click', 'i.fa-remove', function() {
    if ( $(this).attr('data-loaded') === 'false' ) {
        bbConfirm('Irrevocable action, do you want to continue?', response => {
            if (response) {
                let row = $(this).closest('tr')
                $.post ( 'app/route.php', {'request': JSON.stringify({ handler: 'Sales\\Order@remove', argument: $(this).attr('data-id') }) }, function( data ) {
                    if (data === 'true') {
                        row.remove()
                    } else {
                        bbAlert(data)
                    }
                } )
            }
        } )
    } else {
        bbAlert('Unabled to delete, delivery made for this order.', 2500)
    }
} )

$(document).on( 'change', 'select.productname', function() {
    let $row = $(this).parent('td').parent('tr'),
        $selected = $(this).find('option:selected'),
        $val = $(this).val(),
        $input = $row.find('td:eq(2)').find('input')

    $row.find('td:eq(0)').text($selected.attr('data-code'))
    if ($val === '') {
        $input.attr('required', false).val('')
        $row.removeAttr('class')
    } else {
        $input.attr('required', true)
        $row.attr('class', 'filled')
    }

    productValidation()
} )

$(document).on( 'click', 'button.order-form', function() { render() } )

$(document).on( 'click', 'button.order-list', function() {
    $('i.toggle').remove()

    let modal = $('#bsModal')

        modal.find('.modal-header').html(`<div class="col-lg-5"><h5 class='m-0 text-info'>Sales Order List</h5></div> <div class="col-lg-4"><input type="text" class="form-control form-control-sm order-date"></div> <div class="col-lg-2"><button type="submit" class="btn btn-sm btn-secondary order-search">Search</button></div><div class="col-lg-1"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>`)

        $('.order-date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).attr("autocomplete", "off").datepicker( 'setDate', 'now')

        orderList(modal.find('.modal-body'))
        modal.modal({ backdrop: 'static' })
} )

$(document).on( 'click', 'button.order-search', function() {
    orderList($('.modal-body'))
} )

$(document).on( 'change', 'input#foc, select.productname', function() {
    CheckDuplicates()
} )

$(document).on( 'change', 'input#number', function() {
    checkInvoice($(this).val())
} )

$(document).on( 'click', 'i.fa-edit', function() {
   let orderId = JSON.parse($(this).attr('data-order')).orderid;
   let order = xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Sales\\Order@getSalesOrderDetails', argument: orderId }) }, methodType: 'GET'})

   resolver( order, data => {
    // console.log(data[0]);
    render(data[0]);
     
   })

   // console.log(JSON.parse($(this).attr('data-order')));


   // render(JSON.parse($(this).attr('data-order')))
    $('#bsModal').modal('hide')
    $('span.min-max').html('<i class="fa fa-window-restore toggle"></i>')
} )

$(document).on( 'click', 'i.toggle', function() {
    $('#bsModal').modal({ backdrop: 'static' })
})

$(document).on( 'click', 'button.addrow', function() {
    let tbody = $('form#order table tbody'),
        products = JSON.parse(tbody.attr('data-product')),
        option = '<option data-code="" value="">Select product</option>'

    if (tbody.find('tr:not(.filled)').length === 0) {
        for (product of products)
            option += `<option data-code='${product.productcode}' value='${JSON.stringify({id: product.productid, code: product.productcode})}'>${product.productname.titleCase()}</option>`

        let row = $(`
            <tr>
                <td class="w-25"></td>
                <td><select name="productname" class="bg-light form-control form-control-sm mx-auto col-lg-11 productname select2">${option}</select></td>
                <td class="w-25"><input type="number" class="bg-light form-control form-control-sm col-lg-10 mx-auto" name="quantity" id="quantity" min="1"></td>
                <td><input type="checkbox" class="fancy" name="foc" id="foc" value="no"></td>
            </tr>
        `)
        tbody.append(row)
        selecter(row.find('select'))
        $('span.count-indicator i').text( parseInt($('span.count-indicator').text()) + 1 )
    }
} )

function productValidation() {
    let rows = document.getElementsByClassName('filled'),
        product = document.getElementsByClassName("productname")[0]

    if (rows.length === 0) {
        product.setCustomValidity("Please add product(s) to form to place order.")
    } else {
        product.setCustomValidity('')
    }
}

function checkDupl() {
    const rows = $('tr.filled')

    for (let x = 0; x < rows.length; x++) {
        for (let y = x + 1; y < rows.length; y++) {
            let x_join = $(rows[x]).find('td:eq(1)').find('.productname').val() +  $(rows[x]).find('td:eq(3)').find('#foc').is(':checked')

            let y_join = $(rows[y]).find('td:eq(1)').find('.productname').val() +  $(rows[y]).find('td:eq(3)').find('#foc').is(':checked')

            if (x_join === y_join) {
                document.getElementById("submit").setCustomValidity("Please remove duplicate entry from form to place order.")
            } else {
                document.getElementById("submit").setCustomValidity('')
            }
        }
    }
}

function CheckDuplicates() {
    var values = [],
        element = document.getElementById("submit")

    $(".duplicate").removeClass("duplicate")
    var $selects = $('select.productname')

    $selects.each( function() {   //Loop through the selects
        var v = this.value
        if (!v) return true //If no value, skip this input

        var $val = this.value + $(this).parents('tr').find('#foc').is(':checked')

        //If this value is a duplicate, get all inputs from our list that
        //have this value, and mark them ALL as duplicates
        if (values.includes($val)) $selects.filter(function() { return this.value + $(this).parents('tr').find('#foc').is(':checked') == $val }).addClass("duplicate")

        values.push($val)
    } )

    if ($(".duplicate").length) element.setCustomValidity('Please remove duplicate entry from form to place order.')
    else element.setCustomValidity('')
}

function checkInvoice (number) {
    $.post ( 'app/route.php', {'request': JSON.stringify({ handler: `Sales\\Order@check`, argument: number }) }, function( data ) {
        if (data === 'false') {
            document.getElementById("number").setCustomValidity('')
        } else {
            document.getElementById("number").setCustomValidity("Sales Order already exists.")
        }
    } )
}

function orderList (el) {
    el.css( { height: '500px', overflowY: 'auto' } ).html(loaderComp())

    let date = $('.order-date').val(),
        table = $(`
            <table class="table table-sm table-bordered table-striped" id="orderList">
                <thead>
                    <tr>
                        <th scope="col">Order #</th>
                        <th scope="col">Order Date</th>
                        <th scope="col">Warehouse</th>
                        <th scope="col">Customer Name</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody></tbody>
            </table>
        `)

    let order = xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Sales\\Order@orderList', argument: date }) }, methodType: 'GET'})
    
    
    
    resolver( order, data => {
        for (res of data) {
            table.find('tbody').append(`<tr><td>${res.orderid}</td> <td>${res.dateoforder}</td> <td>${res.warehouselocation}</td> <td>${res.customername}</td> <td><div class=""><i class="fa fa-edit text-info float-left" data-order='${JSON.stringify(res)}'></i> <i class="fa fa-remove text-danger float-right" data-loaded='${res.dateofloading}' data-id='${res.orderid}'></i></div></td></tr>`)
        }

        el.html(table)
        $('#orderList').DataTable({ lengthChange: false, sort: false })
    } )

   
}

function salesOrder(param = null) {
    console.log('param',param)
    let product = xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Product\\Factory@all', argument: '' }) }, methodType: 'GET'}),
        customer = xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Sales\\Customer@all', argument: '' }) }, methodType: 'GET'}),
        user = xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Sales\\User@all', argument: '' }) }, methodType: 'GET'}),
        warehouse = xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Store\\Warehouse@all', argument: '' }) }, methodType: 'GET'})
        company = xhr({url: 'app/route.php', data: {request: JSON.stringify({handler: 'Sales\\Order@getCompanyDetails',argument: ''})}, methodType: 'GET'})
    let $order = (param) ? `value="${param.orderid}"` : '',
        $count = (param) ? param.details.length : 8,
        $button  = (param) ? "<button type='button' class='btn btn-info order-form'>Go back!</button>" : "<button type='button' class='btn btn-info order-list'>Sales Order</button>",
        $unable = (param) ? param.dateofloading : false

    let container = $(`<div id="container">
        <div class="row bg-dark">
            <div class="col-sm-12 my-2">
                ${$button}
            </div>
        </div>

        <div class="card mt-3">
            <div class="card-body">
                <form class="submit-disabled" id="order" data-id="${(param) ? param.orderid : null}">
                    <div class="form-row">
                        <div class="form-group col-md-4 col-lg-2">
                            <label for="number">Order Number</label>
                            <input type="text" class="bg-light form-control form-control-sm col-lg-11" name="number" id="number" autocomplete="off" ${$order} required ${($unable) ? 'readonly' : ''}>
                        </div>

                        <div class="form-group col-md-4 col-lg-2">
                            <label for="user">User</label>
                            <select name="user" id="user" class="bg-light form-control form-control-sm col-lg-11" required></select>
                        </div>

                        

                        <div class="form-group col-md-7 col-lg-4">
                            <label for="customer">Customer Name</label>
                            <select name="customer" id="customer" class="bg-light form-control form-control-sm col-lg-11 select2" required ${($unable) ? 'disabled' : ''}>
                                <option value="">Select customer</option>
                            </select>
                        </div>

                        <div class="form-group col-md-5 col-lg-2">
                            <label for="date">Date of Order</label>
                            <input type="text" class="bg-light form-control form-control-sm" name="date" id="date" value="${(param) ? param.dateoforder : today()}" required>
                        </div>
                        <div class="form-group col-md-5 col-lg-2">
                            <label for="customer">Company</label>
                            <select name="company" id="company" class="bg-light form-control form-control-sm col-lg-11 select2" required ${($unable) ? 'disabled' : ''}>
                                <option value="">Select company</option>
                            </select>
                           
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-sm table-bordered text-center">
                            <thead>
                                <tr>
                                    <th scope="col">Product Code</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">FOC <span title="Tick if Free of Charge" data-toggle="tooltip" data-placement="top">?</span></th>
                                </tr>
                            </thead>

                            <tbody></tbody>
                        </table>
                    </div>

                    <button type="submit" class="btn btn-primary" id="submit" data-method="${(param) ? 'modify' : 'save'}" disabled>Save order <i class="fa fa-spin fa-spinner text-warning ml-1 loader" style="display: none;"></i></button>
                    <button type="button" class="btn addrow mx-2"><span class="fa fa-plus text-success"></span></button>
                    <span class="font-weight-bold count-indicator"><i>${$count}</i> rows</span>
                </form>
            </div>
        </div>
    </div>`)

    for ( let i = 0; i <= $count - 1; i++ ) {
        let $qty = (param) ? `value="${param.details[i].quantityordered}"` : '',
            $checked = (param && param.details[i].foc === '1') ? 'checked' : '',
            $code = (param) ? param.details[i].productcode : '',
            item = (param) ? param.details[i].id : '',
            $disabled = ( param && param.details[i].delivery ) ? 'disabled' : ''
            minQty = ( param && param.details[i].delivery ) ? param.details[i].delivery : 1

        container.find('tbody').append(`
            <tr ${(param) ? `class="filled" data-item="${item}"` : ''}>
                <td class="w-25">${$code}</td>
                <td>
                    <select name="productname" class="bg-light form-control form-control-sm mx-auto col-lg-11 productname select2" ${$disabled}>
                        <option data-code="" value="">Select product</option>
                    </select>
                </td>
                <td class="w-25"><input type="number" class="bg-light form-control form-control-sm col-lg-10 mx-auto" name="quantity" id="quantity" min="${minQty}" ${$qty}></td>
                <td><input type="checkbox" class="fancy" name="foc" id="foc" value="no" ${$checked} ${$disabled}></td>
            </tr>
        `)
    }

    resolver( user, data => {
        for (res of data) {
            container.find('#user').append(`<option value='${res}'>${res}</option>`)
        }
    } )

    resolver( warehouse, data => {
        for (res of data) {
                let $selected = (param && param.warehouselocation === res.warehouselocation) ? 'selected' : 'Abuja'
                console.log($selected)
            container.find('#location').append(`<option value='${res.warehousecode}' ${$selected}>${res.warehouselocation}</option>`)
        }
    } )

    resolver( customer, data => {
        for (res of data) {
            let $selected = (param && param.customername === res.customername) ? 'selected' : ''
            container.find('#customer').append(`<option value='${res.id}' ${$selected}>${res.customername}</option>`)
        }
    } )

    resolver( company, data => {
        
        for (res of data) {
            let $selected = (param && param.company_name === res.company_name) ? 'selected' : ''
            container.find('#company').append(`<option value='${res.id}' ${$selected}>${res.company_name}</option>`)
        }
    } )

    resolver( product, data => {
        container.find('tbody').attr('data-product', JSON.stringify(data))

        for ( let i = 0; i <= $count - 1; i++ ) {
            for (res of data) {
                let $selected = (param && param.details[i].productid === res.productid) ? 'selected' : ''
                $(container.find('.productname')[i]).append(`<option data-code='${res.productcode}' value='${JSON.stringify({id: res.productid, code: res.productcode})}' ${$selected}>${res.productname.titleCase()}</option>`)
            }
        }

        productValidation()
    } )

    return container
}

function render (data = null) {
    const date = (! data || data.dateofloading === null) ? 'today' : data.dateofloading
    try {
        $(ROOT).html(salesOrder(data))
        datePickr('input#date', {endDate: date})
        $('div#container').fadeIn('slow')
        $('select.select2').select2({ theme: "bootstrap4" })

        if (! data) {
            document.getElementById("order").reportValidity()
        }
    } catch (err) {
        console.log(err)
    }
}
