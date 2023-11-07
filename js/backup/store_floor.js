
const WRAPPER = 'div#wrapper',
      FILE = 'Report\\Store\\Floor',
      URL = 'app/route.php'

generateContent({ report: 'option-1', arg: '' })

$(document).on( 'click', 'i.fa-exchange', function() {
    let modal = $('#bsModal'),
    	data = $(this).parents('tr').data('json'),
    	form = $(`
            <form class="submit-disabled transfer">
                <input type="hidden" name="id" id="id" value="${formVal(data.product_id)}">

                <div class="form-group row">
                    <label for="from" class="col-sm-4 col-form-label">From</label>
                    <div class="col-sm-8">
                        <select name="from" class="form-control form-control-sm" id="from" required>
                            <option value="">Select floor</option>
                        </select>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="to" class="col-sm-4 col-form-label">To</label>
                    <div class="col-sm-8">
                        <select name="to" class="form-control form-control-sm" id="to" required></select>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="bundles" class="col-sm-4 col-form-label">Bundles</label>
                    <div class="col-sm-8">
                        <input type="number" name="bundles" class="form-control form-control-sm" id="bundles" min="1" readonly>
                    </div>
                </div>

                <hr/>
                <button type="submit" class="btn btn-primary" id="submit" disabled>Transfer</button>
            </form>
        `)

    resolver( xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Store\\Floor@floorBundles', argument: data.product_id }) }, methodType: 'GET'}), results => {
        for (res of results)
        	form.find('#from').append(`<option value='${JSON.stringify({ floor_id: res.floor_id, bundles: res.bundles })}'>${res.floor_name.titleCase()}</option>`)
    } )

    modal.find('.modal-title').html(`<span class='text-danger'>Transfer</span> ${formVal(data.productname)}`).addClass('m-0')
    modal.find('.modal-body').html(form)
    modal.modal({ backdrop: 'static' })
} )

$(document).on( 'change', 'select#from', function() {
	let $val = $(this).val(),
		$input = $('input#bundles')

	if ( $val !== '' ) {
		let data = JSON.parse($val)

	    resolver( xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Store\\Floor@floor', argument: parseInt(data.floor_id) }) }, methodType: 'GET'}), results => {
	    	let $options = '<option value="">Select floor</option>'
	        for (res of results)
	        	$options += `<option value='${res.id}'>${res.floor_name.titleCase()}</option>`
	        
	        $('select#to').html($options)
	    } )

		$input.attr('readonly', false).attr('max',  parseInt(data.bundles)).attr('required', true)
	} else {
		$input.attr('readonly', true)
	}
} )

$(document).on( 'submit', 'form.transfer', function() {
    let data = {
        handler: `Store\\Floor@transfer`,
        argument: {
        	product: this['id'].value,
        	from: JSON.parse(this['from'].value).floor_id,
        	to: this['to'].value,
        	bundles: this['bundles'].value
        }
    }

    $.post( 'app/route.php', { request: JSON.stringify(data) }, function(data) {
        if ( data === '1' || data === 'true' ) {
        	$('#bsModal').modal('hide')
            feedback({ message: 'Transfer done successfully!', wrapper: WRAPPER, alert: 'success' })
            generateContent({ report: 'option-1', arg: '' })
        } else {
            feedback({ message: data, wrapper: WRAPPER, alert: 'danger' })
        }
    } )

    return false
} )
