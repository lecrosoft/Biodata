"use strict"

const imageTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon"
];

$(document).on( 'click', '.close-preview', () => {
    $('.popover-preview').popover('hide')  
	
	$('.popover-preview').hover(
		() => $('.popover-preview').popover('show'),
		() => $('.popover-preview').popover('hide')
	)
} )

$(document).on( 'click', '.close-hidden-preview', () => {
    $('.hidden-preview').hide('slow')  
    
    $('.popover-preview').hover(
        () => $('.hidden-preview').show('slow'),
        () => $('.hidden-preview').hide('slow')
    )
} )

$(document).on( 'change', '.preview-input input:file', function () {
    let file = this.files[0], reader = new FileReader()

    typeCheck(this)
    reader.onload = e => previewImage({ name: file.name, type: file.type, data: e.target.result })
    reader.readAsDataURL(file)
} )

$(document).on( 'click', '.preview-clear', () => {
    $('.popover-preview').attr('data-content', '').popover('hide')
    $('.hidden-preview').hide('slow').find('.card-body').html('')
    $('.preview-filename').val('')
    $('.preview-clear').hide()
    $(".preview-input-title").text('Browse') 

    let input = $('.preview-input input:file').val('').attr('required', true)
    input[0].setCustomValidity('')

} )

function previewImage(file) {
    const { name, type, data } = file

    $(".preview-input-title").text("Change")
    $(".preview-clear").show()
    $(".preview-filename").val(name)
    $('.file-holder').val(data)

    if ( imageTypes.includes(type) ) {
        $('.hidden-preview').hide('slow').find('.card-body').html('')
        $(".popover-preview").attr( "data-content", `<img src="${data}" />` ).popover("show")
    } else {
        $('.popover-preview').attr('data-content', '').popover('hide')
        $('.hidden-preview .card-body').html(`<object data="${data}" width="250" height="200"></object>`)
        $('.hidden-preview').show('slow')
    }
}

function typeCheck(input) {
    let file = input.files[0],
        accept = input.accept.replace(/ /g, '').split(',.'),
        ext = file.name.split('.').pop(),
        allow = ( accept.includes(ext) || (accept.includes('image/*') && imageTypes.includes(file.type) ) )

    input.setCustomValidity( allow ? '' : 'Uploaded file not allowed' )
}

function popoverSetup() {
    let title = `
        <strong>Preview</strong>
        <span class="float-right pointer close-preview"><i class="fa fa-times"></i></span>
    `
    
    $('.popover-preview').after(`
        <div class="card hidden-preview position-absolute" style="width: 250px; top: 41px; right: 0; z-index: 10; display: none;">
            <div class="card-header p-2">
                <strong>Preview</strong>
                <span class="float-right pointer close-hidden-preview"><i class="fa fa-times"></i></span>
            </div>
            <div class="card-body p-2" />
        </div>
    `)

    $('.popover-preview').popover({ trigger: 'manual', html: true, title, content: "There's no file", placement: 'bottom' })
}

$(() => popoverSetup())