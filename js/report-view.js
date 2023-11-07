class reportView extends Table {

    constructor ( node, url, userConfigs = {} ) {
        if ( typeof(node) !== 'object' || ! node.length ) {
            throw 'NODE not found in document'
        }

        if (!url) {
            throw 'URI is required.'
        }

        super()
        const $this = this

        this.node = node
        this.url = url
        this.configs = { ...{dtOptions: {}, delInputs: ['id']}, ...userConfigs }
        this.loader = $('<div />', {class: 'processing card'}).text('Processing...')
        this.dtOptions = this.configs.dtOptions

        $(document).on( 'click', '.buttons-remove:not(.disabled)', () => this.remove() )

        $(document).on( 'click', '.buttons-create:not(.disabled), .buttons-edit:not(.disabled)', function() {
            $this.editorForm($(this).attr('aria-controls'))
        } )

        $(document).on( 'click', '.tbloptions', () => $('.placard').toggle('fast', 'linear') )
        $(document).on( 'change', 'select.page', () => this.updateView() )
        $(document).on( 'submit', '#searchform', () => this.handleSearch() )        
    }

    handleSearch = () => {
        this.updateView()
        $('#searchModal').modal('hide')

        return false    
    }

    updateView = () => {
        const filters = document.querySelectorAll('#searchform select.filter, #searchform input.filter')
        const page = $('select.page').val() || 'index'
        let obj = {}

        filters.forEach(filter => obj[filter.name] = filter.value)

        $('.evt').attr('disabled', true)

        let ajaxOptions = {
            url: `${this.url}/${page.replace('-', '')}?${queryParameters(obj)}`,
            methodType: 'GET',
            dataType: 'HTML',    
            before: () => $('body').append(this.loader),
            progress: event => updateProgress(event)       
        }

        if ($('select.page').find('option:selected').attr('dt-exclude') !== undefined) {
            this.dtOptions.drawCallback = false
            this.dtOptions.bSort = false
            this.dtOptions.info = false
            this.dtOptions.searching = false
        }

        xhr(ajaxOptions).then(
            data => {
                this.node.css('opacity', 0).html(data).css('opacity', 1)

                const table = this.node.find('table')

                if (table.length) {
                    this.datatable(table)
                }

                this.loader.fadeOut(1000, () => {
                    this.loader.remove()
                    $('.evt').attr('disabled', false)
                } )        
            },
            error => feedback({ message: error.responseText, alert: 'danger' })
        )
    }

    editor = () => {
        const table = $(this.dt.table().container()).find('table')
        const options = {...{create: true, edit: true, remove: true}, ...table.data('options').dt_tools}

        $('div.dt_editor').html(`
            ${options.create ? '<button class="btn btn-sm buttons-create" tabindex="0" aria-controls="create"><span>New</span></button>' : ''}
            ${options.edit ? '<button class="btn btn-sm mx-1 buttons-selected buttons-edit disabled" tabindex="0" aria-controls="edit"><span>Edit</span></button>' : ''}
            ${options.remove ? '<button class="btn btn-sm buttons-selected buttons-remove disabled" tabindex="0" aria-controls="remove"><span>Delete</span></button>' : ''}
        `)

        table
            .on('select.dt', ( e, dt, type, indexes ) => this.rowState(table, indexes))
            .on('deselect.dt', () => this.buttonState(table))
    }

    more = () => {
        $('div.dt_more').html(`
            <span id='tbloptions'>
                <button class='btn tbloptions' type='button' data-status='false'>
                    <span class='fa fa-ellipsis-v'></span>
                </button>

                <div class='placard' style='display: none;'>
                    <ul>
                        <li name='.buttons-print' class='dt-btn print-tbl'>
                            <span class='fa fa-print'></span> <label>Print</label>
                        </li>
                        <li name='.buttons-excel' class='dt-btn download-excel'>
                            <span class='fa fa-file-excel'></span> <label>Excel</label>
                        </li>
                    </ul>
                </div>
            </span>
        `)        
    }

    datatable = table => {
        this.dt = table.DataTable(this.options())
        
        if (table.attr('data-select')) {
            this.editor()
        }  

        this.more()

        $('.dt-btn').on( 'click', e => {
            this.dt.buttons(e.currentTarget.getAttribute('name')).trigger()
            $('.placard').toggle('fast', 'linear')
        } )        
    }

}

$('body').on('mouseup', function(e) {
    if (document.querySelector('.placard')) {
        if (document.querySelector('.placard').style.display !== 'none' && $('#tbloptions').has(e.target).length === 0) {
            $('.placard').toggle('fast', 'linear')
        }
    }
})
