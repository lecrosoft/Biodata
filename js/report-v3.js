
var clause = ''

const loader = $('.fa-spinner')

window.sessionStorage.cache

function pusher (input, str) {
    if ( input !== undefined && input !== 'all' && input !== '' )
        clause += (clause !== '') ? ' AND ' + str : '' + str
}

jQuery.fn.dataTable.Api.register( 'sum()', function ( ) { // sum records
    return accounting.formatNumber(this.flatten().reduce( function ( a, b ) {
        if ( typeof a === 'string' ) {
            a = a.replace(/[^\d.-]/g, '') * 1;
        }
        if ( typeof b === 'string' ) {
            b = b.replace(/[^\d.-]/g, '') * 1;
        }

        return a + b;
    }, 0 ));
} );


function ajaxRequest( url, data = {}, dataType = 'json', methodType = 'POST' ) {
    return $.ajax( {
        url : url,
        method : methodType,
        data: data,
        dataType : dataType
    } )
}


// Auto request function
function autoRequest( time = 30000 ) {
    let data = JSON.parse(sessionStorage.cache)

    setInterval( function() {
        $(loader).fadeIn(1000, function(){
            try {
                request(data, true)
            } catch ( err ) {
                console.log(err)
            }
        })
    }, time )
}

// toggle navigation function
function toggleNav (view) {
    if (view === 'show') {
        $('div.toggleNav i').removeClass('fa-angle-down').addClass('fa-angle-up');
            $('div.optionNav').slideDown(1000);
                $('div.toggleNav').attr('data-view', 'hide');
    } else {
        $('div.toggleNav i').removeClass('fa-angle-up').addClass('fa-angle-down');
            $('div.optionNav').slideUp(1000);
                $('div.toggleNav').attr('data-view', 'show');
    }
}


// Selectize Filter
function selectizeFilter (query, element, field, type='ASSOC') {
    if ($(element).length) {
        let selector = $(element).selectize()[0].selectize

        $.post( 'app/route.php', {request: JSON.stringify({ handler: `Helpers\\Selectize@options`, argument: {query, type} })}, function(data) {
            let json = JSON.parse(data),
                options = []

            for (let data of json) {
                if (typeof(field) === 'string')
                    options.push({value: data[field], text: data[field]})
                else
                    options.push({value: data[0], text: data[1]})
            }

            selector.clear()
            selector.clearOptions()
            selector.addOption(options)
            //selector.settings.placeholder = 'Select ' + element
            //selector.updatePlaceholder()
        } )
    }
}


// update variables
function varUpdate(param) {
    try {
        sessionStorage.cache = JSON.stringify(param);

        let searchdata = JSON.parse(sessionStorage.searchdata)

        if ( ! $('span.session-title').length ) {
            var month = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

            if (searchdata.datefrom === searchdata.dateto) {
                contentTitle = searchdata.datefrom === today() ? 'FOR TODAY' : 'FOR '+searchdata.datefrom;
                printTitle = 'FOR '+searchdata.datefrom;
            } else {
                contentTitle = 'FROM '+searchdata.datefrom+' TO '+searchdata.dateto;
                    printTitle = 'FROM '+searchdata.datefrom+' TO '+searchdata.dateto;
            }

            if ( searchdata.month !== undefined && searchdata.month !== undefined ) {
                contentTitle = `FOR ${month[parseInt(searchdata.month) - 1 ]}, ${searchdata.year}`
                    printTitle = `FOR ${month[parseInt(searchdata.month) - 1 ]}, ${searchdata.year}`
            }

            if ( searchdata.date !== undefined ) {
                contentTitle = searchdata.date === today() ? 'FOR TODAY' : `FOR ${searchdata.date}`
                    printTitle = `FOR ${searchdata.date}`
            }

            if ( searchdata.request === 'monthlyCal' ) {
                var monthfrom = month[parseInt(searchdata.monthfrom) - 1], monthto = month[parseInt(searchdata.monthto - 1)]

                if (monthfrom === monthto) {
                    contentTitle = 'FOR '+monthfrom+', '+searchdata.year
                    printTitle = 'FOR '+monthfrom+', '+searchdata.year
                } else {
                    contentTitle = 'FROM '+monthfrom+' TO '+monthto+', '+searchdata.year
                        printTitle = 'FROM '+monthfrom+' TO '+monthto+', '+searchdata.year
                }
            }

            $('p.content-title span').text(contentTitle)
        } else {
            $('p.content-title span.session-title').html(sessionStorage.title)
            printTitle = sessionStorage.title
        }

        sessionStorage.contentTitle = printTitle
    } catch (err) {console.error(err)}
}

// trigger datatables button action function
function triggerButton(datatable, className, closeId) {
    datatable.buttons(className).trigger();

    if (closeId === 1) {
        hidePlacard($('.placard'), $('button.tbloptions'));
    } else {
        $('.dt-buttons').remove();
    }
}

// close more action dialog box function
function closePlacard(container, btn) {
    $('body').on('mouseup', function(e) {
        if(!container.is(e.target) && container.has(e.target).length === 0 && !btn.is(e.target) && btn.has(e.target).length === 0){
            btn.attr('data-status', 'false');
            container.remove();
        }
    })
}

// hide more action dialog box function
function hidePlacard(className, btn) {
    btn.attr('data-status', 'false');
        className.remove();
}

(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);

// data graph function
function dataGraph(href)
{
    if ( typeof(href) === 'undefined' )
        throw('Missing parameter');

    $('#graphage').attr('src', href);
}

// /* function script end

$(document).on('mouseup', function(e) {
    let c = $('div.chart-container'),
        b = $('span.chart-ctrl');
      if ( !c.is(e.target) && c.has(e.target).length === 0 && !b.is(e.target) && b.has(e.target).length === 0 ) {
        c.removeClass('expanded');
      }
})

$(document).ready( function() {

    $('body').prepend(modal({footer: false}))

    // Date Picker Initialization
    try {
        $('#datepaircontainer .date, .date').datepicker({
            format: 'yyyy/mm/dd',
            autoclose: true,
            endDate: 'today',
            todayHighlight: true
        }).attr("autocomplete", "off").datepicker( 'setDate', 'now');

        $('#datepaircontainer').datepair({
            defaultDateDelta: null,
            defaultTimeDelta: null,
        });
    } catch (err) { console.error(err) }


    // Multi Select
    try {
        $('select.selectized').selectize()
    } catch (err) {}

    $(document).on('click', '.onoffswitch-label', function() {
        var checkbox = $('input.onoffswitch-checkbox').is(':checked'), calendarTotal = $('#calendarTotal'), tbody = $('#calendar table > tbody');
        if ( !checkbox ) {
            calendarTotal.addClass('max-width-more')
                tbody.css('max-height', '290px')
                    $('span#weight').css('display', 'block')
                        $('span#value').removeClass('off').addClass('on')
        } else {
            $('span#weight').css('display', 'none')
                calendarTotal.removeClass('max-width-more')
                    tbody.css('max-height', '320px')
                        $('span#value').removeClass('on').addClass('off')
        }
    })

    $(document).on('click', '.custom-print', function() {
        window.print();
    })

    // Search options
    $(document).on('click', '.search-options', function() {
        try {
            document.getElementById('myModal').style.display = 'block';
        } catch ( err ) { console.log(err) }
    })

    $(document).on('click', '.open-submit', function(){
        $('.hidden-submit').click();
    })

    // Report Navigation
    $(document).on( 'change', 'select.report-nav', function() {
        let data = JSON.parse(sessionStorage.cache),
            option = $(this).val()

        data.report = option

        try {
            generateContent(data)
        } catch (err) {
            console.log(err)
        }
    } )

    // Toggle Navigation
    $(document).on('click', 'div.toggleNav', function() {
        var view = $(this).attr('data-view');
            toggleNav(view);
    })

    $(document).on('click', 'button.tbloptions', function() {
        var status = $(this).attr('data-status'), parent = $(this).parent('#tbloptions');

        if (status === 'false') {
            $(this).attr('data-status', 'true');

            parent.append("<div class='placard'><ul><li name='.buttons-print'  data-close='1' class='dt-btn print-tbl'><span class='fa fa-print'></span> <label>Print</label></li> <li name='.buttons-excel'  data-close='1' class='dt-btn download-excel'><span class='fa fa-file-excel-o'></span> <label>Excel</label></li></ul></div>");
                    closePlacard($('.placard'), $('button.tbloptions'));
        } else {
            $(this).attr('data-status', 'false');
                $('.placard').remove();
        }
    })

    $(document).on( 'click', 'span.chart-ctrl', function() {
        let $this = $(this),
            container = $('div.chart-container');

        if ( ! $this.hasClass('disabled') ) {
            if ( ! container.hasClass('expanded') ) {
                    if (container.find('canvas').length === 0) {
                    $this.addClass('disabled');
                    let request = {
                        handler: `${FILE}@chart${$(this).data('report').split('-')[1]}`,
                        argument: $(this).data('arg')
                    }

                    $.get( URL, { request: JSON.stringify(request) }, data => {
                        try {
                            let def = {type: 'bar'},
                                resp = JSON.parse(data),
                                config = { ...def, ...resp };

                            container.html('<canvas id="chart"></canvas> <menu id="controls"><i class="fa fa-fw fa-print text-danger"></i></menu>');
                            const CHART = new gdsChart('chart');
                            var chartObj = CHART.render(config);
                            $this.removeClass('disabled');
                        } catch (err) {
                            container.html(`<h6 class="text-danger ml-3">${err}</h6>`);
                            $this.removeClass('disabled');
                        }
                    } )
                }
            }

            container.toggleClass('expanded');  
        }
    } )

});
