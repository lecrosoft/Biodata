(function addXhrProgressEvent($) {
    var originalXhr = $.ajaxSettings.xhr;
    $.ajaxSetup({
        xhr: function() {
            var req = originalXhr(), that = this;
            if (req) {
                if (typeof req.addEventListener == "function" && that.progress !== undefined) {
                    req.addEventListener("progress", function(evt) {
                        that.progress(evt);
                    }, false);
                }
                if (typeof req.upload == "object" && that.progressUpload !== undefined) {
                    req.upload.addEventListener("progress", function(evt) {
                        that.progressUpload(evt);
                    }, false);
                }
            }
            return req;
        }
    });
})(jQuery);


function modal() {
    return `
        <div id='bsModal' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='gridModalLabel' aria-hidden='true'>
            <div class='modal-dialog' role='document'>
                <div class='modal-content'>
                    <div class='modal-header'>
                        <h5 class='modal-title' id='gridModalLabel'>Modal</h5>
                        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                    </div>

                    <div class='modal-body'>
                        <div class='container-fluid'>
                            <div class='row'>
                                <div class='col-lg-12'>
                                    <div class='modal-placeholder'></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class='modal-footer'>
                        <button type='button' class='btn btn-theme-secondary' data-dismiss='modal'>Close</button>
                        <div class='btn-placeholder'>
                            <button type='submit' class='btn btn-secondary submit'>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}


function utilizePromise( promise, callback ) {
    try {
        promise.then(
            data => callback(data), error => console.log( 'Oops, something went wrong.', error )
        )
    } catch ( err ) { console.log(err) }
}

function updateProgress (oEvent) {
    if (oEvent.lengthComputable) {
        var percentComplete = oEvent.loaded / oEvent.total * 100;
        console.log(oEvent, percentComplete)
    } else console.log('Unable to compute progress information since the total size is unknown')
}

function ajaxCall( before, progress, url, data = {}, dataType = 'json', methodType = 'POST' ) {
    return $.ajax( {
        url : url,
        method : methodType,
        data: data,
        dataType : dataType,
        beforeSend: () => {
            if ( before && typeof(before) === "function" ) before()
        },
        progress: event => {
            if ( progress && typeof(progress) === "function" ) progress(event)
        }
    } )
}

function generateContent( req_data, graph = false ) {
    $('.evt').addClass('disabled')

    if ( typeof(req_data) === 'undefined' ) throw "Missing parameters";

    try { varUpdate(req_data) } catch (err) { console.log(err) }

    const loader = $( '<div />', {class: 'processing card'} ).text('Processing...'),
          container = $('div#'+req_data.tab),
          myTable = new myDataTable(`#${req_data.tab}`),
          http = ajaxCall( data => container.append(loader), event => updateProgress(event), req_data.url, { searchdata: JSON.stringify(req_data) }, 'html' )

    let options =
        {
            scrollY: '50vh',
            scrollCollapse: true,
            pageLength:  10,
            aLengthMenu: [10, 15, 20, 25, 50],
            drawCallback: function () {
                function calculate (object, key) {
                    return ( isNaN(object.api().column( key ).data()[0]) ) ? object.api().column( key, {search: 'applied'}).data().count() : object.api().column( key, {search: 'applied'}).data().sum()
                }

                let lastColkey = this.api().columns()[0].length - 1
                let behindLastKey = lastColkey - 1

                if ( this.api().column().footer() !== null ) {
                    if ($(this.api().column( behindLastKey ).footer()).text() !== 'Total')
                        this.api().column( behindLastKey ).footer().innerHTML = calculate(this, behindLastKey)

                    this.api().column( lastColkey ).footer().innerHTML = calculate(this, lastColkey)
                }
            }
        }

    if ( req_data.tab === 'tab-3' || req_data.tab === 'tab-4' ) {
        delete options.drawCallback
        options.bSort = false
        options.info = false
        //options.paging = false
        options.searching = false
        options.scrollX = true
        options.scroller = { rowHeight: 30 }
        options.fixedColumns = { leftColumns: 1, rightColumns: 1 }
    }

    if ( req_data.tab === 'tab-4' ) options.fixedColumns = { leftColumns: 2 }

    if ( req_data.tab === 'tab-1' && req_data.editor ) options.select = { style: 'multi' }

    utilizePromise( http, data => {
        container.find('div.placeholder').html(data).css('opacity', 1)

        myTable.datatable(options)

        if ( req_data.tab !== 'tab-1' || ! req_data.editor )
            myTable.customFeatures()

        loader.fadeOut(2000, () => {
            loader.remove()
            $('.evt').removeClass('disabled')
        } )

        if ( req_data.tab === 'tab-1' && req_data.editor ) {
            fetch('app/user/level.php')
                .then(
                    data => data.text()
                    .then(
                        data => {
                            myTable.editor(data)
                        }
                    ),
                    error => console.log(error)
                )
        }
    } )

    if (graph) dataGraph(req_data.graph_url, req_data.datefrom, req_data.dateto) // update data graph
}

function dataGraph( url, from, to ) {
    if ( url != false ) $('#graphage').attr('src', url+'&period='+from+'-'+to+'');
}

function generateOption( req_data, callback ) {
    $.get( 'connections/get_select_data.php', {data: JSON.stringify(req_data)}, function(json_data) {
        let data = JSON.parse(json_data),
            options = data.length > 1 ? `<option value="all">${req_data.title}</option>` : ''

            data.forEach(res => options += `<option value="${res}">${res}</option>`)

            callback(options)
    } )
}
