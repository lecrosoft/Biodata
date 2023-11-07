
var trigger = false,
	scanned = inputBarcode(),
	successScanned = [],
	current = ''

$('input.barcode')[0].focus()

function confirmAction(data, input) {
	const id = input.attr('id')
	const barcode = $(input).val()
	const scannedIndex = successScanned.findIndex(item => item.id === id)

	let row = $(input).parent('td').parent('tr'),
		productKey = $('td.productname').data('field') || 'productid',
		valueKey = $('td.value').data('field'),
		tdIcon = row.find('td.icon'),
		tdProduct = row.find('td.productname'),
		tdValue = row.find('td.value')				

		if ( 'success' in data ) {
			const obj = data.success, product = obj[productKey], value = parseFloat(obj[valueKey])

			tdIcon.html('<i class="fa fa-2x fa-check text-success" />')
			tdProduct.text(obj.productname)
			tdValue.text(value)

	        if (scannedIndex < 0) {
	            successScanned.push({ id, barcode, product, [valueKey]: value })
	        } else {
	            successScanned[scannedIndex].barcode = barcode
	            successScanned[scannedIndex].product = product
	            successScanned[scannedIndex][valueKey] = value
	        }

			inputFocus(input)							
		} else {
			tdIcon.html(`<i class="fa fa-2x fa-close text-danger pointer" data-toggle="tooltip" data-placement="right" title="${data.error}" />`)
            tdProduct.text('')
            tdValue.text('')

			$('[data-toggle="tooltip"]').tooltip();

			successScanned.splice(scannedIndex, 1);

			inputFocus(input)
		}
		
		$('#currentcount').text(successScanned.length || '')	
}

function confirmBarcode (input) {
	let barcode = $(input).val()

	if ( barcode !== '' && ! scanned.includes(barcode) ) {
		let requestBody = { request: JSON.stringify({ handler: scanHandler, argument: barcode }) }

		$.get( 'app/route.php', requestBody, function(response) {
			confirmAction(JSON.parse(response), input)
		} )
	} else {
		$(input).val(current)
	}

	scanned = inputBarcode()
}

function formHandler (form, data) {
    if ( successScanned.length > 0 ) {
    	$(form['save']).attr('disabled', true)

        $.get( 'app/route.php', {request: JSON.stringify(data)}, function(data) {
            if ( data === '1' || data === 'true' ) {
                success(form)
            } else {
                feedback({ message: 'Oops, something went wrong! Entry not submitted', className: 'fixed-top', alert: 'danger' })
            }
        } )
    } else {
        feedback({ message: 'No valid entry to save', className: 'fixed-top', alert: 'danger' })
    }
}

function success(form) {
	form.reset()
	// $(form['save']).attr('disabled', false)

	$('td.icon, td.value, td.productname, #currentcount').text('')	

	feedback({ message: 'Entry submitted successfully', className: 'fixed-top', alert: 'success' })

	successScanned = []
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

function inputFocus (input) {
	input
		.parent('td')
			.parent('tr')
				.next()
					.find('input.barcode')
						.focus()
}

$(document).on( 'keypress', 'input.barcode', function(e) {
	if ( e.keyCode === 13) {
		trigger = true
		confirmBarcode($(this))
		e.preventDefault()
	}
} )

$(document).on( 'change', 'input.barcode', function(e) {
	if ( ! trigger )
		confirmBarcode($(this))
	else trigger = false
} )

$(document).on( 'focus', 'input.barcode', data => {
	current = $(data.currentTarget).val()
} )
