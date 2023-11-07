class myDataTable {

	constructor ( wrapper )
	{
		this.container = validateParam(wrapper);
        try {
            this.today = ( 'date' in JSON.parse(sessionStorage.searchdata) ) ? JSON.parse(sessionStorage.searchdata).date : this.today = JSON.parse(sessionStorage.searchdata).datefrom;
        } catch (err) {console.error(err)}

        /*if ( $.fn.dataTable.tables().length )
            $.fn.dataTable.tables({ api: true }).destroy()*/
	}

    datatable ( params = false )
    {
        let table = $(this.container+' table'),
            contentTitle = $('.content-title').text().replace("TODAY", this.today),
            tableName = ( typeof(table.attr('name')) === 'undefined' ) ? this.container : table.attr('name'),
            tableOpts = table.data('options')

        const tableTitle = ( contentTitle === '' ) ? tableName : contentTitle;

        let defaultParams =
            {
                processing: true,

                columnDefs: [],

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

        if (tableOpts) {
            if (tableOpts.hidden_columns !== undefined ) {
                defaultParams.columnDefs.push({ targets: tableOpts.hidden_columns, visible: false })
            }
        }

        if ( params ) {
            if ( 'buttons' in params ) {
                params.buttons[0] = $.extend( params.buttons[0], defaultParams.buttons[0] )
                params.buttons[1] = $.extend( params.buttons[1], defaultParams.buttons[1] )
            }

            params = ( params ) ? $.extend( defaultParams, params ) : defaultParams
        } else params = defaultParams

        var myTable = table.DataTable(params);

		if (myTable.tables().context.length > 1) {
			$('.hero-callout').css({
				boxShadow: 'none',
				border: '1px solid whitesmoke',
				marginBottom: '20px'
			})
		}

        if ( table.attr('data-select') !== undefined ) this.editor(myTable)
        else this.customFeatures(myTable)

        $(document).off( 'click', 'li.dt-btn').on( 'click', 'li.dt-btn', function() {
			let name = $(this).attr('name'),
				button = $(this).parents('div.row').find('.hidden-btn-group').find(name)

			if (button.length)
				button.click()
			else
				myTable.buttons(name).trigger()

            if ( parseInt($(this).attr('data-close')) === 1 )
                hidePlacard($('.placard'), $('button.customfeatures'));
            else
                $('.dt-buttons').remove();
        } )

        return myTable
    }

    features () {
        console.log(this.userlevel)
    }

    customFeatures (dTable)
    {
        let customElmt = "<div class='col-sm-6 col-md-3 hidden-btn-group invisible'></div> <div class='col-sm-6 col-md-1 text-center'><span id='tbloptions'><button class='btn tbloptions' type='button' data-status='false'><span class='fa fa-ellipsis-v'></span></button></span></div>"

		for (let i = 0; i < dTable.tables().context.length; i++) {
			let row = $( dTable.tables().containers()[i] ).find('div.row:eq(0)')
	        	row.find('div').removeClass('col-sm-12 col-md-6').addClass('col-sm-6 col-md-4')
				row.append(customElmt)

			$( dTable.buttons().container()[i] ).appendTo( $( dTable.tables().containers()[i] ).find('.hidden-btn-group') )

			if ( row.length === 0 ) {
	            let row = $( $( dTable.tables().containers()[i] ).closest('div').children()[0] )

	            for ( let i = 0; i < row.children().length; i++ ) {
	                $(row.children()[i]).removeClass('col-md-6').addClass('col-md-4')
	            }

	            row.append(customElmt)
	        }
		}

    }

    editor (dTable)
    {
        const table = $( dTable.table().container() ).find('table'),
              tools = table.data('options').dt_tools,
              toolsElmnt = [
                  '<button class="btn btn-sm buttons-create" tabindex="0" aria-controls="create"><span>New</span></button>',
                  '<button class="btn btn-sm mx-1 buttons-selected buttons-edit disabled" tabindex="0" aria-controls="edit"><span>Edit</span></button>',
                  '<button class="btn btn-sm buttons-selected buttons-remove disabled" tabindex="0" aria-controls="remove"><span>Delete</span></button>'
              ]

        try {
              var $btn = {
                  create: tools.create ? toolsElmnt[0] : '',
                  edit: tools.edit ? toolsElmnt[1] : '',
                  remove: tools.remove ? toolsElmnt[2] : '',
              }            
        } catch (err) {
            var $btn = { create: toolsElmnt[0], edit: toolsElmnt[1], remove: toolsElmnt[2] }
        }

        let customElmt = `
                <div class='col-sm-6 col-md-4 text-center'>
                    <div class="editor">
                        ${$btn.create}
                        ${$btn.edit}
                        ${$btn.remove}
                    </div>
                </div>
				<div class='col-sm-6 col-md-1 hidden-btn-group invisible'></div>
                <div class='col-sm-6 col-md-1 text-center'>
                    <span id='tbloptions'>
                        <button class='btn tbloptions' type='button' data-status='false'>
                            <span class='fa fa-ellipsis-v'></span>
                        </button>
                    </span>
                </div>
            `

		let row = $( dTable.table().container() ).find('div.row:eq(0)')
	        row.find('div').removeClass('col-sm-12 col-md-6').addClass('col-sm-6 col-md-3')
	        row.append(customElmt)

        if( row.length === 0 ) {
            let row = $( $( dTable.table().container() ).closest('div').children()[0] )

            for ( let i = 0; i < row.children().length; i++ ) {
                $(row.children()[i]).removeClass('col-md-6').addClass('col-md-4')
            }

            row.append(customElmt)
        }

        table
            .on( 'select.dt', ( e, dt, type, indexes ) => rowState(table, indexes) )
            .on( 'deselect.dt', () => buttonState(table) )
    }

}

function rowState ( table, index ) {
    const row = table.DataTable().row(index)
          node = $(row.node()),
          state = JSON.parse(node.attr('data-json')).status

    if ( state === undefined || state === null ) buttonState(table)
    else {
        row.deselect()
        node.addClass('bg-light')
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

function remove (table) {
    let rows = table.DataTable().rows( { selected: true } ),
        nodes = rows.nodes(),
        count = nodes.length,
        label = count === 1 ? `${count} row` : `${count} rows`,
        entries = []

    bbConfirm( `Are you sure you wish to delete ${label}?`, data => {
        let handler = FILE + '@_delete'
        if (data) {
            for ( let i = 0; i < count; i++  ) {
                let d = JSON.parse($(nodes[i]).attr('data-json'))
                
                try {
                    entries.push(deleteEntries(d))
                } catch (err) {
                    entries.push({ id: parseInt(d.id), barcode: d.barcode, location: d.location, product: d.productname, weight: parseFloat(d.weight) })
                }
            }

            utilizePromise(
                ajaxRequest(URL, { request: JSON.stringify({ handler: handler, argument: entries }) }, 'text', 'DELETE'),
                data => {
                    if ( data === '1' || data === 'true' ) {
                        rows.remove().draw(false)
                        try { customDeleteEvent(entries.length) } catch (err) {}
                    }
                    else bbAlert(data)
                }
            )
        }
    } )
}


$(document).on( 'click', 'div.editor button:not(.disabled)', function() {
    let target = $(this).attr('aria-controls'),
        table = $(this).parents('div.dataTables_wrapper').find('table')
        
    if ( target === 'create' || target === 'edit' ) {
        let row = table.DataTable().row( { selected: true } ).node(),
            data = target === 'create' ? {} : $(row).data('json')

        try {
            dtForm(data, arg => {
                $(arg.form).on( 'submit', function() {
                    window[arg.function](this, formData => {
                        $.post( 'app/route.php', { request: JSON.stringify(formData) }, function(data) {
                            if ( data === '1' || data === 'true' ) {
                                feedback({ message: 'Data saved!', wrapper: '.modal-body', alert: 'success' })
                                arg.modal.modal('hide')
                                generateContent(JSON.parse(sessionStorage.cache))
                                if (target === 'create') {
                                    try { customAddEvent() } catch (err) {}
                                }
                            } else {
                                feedback({ message: data, wrapper: '.modal-body', alert: 'danger' })
                            }
                        } )
                    })

                    return false
                } )
            })
        } catch (e) {
            console.error(e)
        }
    }

    if ( target === 'remove' ) remove(table)
} )
