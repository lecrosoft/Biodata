class myDataTable {

	constructor ( wrapper )
	{
		this.container = validateParam(wrapper);
        try {
            if ( sessionStorage.searchdata ) {
                this.today = ( 'date' in JSON.parse(sessionStorage.searchdata) ) ? JSON.parse(sessionStorage.searchdata).date : this.today = JSON.parse(sessionStorage.searchdata).datefrom;
            }
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

        // let customElmt = `
        //         <div class='col-sm-6 col-md-4 text-center'>
        //             <div class="editor">
        //                 ${$btn.create}
        //                 ${$btn.edit}
        //                 ${$btn.remove}
        //             </div>
        //         </div>
		// 		<div class='col-sm-6 col-md-1 hidden-btn-group invisible'></div>
        //         <div class='col-sm-6 col-md-1 text-center'>
        //             <span id='tbloptions'>
        //                 <button class='btn tbloptions' type='button' data-status='false'>
        //                     <span class='fa fa-ellipsis-v'></span>
        //                 </button>
        //             </span>
        //         </div>
        //     `

		// let row = $( dTable.table().container() ).find('div.row:eq(0)')
	    //     row.find('div').removeClass('col-sm-12 col-md-6').addClass('col-sm-6 col-md-3')
	    //     row.append(customElmt)

        // if( row.length === 0 ) {
        //     let row = $( $( dTable.table().container() ).closest('div').children()[0] )

        //     for ( let i = 0; i < row.children().length; i++ ) {
        //         $(row.children()[i]).removeClass('col-md-6').addClass('col-md-4')
        //     }

        //     row.append(customElmt)
        // }

        // table
        //     .on( 'select.dt', ( e, dt, type, indexes ) => rowState(table, indexes) )
        //     .on( 'deselect.dt', () => buttonState(table) )
    }

}

// function rowState ( table, index ) {
//     const row = table.DataTable().row(index)
//           node = $(row.node()),
//           state = JSON.parse(node.attr('data-json')).status

//     if ( state === undefined || state === null ) buttonState(table)
//     else {
//         row.deselect()
//         node.addClass('bg-light')
//     }
// }

// function buttonState (table) {
//     let data = table.DataTable().rows( { selected: true } ).data(),
//         editBtn = $('.editor .buttons-edit '),
//         removeBtn = $('.editor .buttons-remove')

//     if ( data.length > 0 )  removeBtn.removeClass('disabled')
//     else    removeBtn.addClass('disabled')

//     if ( data.length === 1 )  editBtn.removeClass('disabled')
//     else    editBtn.addClass('disabled')
// }

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





