class myDataTable {

	constructor ( wrapper )
	{
		this.container = validateParam(wrapper);
        this.today = ( 'date' in JSON.parse(sessionStorage.searchdata) ) ? JSON.parse(sessionStorage.searchdata).date : this.today = JSON.parse(sessionStorage.searchdata).datefrom;

        if ( $.fn.dataTable.tables().length )
            $.fn.dataTable.tables({ api: true }).destroy()                        
	}

    datatable ( params = false )
    {
        let table = $(this.container+' table'),
            contentTitle = $('.content-title').text().replace("TODAY", this.today),
            tableName = ( typeof(table.attr('name')) === 'undefined' ) ? this.container : table.attr('name');
            
        const tableTitle = ( contentTitle === '' ) ? tableName : contentTitle;

        let defaultParams =
            {
                processing: true,

                buttons: [
                    {
                        extend: 'print',
                        title: tableTitle,
                        footer: true,
                        customize: function ( win ) {
                            $(win.document.body).find( 'table' ).addClass( 'printstyle' );
                                $(win.document.body).css('height', 'auto');
                        }
                    },

                    {
                        extend: 'excel',
                        title: tableTitle,
                        footer: true
                    }
                ]                                           
            }

        if ( params ) {
            if ( 'buttons' in params ) {
                params.buttons[0] = $.extend( params.buttons[0], defaultParams.buttons[0] )
                params.buttons[1] = $.extend( params.buttons[1], defaultParams.buttons[1] )
            }

            params = ( params ) ? $.extend( defaultParams, params ) : defaultParams
        } else params = defaultParams

        var myTable = table.DataTable(params);

        $(document).on('click', this.container+' .dt-btn', function() {
            myTable.buttons($(this).attr('name')).trigger()

            if ( parseInt($(this).attr('data-close')) === 1 )
                hidePlacard($('.placard'), $('button.customfeatures'));
            else
                $('.dt-buttons').remove();            
        })
    }

    customFeatures ()
    {

        // Check if Insert button already exist, if exist delete
        if ( typeof( $('#insertTO') ) !== 'undefined' )
            $('#insertTO').remove()

        let customElmt = "<div class='col-sm-12 col-md-3'><div id='DataTables_Table_0_filter' class='dataTables_filter'> </div></div> <div class='col-sm-12 col-md-1 text-center'><span id='tbloptions'><button class='btn tbloptions' type='button' data-status='false'><span class='fa fa-ellipsis-v'></span></button></span></div>"

        $(this.container+' .dataTables_wrapper > div:first > div').removeClass('col-md-6').addClass('col-md-4')

        $(this.container+' .dataTables_wrapper > div:first').append(customElmt)

        if( $(this.container+' .dataTables_wrapper > div:first').length === 0 ) {
            let row = $($(this.container+' .dataTables_wrapper').closest('div').children()[0])
            
            for ( let i = 0; i < row.children().length; i++ ) {
                $(row.children()[i]).removeClass('col-md-6').addClass('col-md-4')
            }

            row.append(customElmt)
        }

    }

    editor (userlevel)
    {
        const $this = this
        let table = $(`${$this.container} table`)

        let editor = ( parseInt(userlevel) === 1 ) ? `
                <div class="editor">
                    <button class="btn btn-sm buttons-create" tabindex="0" aria-controls="create"><span>New</span></button>
                    <button class="btn btn-sm mx-1 buttons-selected buttons-edit disabled" tabindex="0" aria-controls="edit"><span>Edit</span></button>
                    <button class="btn btn-sm buttons-selected buttons-remove disabled" tabindex="0" aria-controls="remove"><span>Delete</span></button>
                </div>
            `
            : '' 

        let customElmt = `
                            <div class='col-sm-12 col-md-5 text-center'>${editor}</div>
                            <div class='col-sm-12 col-md-1 text-center'>
                                <span id='tbloptions'>
                                    <button class='btn tbloptions' type='button' data-status='false'>
                                        <span class='fa fa-ellipsis-v'></span>
                                    </button>
                                </span>
                            </div>
                        `

        $(this.container+' .dataTables_wrapper > div:first > div').removeClass('col-md-6').addClass('col-md-3')

        $(this.container+' .dataTables_wrapper > div:first').append(customElmt)

        if( $(this.container+' .dataTables_wrapper > div:first').length === 0 ) {
            let row = $($(this.container+' .dataTables_wrapper').closest('div').children()[0])
            
            for ( let i = 0; i < row.children().length; i++ ) {
                $(row.children()[i]).removeClass('col-md-6').addClass('col-md-4')
            }

            row.append(customElmt)
        }

        $(document).on( 'click', 'div.editor button:not(.disabled)', function() {
            let target = $(this).attr('aria-controls')
            
            if ( target === 'edit' ) {
                let row = table.DataTable().row( { selected: true } ).node()
                console.log(row)
            }

            //$('#bsModal').modal()
            //bbAlert('Are you sure you wish to delete 2 rows?');

            if ( target === 'remove' ) {
                let rows = table.DataTable().rows( { selected: true } ).nodes(),
                    count = rows.length,
                    label = count === 1 ? `${count} row` : `${count} rows`,
                    entries = []

                bbConfirm( `Are you sure you wish to delete ${label}?`, data => {
                    if (data) {
                        for ( let i = 0; i < count; i++  ) {
                            let data = JSON.parse($(rows[i]).attr('data-json'))
                            entries.push({ id: data.id, barcode: data.barcode })
                        }
                        console.log(entries)
                    }
                } )                
            }
        } )

        table
            .on( 'select.dt', () => buttonState(table) )
            .on( 'deselect.dt', () => buttonState(table) )
    }

}

function buttonState (table) {
    let data = table.DataTable().rows( { selected: true } ).data(),
        editBtn = $('.editor .buttons-edit '),
        removeBtn = $('.editor .buttons-remove')
    
    if ( data.length > 0 )  removeBtn.removeClass('disabled')
    else    removeBtn.addClass('disabled')

    if ( data.length === 1 )  editBtn.removeClass('disabled')
    else    editBtn.addClass('disabled')        
}

function validateParam ( wrapper ) {
    if ( typeof(wrapper) === 'undefined' )
        throw "Missing parameters";
    else if ( typeof(wrapper) !== 'string' )
        throw "String data type expected, "+typeof(wrapper)+' given';
    else if ( $(wrapper).length === 0 )
        throw "Element not found in document";                  
    else
        return wrapper        
}

function datatableSearchOnly (wrapper) {
    let container = validateParam(wrapper),
        myTable = $(container+' table').DataTable({ columnDefs: [{ orderable: false, targets:   3 }], scrollY: 400, scrollCollapse: true, info: false, paging: false })
        $(container+' .dataTables_wrapper > div:first > div')[0].remove()
            $(container+' #DataTables_Table_0_filter').css('text-align', 'left')
} 

function addTfoot ( wrapper, tfoot ) {
    let container = validateParam(wrapper),
        table = $(container+' table');

    if ( ! $(container+' table tfoot').length ) table.append(tfoot);
}