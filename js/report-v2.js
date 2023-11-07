// store data
var searchdata = document.getElementById('searchdata').value,
    loader = $('.fa-spinner');

// set session variable
window.sessionStorage.searchdata = searchdata;
window.sessionStorage.refreshDuration = 60000;

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

// Auto request function

function autoRequest( time = 30000 ) {
    let searchdata = JSON.parse(sessionStorage.searchdata)

    setInterval( function() {
        $(loader).fadeIn(1000, function(){
            try {
                request(searchdata, true)
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

// open tab function
function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].classList.remove("current");
    }
    document.getElementById(tabName).classList.add("current"); 
}

// update variables
function varUpdate(searchdata) {

    sessionStorage.searchdata = JSON.stringify(searchdata); // store search data in browser

    // update content title
    let session_data = JSON.parse(document.getElementById('searchdata').value);

    if ( typeof(searchdata.request) !== 'undefined' && searchdata.request === 'daily' ) {
        var today = session_data.date, contentTitle;

        contentTitle = (searchdata.date === today) ? 'FOR TODAY' : 'FOR '+searchdata.date;
            printTitle = 'FOR '+searchdata.date;
    } else {
        var today = ( searchdata.date === undefined ) ? session_data.datefrom : session_data.date, contentTitle;
        
        if (searchdata.datefrom === searchdata.dateto) {
            contentTitle = (searchdata.datefrom === today) ? 'FOR TODAY' : 'FOR '+searchdata.datefrom;
            printTitle = 'FOR '+searchdata.datefrom;
        } else {
            contentTitle = 'FROM '+searchdata.datefrom+' TO '+searchdata.dateto;
                printTitle = 'FROM '+searchdata.datefrom+' TO '+searchdata.dateto;
        }

        contentTitle = ( searchdata.date === undefined ) ? contentTitle : `ON THE ${searchdata.date}`;
        contentTitle = (searchdata.date === today) ? 'FOR TODAY' : contentTitle;
        printTitle = ( searchdata.date === undefined ) ? printTitle : `ON THE ${searchdata.date}`;
    }

    if ( searchdata.request === 'monthlyCal' ) {
        var month = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'], monthfrom = month[parseInt(searchdata.monthfrom) - 1], monthto = month[parseInt(searchdata.monthto - 1)]

        if (monthfrom === monthto) {
            contentTitle = 'FOR '+monthfrom+', '+searchdata.year
            printTitle = 'FOR '+monthfrom+', '+searchdata.year
        } else {
            contentTitle = 'FROM '+monthfrom+' TO '+monthto+', '+searchdata.year
                printTitle = 'FROM '+monthfrom+' TO '+monthto+', '+searchdata.year
        }
    }

    $('p.content-title span').text(contentTitle);

    sessionStorage.contentTitle = printTitle; // store content title data in browser
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

// resizeable element function
function resize_divs(xpos)
{
    let $tablediv = $('.mmdiv1') ;
    let $graphdiv = $('.mmdiv2') ;
    let $divider = $('.div-divider.divider-horizontal') ;

    var percentage = xpos-16-8// (xpos / window.innerWidth) * 100; //-padding to both sides and a margin of 8px
    var percentage_left = window.innerWidth - xpos - 8 // 100-percentage // margin'';
    $tablediv.css('width',percentage+'px')
    $graphdiv.css('width',percentage_left+'px') ;
    $divider.css('left',(xpos-16-8)+'px'); // -8px padding

    if ( $.fn.dataTable.tables().length )
        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust()
}

// /* function script end

/* try {
    $('ul.accordion').pixiefyAccordion();
} catch ( err ) { console.log(err) } */

$(document).on('mouseup', function(e){
    if(!$('.shutter-panel-collapse').is(e.target) && $('.shutter-panel-collapse').has(e.target).length === 0 && !$('div.accordion-wrap').is(e.target) && $('div.accordion-wrap').has(e.target).length === 0 && !$('div.datepicker').is(e.target) && $('div.datepicker').has(e.target).length === 0){
        $('.shutter-panel-collapse').removeClass('show').slideUp(1000);
    }
})

$(document).ready( function() {

//    autoRequest(sessionStorage.refreshDuration) // Refresh page

    // Date Picker
    $('#datepaircontainer .date, .date').datepicker({
        format: 'yyyy/mm/dd',
        autoclose: true,
        endDate: 'today',
        todayHighlight: true
    }).attr("autocomplete", "off");

    // Multi Select
    try {
        $('select.search-feature').multipleSelect( { filter:true, single:true } )        
    } catch (err) { console.log(err) }    

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
    $(document).on('click', '.search-options', function(){
        if (! $(this).hasClass('disabled'))
            try {
                document.getElementById('myModal').style.display = 'block';
            } catch ( err ) { console.log(err) }
    })

    $(document).on('click', '.open-submit', function(){
        $('.hidden-submit').click();
    })

    // Tabs
    $(document).on('click', 'ul.tabs li.tab-link', function() {
        if (! $(this).hasClass('disabled')) {
            if ( ! $(this).hasClass('current') ) {
                var tab = $(this).attr('data-tab');
                    openTab(tab);

                let searchdata = JSON.parse(sessionStorage.searchdata);
                    searchdata.tab = tab;

                $('ul.tabs li.tab-link').removeClass('current');
                    $(this).addClass('current');

                try {
                    generateContent(searchdata);
                    varUpdate(searchdata);
                } catch (err) {
                    console.log(err)
                }
            }
        }
    })

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

});




// Resizable Element
try {
    $('div#mmdivWrapper').append("<div class='w3-row divider-overlay'></div> <div title='Drag &rArr; to Expand Report OR Drag &lArr; to Expand Graph' class='div-divider divider-horizontal w3-hide-small' style='display:none'></div>");

    $('.div-divider.divider-horizontal').css({'left':(Number($('.mmdiv1').innerWidth())-4)+'px','height':$('.mmdiv1').innerHeight()+'px'}).show();

    resize_divs($('.mmdiv1').innerWidth())

    $('.div-divider.divider-horizontal').mousedown(function(e){
        $('.divider-overlay').show();
    })

    $('.divider-overlay').mousemove(function(e){
        resize_divs(e.pageX)
    })

    $('.divider-overlay').mouseup(function(e){
        $('.divider-overlay').hide();
    })

    $(document).on('click', 'ul.tabs li.tab-link', function() {
        if ( ! $(this).hasClass('disabled') ) {
            if ($(this).attr('data-tab') === 'tab-1' || $(this).attr('data-tab') === 'tab-2')
                resize_divs(787);
            else
                resize_divs(1345);
        }
    })    
} catch ( err ) {
    console.log(err)
}

$(document).on('mouseup', '.divider-overlay', function() {
    if ( $.fn.dataTable.tables().length )
        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust()
})