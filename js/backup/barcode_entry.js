
var trigger = false,
	scanned = inputBarcode(),
	successScanned = [],
	current = ''

$('input.barcode')[0].focus()

function request (param) {
	let barcode = $(param).val()

	if ( barcode !== '' && ! scanned.includes(barcode) ) {
		$.get( 'app/route.php', { request: JSON.stringify({ handler: namespace, argument: barcode }) }, function(data) {
			let res = JSON.parse(data),
				row = $(param).parent('td').parent('tr'),
				field = $('td.value').data('field')
			
				if ( 'success' in res ) {
					let value = parseFloat(res.success[field])
					
					row.find('td.icon').html("<img src='images/green_icon.png' width='22' height='22' alt='Green' class='icon' />")
					row.find('td.productname').text(res.success.productname)
					row.find('td.value').text(value)

					successScanned.push({
						barcode: barcode,
						product: res.success.productname,
						[field]: value
					})
					inputFocus(param)
					$('#currentcount').text(successScanned.length)							
				} else {
					row.find('td.icon').html(`<span class="w3-tooltip"><img src='images/red_icon.png' width='22' height='22' alt='Green' class='icon' /> <span class="w3-text">${res.error}</span></span>`)
					inputFocus(param)
				}
		} )
	} else $(param).val(current)

	scanned = inputBarcode()
}

function success (form, button) {
	form.reset()
	button.attr('disabled', false)
	$('td.icon, td.value, td.productname, #currentcount').text('')				
	myAlert('Entry submitted successfully')
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


function inputFocus (param) {
	param
		.parent('td')
			.parent('tr')
				.next()
					.find('input.barcode')
						.focus()
}


function submitRequest (form, data) {
    let button = $(form['save'])

    button.attr('disabled', true)

    if ( successScanned.length > 0 ) {

        $.get( 'app/route.php', {request: JSON.stringify(data)}, function(data) {
            if ( data === '1' || data === 'true' ) {
                success(form, button)
            } else {
                myAlert('Oops, something went wrong! Entry not submitted', false)
                console.log(data)
            }
        } )

    } else {
        myAlert('No valid entry to save', false)
        button.attr('disabled', false)
    }
}



$(document).on( 'keypress', 'input.barcode', function(e) {
	if ( e.keyCode === 13) {
		trigger = true
		request($(this))
		e.preventDefault()
	}
} )

$(document).on( 'change', 'input.barcode', function(e) {
	if ( ! trigger )
		request($(this))
	else trigger = false
} )

$(document).on( 'focus', 'input.barcode', data => {
	current = $(data.currentTarget).val()
} )
