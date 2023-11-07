
function utilizePromise( promise, callback ) {
    promise.then(
        data => callback(data),
        error => console.log( 'something went wrong', error )
    )
}

function server ( url = '', dataType = 'text', method = 'GET', data = undefined ) {
    const mimetypes = {
        css: "text/css",
        html: "text/html",
        json: "application/json",
        javascript: "text/javascript",
        text: "text/plain"
    }

    return fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        //mode: "cors", // no-cors, cors, *same-origin
        //cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": mimetypes[dataType],
        },
        //redirect: "follow", // manual, *follow, error
        //referrer: "no-referrer", // no-referrer, *client
        body: data, // body data type must match "Content-Type" header
    })
    .then(response => dataType === 'json' ? response.json() : response.text())
    .catch(error => console.error(error));
}

function ajaxCall( before, progress, url, data = {}, dataType = 'json', methodType = 'GET' ) {
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
    $('.evt').attr('disabled', true)

    if ( typeof(req_data) === 'undefined' ) throw "Missing parameters";

    try { varUpdate(req_data) } catch (err) { console.log(err) }

    let request = {
        handler: `${FILE}@${req_data.report.replace('-', '')}`,
        argument: req_data.arg
    }

    const loader = $( '<div />', {class: 'processing card'} ).text('Processing...'),
          container = $(WRAPPER),
          http = ajaxCall( () => container.append(loader), event => updateProgress(event), URL, { request: JSON.stringify(request) }, 'html' )

    let options =
        {
            scrollCollapse: true,
            pageLength:  10,
            aLengthMenu: [10, 15, 20, 25, 50],
            drawCallback: function () {
                let keys = $(this.api().table().container()).find('table').data('options').sum
                
                function calculate (object, key) {
                    return ( isNaN(object.api().column( key ).data()[0]) ) ? object.api().column( key, {search: 'applied'}).data().count() : object.api().column( key, {search: 'applied'}).data().sum()
                }

                if ( this.api().column().footer() !== null ) {
                    if (keys !== undefined && typeof(keys) === 'object') {
                        for (key of keys)
                            this.api().column(key).footer().innerHTML = calculate(this, key)
                    } else {
                        let lastColkey = this.api().columns()[0].length - 1,
                            behindLastKey = lastColkey - 1

                            if ($(this.api().column( behindLastKey ).footer()).text() !== 'Total')
                                this.api().column( behindLastKey ).footer().innerHTML = calculate(this, behindLastKey)

                            this.api().column( lastColkey ).footer().innerHTML = calculate(this, lastColkey)
                    }
                }
            }
        }

    if ( req_data.report === 'option-3' || req_data.report === 'option-4' ) {
        delete options.drawCallback
        options.bSort = false
        options.info = false
        options.searching = false
    }

    utilizePromise( http, data => {
        try {
            container.find('div.placeholder').html(data).css('opacity', 1)

            if (container.find('div.placeholder').find('table').length)
                new myDataTable(WRAPPER).datatable(options)

            loader.fadeOut(2000, () => {
                loader.remove()
                $('.evt').attr('disabled', false)
            } )
        } catch (error) {
            console.error(error)
        }


    } )

    if (graph) {
        let data = JSON.parse(sessionStorage.searchdata)
        dataGraph(data.graph_url, data.datefrom, data.dateto)
    }
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
