"use strict"

// Register sum method for datatable api
jQuery.fn.dataTable.Api.register( 'sum()', function ( ) {
    return accounting.formatNumber(this.flatten().reduce( function ( a, b ) {
        if ( typeof a === 'string' ) {
            a = a.replace(/[^\d.-]/g, '') * 1
        }
        if ( typeof b === 'string' ) {
            b = b.replace(/[^\d.-]/g, '') * 1
        }

        return a + b
    }, 0 ))
} )


class Table {

    options = pageDtOptions => {
        let defOptions = {
            dom: "<'row'<'col-sm-12 col-md-3'l> <'col-sm-12 col-md-4 dt_editor text-center'> <'col-sm-12 col-md-3'f> <'col-sm-12 col-md-2 dt_more text-right'>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            scrollCollapse: true,
            pageLength:  10,
            aLengthMenu: [10, 15, 20, 25, 50],        
            processing: true,
            columnDefs: [],
            buttons: [
                {
                    extend: 'print',
                    title: this.title,
                    footer: true,
                    customize: win => {
                        $(win.document.body).find( 'table' ).addClass( 'printstyle' );
                            $(win.document.body).css('height', 'auto');
                    }
                },

                {
                    extend: 'excel',
                    title: this.title,
                    footer: true
                }
            ],

            drawCallback: function () {
                const options = $(this.api().table().container()).find('table').data('options')
                
                function calculate (object, key) {
                    let number
                    try {
                        number = parseInt( object.api().column( key ).data()[0].replace(',', '') )
                    } catch (e) {
                        number = NaN
                    }
                    
                    return ( isNaN(number) ) ? object.api().column( key, {search: 'applied'}).data().count() : object.api().column( key, {search: 'applied'}).data().sum()
                }

                if ( this.api().column().footer() !== null ) {
                    if (options.sum !== undefined && typeof(options.sum) === 'object') {
                        for ( let key of options.sum )
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
                            average

                        try {
                            average = parseInt(total.replace(/,/g, '')) / count
                        } catch (e) {
                            average = NaN
                        }

                        $( `tr:eq(1) td:eq(${k})`, this.api().table().footer() )[0].innerHTML = accounting.formatNumber( Math.round(average) )
                    }                    
                }
              
            }            
        }

        const options = { ...defOptions, ...this.dtOptions, ...pageDtOptions } 
        
        return options
    }

    datatable = (table, options = {}) => {
        this.dt = table.DataTable(this.options(options))

        $('div.dt_more').html(`
            <div class="dropdown">
                <span class="btn d-inline-flex tbloptions" id="dropdownToolbar" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class='fa fa-ellipsis-v'></i>
                </span>
                
                <div class="dropdown-menu" aria-labelledby="dropdownToolbar">
                    <a name=".buttons-print" class="dropdown-item dt-btn p-2">
                        <i class="fa fa-print icon mr-3"></i>
                        <label class="mb-0">Print</label>                        
                    </a>

                    <a name=".buttons-excel" class="dropdown-item dt-btn p-2">
                        <i class="fa fa-file-excel icon mr-3"></i>
                        <label class="mb-0">Excel</label>                        
                    </a>
                </div>
            </div>
        `)

        $('.dt-btn').on( 'click', e => this.dt.buttons(e.currentTarget.name).trigger() )

        if ( table.attr('data-select') ) {
            this.editor()
        }        
    }

    editor = () => {
        let config = this.editorConf,
            table = $( this.dt.table().container() ).find('table')

        if ( table.data('options').dt_editor ) {
            config = { ...config, ...table.data('options').dt_editor }
        }

        const { create, edit, remove } = config

        $('div.dt_editor').html(`
            ${ (this.form && create) ? `<button class="btn btn-sm btn-light buttons-create" tabindex="0" aria-controls="create"><span>New</span></button>` : '' }
            ${ (this.form && edit) ? `<button class="btn btn-sm btn-light mx-1 buttons-selected buttons-edit disabled" tabindex="0" aria-controls="edit"><span>Edit</span></button>` : '' }
            ${ remove ? `<button class="btn btn-sm btn-light buttons-selected buttons-remove disabled" tabindex="0" aria-controls="remove"><span>Delete</span></button>` : '' }
        `)

        table.on( 'select.dt', ( e, dt, type, indexes ) => this.rowState(table, indexes) ).on( 'deselect.dt', () => this.buttonState(table) )        
    }

    rowState = (table, index) => {
        const row = table.DataTable().row(index),
              node = $(row.node()),
              state = JSON.parse(node.attr('data-json')).status

        if ( state === undefined || state === null ) {
            this.buttonState(table)
        } else {
            row.deselect()
            node.addClass('bg-light')
        }        
    }

    buttonState = table => {
        let data = table.DataTable().rows( { selected: true } ).data(),
            editBtn = $('.dt_editor .buttons-edit '),
            removeBtn = $('.dt_editor .buttons-remove')

        if ( data.length > 0 )  removeBtn.removeClass('disabled')
        else    removeBtn.addClass('disabled')

        if ( data.length === 1 )  editBtn.removeClass('disabled')
        else    editBtn.addClass('disabled')        
    }

    editorForm = (target) => {
        let table = $( this.dt.table().container() ).find('table'),
            row = table.DataTable().row( { selected: true } ).node(),
            data = target === 'edit' ? $(row).data('json') : {}
        
        try {
            this.form.template(data, form => {
                form.on( 'submit', () => {
                    this.form.action(form[0], (url, options) => {
                        _fetch(url, options)
                        .then( success => {
                            feedback({ message: success, alert: 'success' })
                            this.updateView()
                        } )
                        .catch( error => feedback({ message: error, alert: 'danger' }) )
                    })

                    return false
                } )
            })
        } catch (e) { console.error(e) }
    }

    remove = () => {
        let table = $( this.dt.table().container() ).find('table'),
            rows = table.DataTable().rows( { selected: true } ),
            nodes = rows.nodes(),
            count = nodes.length,
            label = count === 1 ? `${count} row` : `${count} rows`,
            entries = []

        bbConfirm( `Are you sure you wish to delete ${label}?`, data => {
            if (data) {
                for ( let i = 0; i < count; i++  ) {
                    let rowdata = $(nodes[i]).data('json')
                    entries.push(parseInt(rowdata.id))
                }

                _fetch(`${this.url}/${entries.join()}`, {method: 'DELETE'})
                .then( () => rows.remove().draw(false) )
                .catch(error => bbAlert(error.toString()))
            }
        } )
    }

}
