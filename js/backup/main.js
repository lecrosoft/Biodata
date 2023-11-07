
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/*! =========================================================
 * Alert Method !*/

function myAlert( message, type = true, timeout = 2000 ) {
	let className = type ? 'w3-green' : 'w3-red',
		title = type ? 'Success' : 'Failure',
		view = $(`
			<div class="w3-panel ${className}">
			  <p>${message}.</p>
			</div>
		`)

		view.css( { width: '100%', borderRadius: '4px', position: 'absolute', padding: '5px 10px', fontSize: '15px' } )

		$('main.main-content').prepend(view)

    setTimeout( function() {
    	view.fadeOut('slow', () => view.remove())
    }, timeout);
}

function feedback( args ) {
	const param = $.extend( {
        message: null,
        alert: 'info',
        timeout: 2000,
        wrapper: 'body'
    }, args )

	$(param.wrapper).prepend(`<div class="alert alert-${param.alert}" role="alert" id="feedback">${param.message}</div>`)

    setTimeout( function() {
    	$('div.alert').fadeOut('slow', () => $('div.alert').remove())
    }, param.timeout);
}

function bbAlert(message, timeout = 5000) {
  bootbox.alert(message);
    setTimeout(function(){bootbox.hideAll();}, timeout);
}

/*! //End */

function bbConfirm (message, callback) {
	bootbox.confirm({
		message: message,
		callback: res => callback(res),
		buttons: {
			confirm: { label: 'Delete', className: 'btn-sm btn-success' },
			cancel: { className: 'd-none btn-danger' }
		}
	})
}


function parse_json (json) {
	try {
		return JSON.parse(json)
	} catch ( err ) {
		console.log(err, json)
	}
}


// to title case
String.prototype.titleCase = function()
{
    str = this.toLowerCase().split(' ')
    for (var i = 0; i < str.length; i++)
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)

    return str.join(' ')
}

// Bootstrap modal
function modal(args = {}) {
	const defaultParams = { header: true, footer: true, size: '' }

	param = $.extend( defaultParams, args )

	let content = `
        <div id='bsModal' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='gridModalLabel' aria-hidden='true'>
            <div class='modal-dialog ${param.size}' role='document'>
                <div class='modal-content'>
    `
	if (param.header) {
		content += `
			<div class='modal-header'>
				<h5 class='modal-title' id='gridModalLabel'>Modal</h5>
				<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
			</div>
	    `
	}

	content += "<div class='modal-body'></div>"

	if (param.footer) {
		content += `
			<div class='modal-footer'>
				<button type='button' class='btn btn-theme-secondary' data-dismiss='modal'>Close</button>
				<button type='submit' class='btn btn-secondary submit'>Submit</button>
			</div>
	    `
	}

    return content + '</div></div></div>'
}

// HTTP Request
function xhr(args = {}) {
	const $args = { data: {}, dataType: 'json', methodType: 'POST' }
	param = $.extend( $args, args )

    return $.ajax( {
        url : param.url,
        method : param.methodType,
        data: param.data,
        dataType : param.dataType,
        beforeSend: () => {
            if ( param.before && typeof(param.before) === "function" ) param.before()
        },
        progress: event => {
            if ( param.progress && typeof(param.progress) === "function" ) param.progress(event)
        }        
    } )
}

function resolver( promise, callback ) {
    promise.then(
        data => callback(data),
        error => console.log( 'something went wrong', error )
    )
}


// Hide Dropdown
function hideElements (container, btn) {
  $('body').on('mouseup', function(e) {
      if( !container.is(e.target) && container.has(e.target).length === 0 && !btn.is(e.target) && btn.has(e.target).length === 0 ) {
        container.hide()
      }     
  } )
}


// Clear Form
function clearForm ($form) {
    $form.find(':input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('')
    $form.find(':checkbox, :radio').prop('checked', false)
}


// Detect Form Changes
$(document).on( 'change', 'form.submit-disabled', function() {
    let button = $(this).find('button#submit')

    if (FormChanges(this).length)
		button.removeAttr('disabled')
	else
		button.attr('disabled', 'disabled')
})

function FormChanges(form) {

	// get form
	if (typeof form == "string") form = document.getElementById(form);
	if (!form || !form.nodeName || form.nodeName.toLowerCase() != "form") return null;

	// find changed elements
	var changed = [], n, c, def, o, ol, opt;
	for (var e = 0, el = form.elements.length; e < el; e++) {
		n = form.elements[e];
		c = false;

		switch (n.nodeName.toLowerCase()) {

			// select boxes
			case "select":
				def = 0;
				for (o = 0, ol = n.options.length; o < ol; o++) {
					opt = n.options[o];
					c = c || (opt.selected != opt.defaultSelected);
					if (opt.defaultSelected) def = o;
				}
				if (c && !n.multiple) c = (def != n.selectedIndex);
				break;

			// input / textarea
			case "textarea":
			case "input":

				switch (n.type.toLowerCase()) {
					case "checkbox":
					case "radio":
						// checkbox / radio
						c = (n.checked != n.defaultChecked);
						break;
					default:
						// standard values
						c = (n.value != n.defaultValue);
						break;
				}
				break;
		}

		if (c) changed.push(n);
	}

	return changed;

}


// Get Date
function today() {
	let m = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
	    d = new Date(),
	    day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()

	return `${d.getFullYear()}/${m[d.getMonth()]}/${day}`
}

// loader
function loaderComp(args = {}) {
	const param = $.extend( {height: '100%'}, args )
	let component = `
		<div class="d-flex justify-content-center align-items-center" id="loader" style="height: ${param.height}">
			<div class="spinner-grow text-info" role="status" style="width: 3rem; height: 3rem;">
				<span class="sr-only">Loading...</span>
			</div>
		</div>
	`

	return component
}

// Datefrom to Dateto Generator
function fromTo(from, to) {
	let f = from.split('/'),
		t = to.split('/')

		if (f[0] === t[0]) {
			if (f[1] === t[1]) {
				if (f[2] === t[2]) {
					date = `For ${t[2]} ${MONTH[parseInt(t[1] - 1)]}, ${t[0]}`
				} else {
					date = `From ${f[2]} To ${t[2]} ${MONTH[parseInt(t[1] - 1)]}, ${t[0]}`
				}
			} else {
				date = `From ${f[2]} ${MONTH[parseInt(f[1] - 1)]} To ${t[2]} ${MONTH[parseInt(t[1] - 1)]}, ${t[0]}`
			}
		} else {
			date = `From ${f[2]} ${MONTH[parseInt(f[1] - 1)]}, ${f[0]} To ${t[2]} ${MONTH[parseInt(t[1] - 1)]}, ${t[0]}`
		}

	return date
}


// Convert human-readable date to timestamp
function getTime(date) {
	let split = date.split('/'),
		nDate = `${split[1]}, ${split[2]}, ${split[0]}`;
	
	return Math.floor(new Date(nDate).getTime() / 1000);
}


// Generate Form Data
function formVal(val) {
	return ( val && typeof(val) !== 'undefined' ) ? val : ''
}


// HTML Attribute Generator
function generateAttr(x, y, attr) {
	return (x === y) ? attr : ''
}

// Create HTML Select Option
function createOption (text, val, select = null) {
	return `<option value='${val}' ${(text === select || val === select) ? 'selected' : ''}>${text}</option>`
}

// Bootstrap Datapicker Init
	// data-api instantiation:	data-provide="datepicker"
	// Data-attributes on the target element:	data-date-format="yyyy/mm/dd"

$.fn.datepicker.defaults.format = 'yyyy/mm/dd'
$.fn.datepicker.defaults.autoclose = true
$.fn.datepicker.defaults.endDate = 'today'
$.fn.datepicker.defaults.todayHighlight = true

function datePickr (input, args = {}) {
    const param = $.extend( {
        format: 'yyyy/mm/dd',
        autoclose: true,
        endDate: 'today',
        todayHighlight: true
    }, args )

    try {
    	$(input)
			.datepicker(param)
			.attr("autocomplete", "off")
			.attr("onkeydown", "return false")
    } catch (e) {}
}

function checker (input) {
	return input ? `checked` : null
}