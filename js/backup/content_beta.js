
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

function generateContent( req_data, callback ) {
    $('.evt').attr('disabled', true)

    if ( typeof(req_data) === 'undefined' ) throw "Missing parameters";

    try { varUpdate(req_data) } catch (err) { console.log(err) }

    let request = {
        handler: `${FILE}@${req_data.report.replace('-', '')}`,
        argument: req_data.arg
    }

    let ajaxOptions = {
        url: URL,
        methodType: 'GET',
        data: { request: JSON.stringify(request) },
        dataType: 'HTML',    
        before: () => container.append(loader),
        progress: event => updateProgress(event)        
    }

    const loader = $( '<div />', {class: 'processing card'} ).text('Processing...'),
          container = $(WRAPPER),
          http = xhr(ajaxOptions)

    let options =
        {
            scrollCollapse: true,
            pageLength:  10,
            aLengthMenu: [10, 15, 20, 25, 50],
            drawCallback: function () {
                const options = $(this.api().table().container()).find('table').data('options')
                
                function calculate (object, key) {
                    let number = parseInt( object.api().column( key ).data()[0].replace(',', '') )
                    
                    return ( isNaN(number) ) ? object.api().column( key, {search: 'applied'}).data().count() : object.api().column( key, {search: 'applied'}).data().sum()
                }

                if ( this.api().column().footer() !== null ) {
                    if (options.sum !== undefined && typeof(options.sum) === 'object') {
                        for ( key of options.sum )
                            this.api().column(key).footer().innerHTML = calculate(this, key)
                    } else {
                        let lastColkey = this.api().columns()[0].length - 1,
                            behindLastKey = lastColkey - 1

                            if ($(this.api().column( behindLastKey ).footer()).text() !== 'Total')
                                this.api().column( behindLastKey ).footer().innerHTML = calculate(this, behindLastKey)

                            this.api().column( lastColkey ).footer().innerHTML = calculate(this, lastColkey)
                    }
                }

                // Code for footer Average row if exist
                if (options.avg !== undefined && typeof(options.avg) === 'object') {
                    for ( k of options.avg ) {
                        let total = $( `tr:eq(0) td:eq(${k})`, this.api().table().footer() )[0].innerHTML,
                            count = this.api().table().rows().columns().data()[k].filter( val => val !== '0' ).length,
                            average = parseInt(total.replace(/,/g, '')) / count

                        $( `tr:eq(1) td:eq(${k})`, this.api().table().footer() )[0].innerHTML = accounting.formatNumber( Math.round(average) )
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

            if (container.find('div.placeholder').find('table').length) {
                var table = new myDataTable(WRAPPER).datatable(options)
                
                let tableOpts = $('div.dataTables_wrapper').find('table').data('options')
                
                if (tableOpts && tableOpts.chart !== undefined && tableOpts.chart) {
                    $('div.dataTables_wrapper').append(`<span class="evt chart-ctrl border rounded-circle p-1 bg-white text-info" data-arg="${req_data.arg}" data-report="${req_data.report}"><i class="fa fa-fw fa-line-chart"></i></span> <div class="chart-container bg-light"></div>`)           
                }                
            }

            if ( callback === undefined, typeof(callback) === "function" )
                callback(table ? table.rows().count() : 0)

            loader.fadeOut(2000, () => {
                loader.remove()
                $('.evt').attr('disabled', false)
            } )
        } catch (error) {
            console.error(error)
        }


    } )

}


function generateOption ( req_data, callback ) {
    $.get( 'connections/get_select_data.php', {data: JSON.stringify(req_data)}, function(json_data) {
        let data = JSON.parse(json_data),
            options = data.length > 1 ? `<option value="all">${req_data.title}</option>` : ''

            data.forEach(res => options += `<option value="${res}">${res}</option>`)

            callback(options)
    } )
}
