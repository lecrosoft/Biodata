
history.replaceState( { view: 'products' }, 'Products' ) // replace current state of location

const WRAPPER = 'div#wrapper',
      FILE = 'Report\\Product\\QC',
      URL = 'app/route.php'

var hash = window.location.hash,
    page = hash === '' ? 'products' : hash.replace('#', '')

$('.' + page).addClass('active')
generateView(page)

hideElements($('.bs-sidebar'), $('.mini-submenu'))

$(document).on( 'click', '.mini-submenu', function() {
    $('.bs-sidebar').toggle()
} )


$(document).on( 'click', '.hide-submenu', function() {
    $('.bs-sidebar').hide()
} )


$(document).on( 'click', '.bs-sidebar a', function(e) {
    if ( ! $(this).hasClass('active') ) {
        $('.bs-sidebar a').removeClass('active')
        $(this).addClass('active')

        let url = $(this).attr('href'),
            href = url.split('#')

        if ( href.length < 2 )
            href.push('products')

        generateView(href[1])
        history.pushState( { view: href[1] }, '', url )
    }

    e.preventDefault()
} )

$(window).on('popstate', function(e) {
    let view = e.originalEvent.state.view
    generateView(view)
    $('.bs-sidebar a').removeClass('active')
    $('.bs-sidebar a.'+view).addClass('active')      
})



$(document).on( 'submit', 'form#revision', function() {
    $.post( 'app/route.php', { request: JSON.stringify({ handler: `Product\\Quality@revised`, argument: $(this).serializeArray() }) }, function(data) {
        if ( data === '1' || data === 'true' ) {
            feedback({ message: 'Revision saved!', wrapper: WRAPPER, alert: 'success' })
            generateView('revision')
        } else {
            feedback({ message: data, wrapper: WRAPPER, alert: 'danger' })
        }
    } )

    return false
} )

$(document).on( 'click', 'i.trash-tool', function() {
    let $this = $(this),
        $method = $this.data('method'),
        data = { handler: `Product\\Quality@${$method}`, argument: $this.data('id') },
        response = $method === 'undoDelete' ? 'Product Restored' : 'Product Deleted'

    $.post( 'app/route.php', { request: JSON.stringify(data) }, function(data) {
        let $wrap = '.trash.hero-callout',
            $tbody = $this.parents('tbody')

        if ( data === '1' || data === 'true' ) {
            $this.parents('tr').remove()
            feedback({ message: `${response}!`, wrapper: $wrap, alert: 'success' })
            $('.badge.trash').text(parseInt($('.badge.trash').text()) - 1)
            if ( $method === 'undoDelete' ) customAddEvent()
            setTimeout(function() {
                if ( $tbody.find('tr').length === 0 ) $($wrap).html('<h6 class="text-info">No record found!</h6>')
            }, 1000);
        } else {
            feedback({ message: data, wrapper: $wrap, alert: 'danger' })
        }
    } )
} )

$(document).on( 'change', 'select#revision', function() {
    specs(JSON.parse($(this).val()))
} )

$(document).on( 'change', 'select.evt-product-code', function() {
    let product = $(this).val().split('|')
    $(this).parents('tr').find('#productname').val(product[2])

    let modal = $('#bsModal')

    modal.find('.modal-dialog').attr('style', 'max-width: 300px !important')
    modal.find('.modal-title').text('Copy previous revision?').addClass('m-0')
    modal.find('.modal-body').addClass('row').html(`
        <div class="col-sm-9">
            <input type="number" class="form-control form-control-sm copyrevnumber" data-product="${product[0]}" placeholder="Revision number" step="0.01">
        </div>

        <div class="col-sm-3">
            <button type="submit" class="btn btn-sm" id="copybtn" disabled>Copy</button>
        </div>
    `)
    modal.modal({ backdrop: 'static' })
} )

$(document).on( 'click', 'button#copybtn', function() {
    let data = $(this).data('rev'),
        form = $('form#revision'),
        sheet = data.sheetwidth.split(':')

    delete data.revdate
    delete data.imagepath
    delete data.productid
    delete data.revnumber
    delete data.timestamp
    delete data.productcode
    delete data.productname
    delete data.sheetwidth

    data.sheetwidthmin = sheet[0]
    data.sheetwidthmid = sheet[1]
    data.sheetwidthmax = sheet[2]

    Object.keys(data).forEach(function(k) {
        $(`#${k}`).val(data[k])
    } )

    $('#bsModal').modal('hide')
} )

$(document).on( 'change', 'input.copyrevnumber', function() {
    let options = {
        url: 'app/route.php',
        methodType: 'GET',
        data: {
            request: JSON.stringify({
                handler: 'Product\\Quality@singleRevision',
                argument: {
                    productid: $(this).data('product'),
                    number: parseInt($(this).val())                     
                }               
            })
        }
    }

    resolver( xhr(options), rev => {
        let btn = $('#copybtn')
        if (rev) {
            btn.removeClass('btn-danger').addClass('btn-success').removeAttr('disabled').attr('data-rev', JSON.stringify(rev))
        } else {
            btn.removeClass('btn-success').addClass('btn-danger').attr('disabled', 'disabled')
        }
    } )    
} )

$(document).on( 'click', 'i.view-specs', function() {
    let modal = $('#bsModal'),
        modalBody = modal.find('.modal-body'),
        data = $(this).parents('tr').data('json')

        modal.find('.modal-header').html(`<div class="col-lg-6"><h5 class='my-0 text-info'>${data.productname}</h5></div> <div class="col-lg-5"><i class="fa fa-print print-specs pointer" title="Print Specs"></i></div> <div class="col-lg-1"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>`)

        modalBody.html("<div class='replaceable' />")
        specs(data)

        /* resolver( xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Product\\Quality@revision', argument: data.productid }) }, methodType: 'GET'}), rev => {
            if ( rev.length > 0 ) {
                modalBody.append(`<div class="row"><label for="revision" class="col-sm-1 col-form-label">Revision</label><div class="col-sm-3"><select class="form-control form-control-sm" id="revision"><option value='${JSON.stringify(data)}'>Current</option></select></div></div>`)
                for (res of rev) {
                    modalBody.find('select#revision').append(createOption(res.revnumber, JSON.stringify(res)))
                }
            }           
        } ) */

    modal.modal({ backdrop: 'static' })
} )

function generateView (view) {
    switch (view) {
        case 'revision':
            revisionView()
            break;
        case 'trash':
            trashView()
            break;                
        default:
            generateContent({ report: 'option-1', arg: "WHERE `is_deleted` = 0" })
    }

    $('.bs-sidebar').hide()
}

function revisionView () {
    $('div.placeholder').html(myform({})).addClass('mb-3 d-none')

    myDropzoneFunc('fileUpload')

    let form = $('div.placeholder').find('form').attr('id', 'revision')
    $(form.find('table tr')[3]).append(`<td>
        <div class="row">
            <div class="col-sm-6"><label>REVISION NUMBER</label> <input type="number" name="revnumber" class="form-control form-control-sm" id="revnumber" step="0.01" required></div>
            <div class="col-sm-6"><label>REVISION DATE</label> <input type="text" name="revdate" class="form-control form-control-sm" id="revdate" required></div>        
        </div>
    </td>`)
    form.find('input[type=hidden]').remove()
    datePickr(form.find('#revdate'))

    resolver( xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Product\\Factory@all', argument: 'productcode' }) }, methodType: 'GET'}), product => {
            let $select = $('<select name="productcode" class="form-control form-control-sm evt-product-code" id="productcode" required><option value="">Select Product Code</option></select>')
            for (res of product)
                $select.append( createOption( res.productcode, `${res.productid}|${res.productcode}|${res.productname}` ) )

        form.find('#productcode').parent('td').append($select)
        form.find('#productcode').remove()
        $('div.placeholder').removeClass('d-none')

        $('select.evt-product-code').select2({ theme: "bootstrap4" })         
    } )
}

function trashView () {
    $('div.placeholder').html(`<div class="trash hero-callout" style="height: 500px; overflow: auto;"><h6 class="text-info">No record found!</h6></div>`)

    let table = $(`
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Product Code</th>
                        <th>Product Name</th>
                        <th>Product Group</th>
                        <th>Revision</th>
                        <th>Tools</th>
                    </tr>
                </thead>

                <tbody></tbody>
            </table>
        `)

    resolver( xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Product\\Quality@trashed', argument: '' }) }, methodType: 'GET'}), product => {
        if ( product.length ) {
            for ( res of product )
                table.find('tbody').append(`<tr><td>${res.productcode}</td> <td>${res.productname}</td> <td>${res.productgroup}</td> <td>${res.revnumber}</td> <td><i class="trash-tool fa fa-undo text-success pull-left" data-method="undoDelete" data-id="${res.productid}"></i> <i class="trash-tool fa fa-remove text-danger pull-right mr-3" data-method="hardDelete" data-id="${res.productid}"></i></td></tr>`)

                $('.trash.hero-callout').html(table)            
        }    
    } )
}

function specs (data) {

    $('div.replaceable').html(`
        <table class="table table-bordered specs">
            <tr>
                <td style="width: 200px;"><label>REVISION NUMBER</label> <span class="revision">${data.revnumber}</span></td>
                <td><label>REVISION DATE</label> <span>${data.revdate}</span></td>
                <td><label>PRODUCT CODE</label> <span>${data.productcode}</span></td>
                <td><label>PRODUCT NAME</label> <span>${data.productname}</span></td>                
            </tr>

            <tr>
                <td><label>PRODUCT GROUP</label> <span>${data.productgroup}</span></td>
                <td><label>PRODUCT GRADE</label> <span>${data.productgrade}</span></td>
                <td><label>PRODUCTION MACHINE</label> <span>${data.mach}</span></td>
                <td><label>NUMBER OF PLY</label> <span>${data.ply}</span></td>
            </tr>

            <tr>
                <td><label>EMBOSSING</label> <span>${data.embossing}</span></td>
                <td><label>HARDROLL GRADE TYPE</label> <span>${data.basepaper}</span></td>
                <td><label>HARDROLL SOURCE</label> <span>${data.hardrollsource}</span></td>
                <td><label>LAM/EDGE</label> <span>${data.lamedge}</span></td>
            </tr>

            <tr>
                <td><label>ROLLS PER PACK</label> <span>${data.productrolls}</span></td>
                <td><label>PACKS PER BUNDLES</label> <span>${data.productpacks}</span></td>
                <td><label>ROLLS PER BUNDLE</label> <span>${data.rollsperbundle}</span></td>
                <td><label>BUNDLES PER PALETTE</label> <span>${data.productbundles}</span></td>
            </tr>

            <tr class="bg-secondary text-white">
                <td colspan="4">WEIGHTS & MEASUREMENTS</td>
            </tr>

            <tr>
                <td><label>LOG WEIGHT (g)</label> <span>${data.logweight}</span></td>
                <td><label>ROLL/CLIP WEIGHT (g)</label> <span>${data.clipweight}</span></td>
                <td><label>CORE WEIGHT (g)</label> <span>${data.coreweight}</span></td>
                <td><label>ACTUAL ROLL WEIGHT (g)</label> <span>${data.actualrollweight}</span></td>
            </tr>

            <tr>
                <td><label>ROLL DIAMETER (cm)</label> <span>${data.diameter}</span></td>
                <td><label>PERIMETER (cm)</label> <span>${data.perimeter}</span></td>
                <td><label>CORE DIAMETER (cm)</label> <span>${data.corediameter}</span></td>
                <td><label>SHEET WIDTH (cm)</label> <span>${data.sheetwidth}</span></td>
            </tr>

            <tr>
                <td><label>WRAPPER WEIGHT (g)</label> <span>${data.wrapperweight}</span></td>
                <td><label>POLYBAG WEIGHT (g)</label> <span>${data.polybagweight}</span></td>
                <td><label>POLYBUNDLE WEIGHT (g)</label> <span>${data.polybundleweight}</span></td>
                <td><label>SHEET LENGTH (cm)</label> <span>${data.sheetlength}</span></td>
            </tr>

            <tr>
                <td><label>GSM (g/m<sup>2</sup>)</label> <span>${data.gsm}</span></td>
                <td><label>PULLS</label> <span>${data.pulls}</span></td>
                <td><label>SHEET COUNTS</label> <span>${data.sheetcounts}</span></td>
                <td><label>ROLL LENGTH (m)</label> <span>${data.rolllength}</span></td>
            </tr>

            <tr>
                <td><label>HARDROLL WIDTH (cm)</label> <span>${data.hardrollwidth}</span></td>
                <td><label>GROSS WEIGHT(g)</label> <span>${data.grossweight}</span></td>
                <td><label>NET WEIGHT (g) (Tissue Only)</label> <span>${data.netweight}</span></td>
                <td><a data-fancybox="gallery" href="big_1.jpg"><img src="" alt="${data.productname}"></a></td>
            </tr>                                                                
        </table>
    `)

    resolver( getImage(data.imagepath), image => {
        $('table.specs td img').attr('src', image).css('max-height', '100px')
        $('table.specs td a').attr('href', image)

        $('[data-fancybox]').fancybox({
            protect: true
        });            
    } )

    resolver( xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Product\\Quality@revision', argument: data.productid }) }, methodType: 'GET'}), rev => {
        if ( rev.length > 0 ) {
            let $select = $(`<select id="revision"></select>`).css({ width: 'inherit', margin: 'auto', border: 'none' })

            for (res of rev)
                $select.append( createOption( res.revnumber, JSON.stringify(res), data.revnumber ) )

            $('span.revision').html($select)
        }           
    } )

}

function getImage (path) {
    return xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Product\\Quality@imageToBase64', argument: path }) }, methodType: 'GET', dataType: 'text'})
}

function deleteEntries (data) {
    return {'id': data.productid, product: data.productname, 'image': data.imagepath, 'revision': data.revnumber}
} 

function myform (data) {
    let grades = ['N/A', 'Economy', 'Premium'],
        lamedge = ['N/A', 'Edge', 'Lam', 'Plain Lam', 'Coloured Lam'],
        groups = ['Aluminium Foil', 'Diapers', 'Facial', 'Medical Roll', 'Napkin', 'Special Order', 'Toilet', 'Toilet Jumbo', 'Towel', 'Unwrapped', 'Waste Bag'],
        hardroll = xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Factory\\Jumboreel\\HardRoll@all', argument: '' }) }, methodType: 'GET'}),
        machine = xhr({url: 'app/route.php', data: { request: JSON.stringify({ handler: 'Factory\\Project@all', argument: '' }) }, methodType: 'GET'})

    data.new = jQuery.isEmptyObject(data)
    data.sheetwidth = ( data.new ) ? ['', '', ''] : data.sheetwidth.split(':')
        
    let form = $(`
            <form class="submit-disabled">
                <input type="hidden" name="productid" id="productid" value="${formVal(data.productid)}">
                <input type="hidden" name="revnumber" id="revnumber" value="${formVal(data.revnumber)}">
                <input type="hidden" name="revision" id="revision" value='${JSON.stringify(data)}'>

                <table class="table table-bordered specs">
                    <tr>
                        <td><label>PRODUCT CODE</label>  <input type="text" name="productcode" class="form-control form-control-sm" id="productcode" value="${formVal(data.productcode)}" required></td>
                        <td><label>PRODUCT NAME</label> <input type="text" name="productname" class="form-control form-control-sm" id="productname" value="${formVal(data.productname)}" required></td>
                        <td>
                            <label>PRODUCT GROUP</label>
                            <select name="productgroup" class="form-control form-control-sm" id="productgroup" required>
                                <option value="">Select Product Group</option>
                            </select>                            
                        </td>
                        <td>
                            <label>PRODUCTION MACHINE</label>
                            <select name="mach" class="form-control form-control-sm" id="mach">
                                <option value="">Select Machine</option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td><label>EMBOSSING</label> <input type="text" name="embossing" class="form-control form-control-sm" id="embossing" value="${formVal(data.embossing)}" required></td>
                        <td>
                            <label>PRODUCT GRADE</label>
                            <select name="productgrade" class="form-control form-control-sm" id="productgrade" required>
                                <option value="">Select Product Grade</option>
                            </select>                            
                        </td>
                        <td>
                            <label>LAM/EDGE</label>
                            <select name="lamedge" class="form-control form-control-sm" id="lamedge" required>
                                <option value="">Select Lam/Edge</option>
                            </select>                            
                        </td>
                        <td><label>NUMBER OF PLY</label> <input type="number" name="ply" class="form-control form-control-sm" id="ply" value="${formVal(data.ply)}" step="0.01" required></td>
                    </tr>

                    <tr>
                        <td>
                            <label>HARDROLL GRADE TYPE</label>
                            <select name="basepaper" class="form-control form-control-sm" id="basepaper">
                                <option value="">Select Grade Type</option>
                            </select>                            
                        </td>
                        <td><label>HARDROLL SOURCE</label> <input type="text" name="hardrollsource" class="form-control form-control-sm" id="hardrollsource" value="${formVal(data.hardrollsource)}"></td>
                        <td><label>HARDROLL WIDTH (cm)</label> <input type="text" name="hardrollwidth" class="form-control form-control-sm" id="hardrollwidth" value="${formVal(data.hardrollwidth)}"></td>
                        <td><label>ROLLS PER PACK</label> <input type="text" name="productrolls" class="form-control form-control-sm" id="productrolls" value="${formVal(data.productrolls)}" required></td>
                    </tr>

                    <tr>
                        <td><label>PACKS PER BUNDLES</label> <input type="text" name="productpacks" class="form-control form-control-sm" id="productpacks" value="${formVal(data.productpacks)}" required></td>
                        <td><label>ROLLS PER BUNDLE</label> <input type="text" name="rollsperbundle" class="form-control form-control-sm" id="rollsperbundle" value="${formVal(data.rollsperbundle)}" readonly></td>
                        <td><label>BUNDLES PER PALETTE</label> <input type="text" name="productbundles" class="form-control form-control-sm" id="productbundles" value="${formVal(data.productbundles)}" required></td>
                    </tr>

                    <tr class="bg-secondary text-white">
                        <td colspan="4">WEIGHTS & MEASUREMENTS</td>
                    </tr>

                    <tr>
                        <td><label>LOG WEIGHT (g)</label> <input type="text" name="logweight" class="form-control form-control-sm" id="logweight" value="${formVal(data.logweight)}" required></td>
                        <td><label>ROLL/CLIP WEIGHT (g)</label> <input type="text" name="clipweight" class="form-control form-control-sm" id="clipweight" value="${formVal(data.clipweight)}" required></td>
                        <td><label>CORE WEIGHT (g)</label> <input type="text" name="coreweight" class="form-control form-control-sm" id="coreweight" value="${formVal(data.coreweight)}" required></td>
                        <td><label>ACTUAL ROLL WEIGHT (g)</label> <input type="text" name="actualrollweight" class="form-control form-control-sm" id="actualrollweight" value="${formVal(data.actualrollweight)}" readonly></td>                        
                    </tr>

                    <tr>
                        <td><label>ROLL DIAMETER (cm)</label> <input type="text" name="diameter" class="form-control form-control-sm" id="diameter" value="${formVal(data.diameter)}" required></td>
                        <td><label>PERIMETER (cm)</label> <input type="text" name="perimeter" class="form-control form-control-sm" id="perimeter" value="${formVal(data.perimeter)}" required></td>
                        <td><label>CORE DIAMETER (cm)</label> <input type="text" name="corediameter" class="form-control form-control-sm" id="corediameter" value="${formVal(data.corediameter)}" required></td>
                        <td style="width: 330px;">
                            <label>SHEET WIDTH (cm)</label>
                            <div class="row">
                                <div class="col-sm-4"><input type="number" name="sheetwidthmin" class="form-control form-control-sm" id="sheetwidthmin" value="${data.sheetwidth[0]}" placeholder="min" step="0.01" required></div>
                                <div class="col-sm-4"><input type="number" name="sheetwidthmid" class="form-control form-control-sm" id="sheetwidthmid" value="${data.sheetwidth[1]}" placeholder="mid" step="0.01" required></div>
                                <div class="col-sm-4"><input type="number" name="sheetwidthmax" class="form-control form-control-sm" id="sheetwidthmax" value="${data.sheetwidth[2]}" placeholder="max" step="0.01" required></div>        
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td><label>WRAPPER WEIGHT (g)</label> <input type="text" name="wrapperweight" class="form-control form-control-sm" id="wrapperweight" value="${formVal(data.wrapperweight)}" required></td>
                        <td><label>POLYBAG WEIGHT (g)</label> <input type="text" name="polybagweight" class="form-control form-control-sm" id="polybagweight" value="${formVal(data.polybagweight)}" required></td>
                        <td><label>POLYBUNDLE WEIGHT (g)</label> <input type="text" name="polybundleweight" class="form-control form-control-sm" id="polybundleweight" value="${formVal(data.polybundleweight)}" required></td>
                        <td><label>SHEET LENGTH (cm)</label> <input type="text" name="sheetlength" class="form-control form-control-sm" id="sheetlength" value="${formVal(data.sheetlength)}" required></td>
                    </tr>

                    <tr>
                        <td><label>GSM (g/m<sup>2</sup>)</label> <input type="text" name="gsm" class="form-control form-control-sm" id="gsm" value="${formVal(data.gsm)}" required></td>
                        <td><label>PULLS</label> <input type="text" name="pulls" class="form-control form-control-sm" id="pulls" value="${formVal(data.pulls)}" required></td>
                        <td><label>SHEET COUNTS</label> <input type="text" name="sheetcounts" class="form-control form-control-sm" id="sheetcounts" value="${formVal(data.sheetcounts)}" readonly></td>
                        <td><label>ROLL LENGTH (m)</label> <input type="text" name="rolllength" class="form-control form-control-sm" id="rolllength" value="${formVal(data.rolllength)}" required></td>
                    </tr>

                    <tr>
                        <td><label>GROSS WEIGHT(g)</label> <input type="text" name="grossweight" class="form-control form-control-sm" id="grossweight" value="${formVal(data.grossweight)}" readonly></td>
                        <td><label>NET WEIGHT (g) (Tissue Only)</label> <input type="text" name="netweight" class="form-control form-control-sm" id="netweight" value="${formVal(data.netweight)}" readonly></td>
                        <td colspan="2">
                            <input type="text" class="form-control form-control-sm d-none" name="file" id="file"/>
                            <div class="dropzone dropzone-file-area" id="fileUpload">
                                <div class="dz-default dz-message">
                                    <h3>Drop files here to upload</h3>
                                    <span class="text-info">(You can also click to open file browser)</span>
                                </div>
                            </div>
                        </td>
                    </tr>                                                                
                </table>

                <hr/>
                <button type="submit" class="btn btn-primary" id="submit" disabled>Save</button>
            </form>
        `)

        for (res of lamedge) {
            form.find('#lamedge').append(createOption(res, res, data.lamedge))
        }

        for (res of grades) {
            form.find('#productgrade').append(createOption(res, res, data.productgrade))
        }

        for (res of groups) {
            form.find('#productgroup').append(createOption(res, res, data.productgroup))
        }

        resolver( hardroll, jumboreels => {
            for (res of jumboreels) {
                form.find('#basepaper').append(createOption(res.gradetype, res.gradetype, data.basepaper))
            }
        } )

        resolver( machine, projects => {
            for (res of projects) {
                form.find('#mach').append(createOption(res.project, res.project, data.mach))
            }
        } )

        if ( ! data.new ) {
            resolver( getImage(data.imagepath), image => {
                //console.log(image)          
            } )        
        }

    return form
}

function myDropzoneFunc (id) {
    let form = $('form.submit-disabled')
    var myDropzone = new Dropzone( `#${id}`, 
        {
            url: 'upload.php',
            addRemoveLinks: true,
            dictRemoveFile: 'Delete',
            maxFiles: 1,
            maxFilesize: 2,
            acceptedFiles: 'image/*',

            accept: function(file, done) {
                let fileReader = new FileReader()

                fileReader.readAsDataURL(file);
                fileReader.onloadend = function() {
                    $('input#file').val(fileReader.result)
                    form.trigger('change')

                    file.previewElement.classList.add("dz-success")
                }
                file.previewElement.classList.add("dz-complete")

                
    // console.log(this, this.files.length)
    // this.removeAllFiles();
    // this.addFile(file);


            },

            removedfile: file => {
                file.previewElement.remove()
                $('input#file').val('')
                form.trigger('change')
            },

            error: (file, response) => {
                file.previewElement.classList.add("dz-error")
                console.log(response)
            }
        }
    )    
}


function dtForm(data = null, callback) {
    let modal = $('#bsModal'),
        form = myform(data)

    modal.find('.modal-title').text(`${data.new ? 'Add' : 'Modify'} Product`).addClass('m-0')
    modal.find('.modal-body').html(form)
    modal.modal({ backdrop: 'static' })
    
    myDropzoneFunc('fileUpload')

    if (callback instanceof Function) callback({ form: form, function: 'formAction', modal: modal })
}

function formAction(form, callback) {
    let data = {
        handler: `Product\\Quality@save`,
        argument: $(form).serializeArray()
    }

    if (callback instanceof Function) callback(data)
}

function customAddEvent($val = 1) {
    let product = $('.badge.product')
    product.text(parseInt(product.text()) + $val)
}

function customDeleteEvent($val = 1) {
    let trash = $('.badge.trash')
    trash.text(parseInt(trash.text()) + $val)
    customAddEvent(-$val)
}


// Set fields value programmatically ****************************** //
$(document).on( 'change', '#productrolls, #productpacks, #clipweight, #coreweight, #pulls, #ply, #actualrollweight, #rollsperbundle, #netweight, #wrapperweight, #polybagweight, #polybundleweight', function() {
    let id = $(this).attr('id')

    if ( id === 'actualrollweight' || id === 'rollsperbundle' ) setNet()

    if ( id === 'pulls' || id === 'ply' ) setSheet()

    if ( id === 'productrolls' || id === 'productpacks' ) setBundleRolls()

    if ( id === 'clipweight' || id === 'coreweight' ) setActualRoll()

    if ( id === 'netweight' || id === 'wrapperweight' || id === 'rollsperbundle' || id === 'productpacks' || id === 'polybagweight' || id === 'polybundleweight' ) setGross()

} )

function inputVal (input) {
    let $val = parseFloat($(input).val())
    return isNaN($val) ? 0 : $val
}

function setNet () {
    let calc = inputVal('#actualrollweight') * inputVal('#rollsperbundle')
    if (calc > 0) $('#netweight').val(calc).trigger('change')
}

function setGross () {
    let calc = inputVal('#netweight') + (inputVal('#wrapperweight') * inputVal('#rollsperbundle')) + (inputVal('#productpacks') * inputVal('#polybagweight')) + inputVal('#polybundleweight')
    if (calc > 0) $('#grossweight').val(calc)
}

function setSheet () {
    let calc = inputVal('#pulls') * inputVal('#ply')
    if (calc > 0) $('#sheetcounts').val(calc)
}

function setBundleRolls () {
    let calc = inputVal('#productrolls') * inputVal('#productpacks')
    if (calc > 0) $('#rollsperbundle').val(calc).trigger('change')
}

function setActualRoll () {
    let calc = inputVal('#clipweight') - inputVal('#coreweight')
    if (calc > 0) $('#actualrollweight').val(calc).trigger('change')
}

// \Set fields value programmatically ****************************** //
