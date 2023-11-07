class Worker {

	constructor ()
	{
		this.content = $('#content, div.placeholder');
        this.loader = $('.fa-spinner');

        if ( 'date' in JSON.parse(sessionStorage.searchdata) )
            this.today = JSON.parse(sessionStorage.searchdata).date;
        else
            this.today = JSON.parse(sessionStorage.searchdata).datefrom;

        if ( $.fn.dataTable.tables().length )
            $.fn.dataTable.tables({ api: true }).destroy()
	}

    validateWrapper ( wrapper )
    {
        if ( typeof(wrapper) === 'undefined' )
            throw "Missing parameters";
        else if ( typeof(wrapper) !== 'string' )
            throw "String data type expected, "+typeof(wrapper)+' given';
        else if ( $('#'+wrapper).length === 0 )
            throw "Wrapper not found in document";                  
        else
            return wrapper        
    }

    tblfooter ( container, data ) {
        let wrapper = this.validateWrapper(container), table = $('#'+wrapper+' table');

        if ( ! $('#'+wrapper+' table tfoot').length )
            table.append(data);
    }

    tblfeatures ( container, userParams = false )
    {
        let wrapper = this.validateWrapper(container);       

        let table = $('#'+wrapper+' table'), tableName = table.attr('id'), title = $('.content-title').text(), btnTitle;

            title = title.replace("TODAY", this.today);

            tableName = ( typeof(tableName) === 'undefined' ) ? wrapper : tableName;
                btnTitle = ( title === '' ) ? tableName : title;

        let params =
            {
                buttons: [
                    {
                        extend: 'print',
                        title: btnTitle,
                        footer: true,
                        customize: function ( win ) {
                            $(win.document.body).find( 'table' ).addClass( 'printstyle' );
                                $(win.document.body).css('height', 'auto');
                        }
                    },

                    {
                        extend: 'excel',
                        title: btnTitle,
                        footer: true
                    }
                ]                                           
            }

        params = ( userParams ) ? $.extend( params, userParams ) : params

        var myTable = table.DataTable(params);

        $(document).on('click', '#'+wrapper+' .dt-btn', function() {
            myTable.buttons($(this).attr('name')).trigger()

            if ( parseInt($(this).attr('data-close')) === 1 )
                hidePlacard($('.placard'), $('button.tbloptions'));
            else
                $('.dt-buttons').remove();            
        })
    }

    tbloptions ( container ) {

        let wrapper = this.validateWrapper(container);

        $('#'+wrapper+' .dataTables_wrapper > div:first > div').removeClass('col-md-6').addClass('col-md-4');

        $('#'+wrapper+' .dataTables_wrapper > div:first').append("<div class='col-sm-12 col-md-3'><div id='DataTables_Table_0_filter' class='dataTables_filter'><button type='button' name='.buttons-print' class='btn w3-blue-grey dt-btn'>Print</button></div></div> <div class='col-sm-12 col-md-1 text-center'><span id='tbloptions'><button class='btn tbloptions' type='button' data-status='false'><span class='fa fa-ellipsis-v'></span></button></span></div>");      

        /*$(document).on('click', '#'+wrapper+' button.tbloptions', function(){
            var status = $(this).attr('data-status');

            if (status === 'false') {
                $(this).attr('data-status', 'true');

                $('#'+wrapper+' #tbloptions').append("<div class='placard'><ul><li name='.buttons-print'  data-close='1' class='dt-btn print-tbl'><span class='fa fa-print'></span> <label>Print</label></li> <li name='.buttons-excel'  data-close='1' class='dt-btn download-excel'><span class='fa fa-file-excel-o'></span> <label>Excel</label></li></ul></div>");
                        closePlacard($('#'+wrapper+' .placard'), $('#'+wrapper+' button.tbloptions'));
            } else {
                $(this).attr('data-status', 'false');
                    $('.placard').remove();
            }
        })*/

    }

    autoWidth ( property = 'undefined' )
    {

        let tbody = $('#calendar table > tbody'),
            cell = $('#calendar table > tbody > tr:nth-child(1) > td'),
            viewWidth = ( tbody.innerHeight() < 320 ) ? window.innerWidth - 16 : window.innerWidth - (17 + 16),
            less = 0, width;

            if ( property != 'undefined' ) {
                property.forEach(function(data) {
                    less += data.pixel
                })

                width = (viewWidth - less) / (cell.length - property.length)

                console.log(width)              
            } else {
                width = viewWidth / cell.length
            }

            $("#calendar table th, #calendar table td").css("width", width+"px")

            if ( property != 'undefined' ) {
                property.forEach(function(data) {
                    $("#calendar table th:nth-child("+data.key+"), #calendar table td:nth-child("+data.key+")").css("width", data.pixel+"px")
                })
            }
    
    }

    highlightBarcodeDuplicate (digit) {
        try {
            let table = $.fn.dataTable.tables({ api: true })
            let barcodes = table.columns( digit ).data()[ 0 ]
            let num = 0
            let duplicateRows = []
            
            table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
                var code = this.data()[ digit ]

                barcodes.forEach( function (barcode) {
                    if ( barcode === code )
                        num++
                } )

                if ( num > 1 ) {
                    duplicateRows.push(rowIdx)
                        $(this.node()).addClass('duplicate').attr('data-barcode', code)
                }

                num = 0
            } )
        } catch ( err ) {}
    }

}