"use strict"

class Viewer extends Table {

    constructor ( configs = {}, node ) {
        if ( typeof(node) !== 'object' || ! node.length ) {
            throw 'NODE not found in document'
        }

        super()
        const $this = this
        
        const defs = {
            filters: [],
            pages: [],
            tableClass: 'table-sm table-borderless',
            editorConf: { create: false, edit: false, remove: false },
            dtOptions: {},
            dateFieldName: 'date',
            defaultPage: 'index',
            modalSize: 'modal-lg'
        }

        const { file, filters, pages, tableName, dateFieldName, defaultPage, editorConf, title, form, ...rest } = { ...defs, ...configs }

        $('body').prepend(modal({
            name: 'searchModal',
            title: 'Search Options',
            size: rest.modalSize
        }))

        this.node = node
        this.url = `app/${file}`
        this.filters = filters
        this.pages = pages
        this.table = tableName
        this.editorConf = editorConf
        this.tableClass = rest.tableClass
        this.dtOptions = rest.dtOptions
        this.title = title 
        this.form = form
        this.dateField = dateFieldName
        this.defaultPage = defaultPage
        this.modal = $('#searchModal')

        $(document).on( 'click', '.buttons-remove:not(.disabled)', () => this.remove() )
        
        $(document).on( 'click', '.buttons-create:not(.disabled), .buttons-edit:not(.disabled)', function() {
            $this.editorForm($(this).attr('aria-controls'))
        } )
        
        $(document).on( 'change', 'select.page', () => this.updateView() )
        $(document).on( 'submit', '#searchform', () => this.handleSearch() )
        $(document).on( 'click', '.submit-form', () => $('#searchform').submit() )
    }

    handleSearch() {
        this.updateView()
        this.modal.modal('hide')

        return false 
    }

    updateView = () => {
        const spinner = document.getElementById("spinner")
        const filters = document.querySelectorAll('#searchform select, #searchform .date')
        const page = $('.page').val() || 'index'
        
        let data = {}

        filters.forEach(filter => data[filter.name] = filter.value)
       
        spinner.removeAttribute('hidden')

        _fetch(`${this.url}_entries/${page}?${queryParameters(data)}`)
        .then( data => {
            let table = $(data).addClass(this.tableClass)

            this.node.find('.content-body').html(table)

            if ( table.is('table') ) {
                const singlePage = this.pages.find(item => item.name === page) || {}
                
                this.datatable(table, singlePage.dtOptions)
            }

            spinner.setAttribute('hidden', '')
        } )
        .catch( error => feedback({ message: error, alert: 'danger' }) )
    }

    render () {
        const layout = `
            <div class="content-head d-flex justify-content-between bg-light py-2 px-3 border-bottom">
                <div class="d-flex align-items-center">
                    ${ this.filters.length ? `
                        <button type="button" class="btn btn-sm btn-secondary mr-3" data-toggle="modal" data-target="#searchModal" data-backdrop="false">Search Options</button>                    
                    ` : '' }

                    <p class="content-title">${this.title}</p>                
                </div>

                ${ (this.pages.length) ? `
                    <select name="method" class="form-control form-control-sm page">
                        ${ this.pages.map( ({name, label}) => createOption(label, name) ).join('') }
                    </select>
                ` : '' }
            </div>

            <div class="container-fluid mt-3 content-body"></div>

            <div hidden id="spinner"></div>
        `

        let modalBodyContent = $(`
            <form name="searchform" id="searchform" class="d-flex justify-content-between" method="post" action="${this.url}">
                ${ this.filters.map( filter => {
                    const { type, name, label, options, search } = filter
                    const searching = search ? 'selectized' : 'form-control form-control-sm'

                    return (type === 'dropdown') ? `
                        <select name="${name}" class="filter ${searching} ${name}">
                            <option value="">${label}</option>
                            ${ ! search ? options.map( option => `<option value="${option}">${option}</option>` ).join('') : null }
                        </select>
                    ` : `<input type="text" name="${name}" class="form-control form-control-sm date ${name}" autocomplete="off" />`
                } ).join('') }
            </form>    
        `)

        let modalFooterContent = `
            <button type="button" class="btn btn-sm btn-outline-secondary" data-dismiss="modal">Close</button>
            <input type="submit" name="submit" class="btn btn-sm btn-secondary submit-form" value="Search">
        `

        if ( this.filters.find( item => item.type === 'date' ) ) {
            modalBodyContent.find('.date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true }).datepicker('setDate', 'now')
        }

        this.node.html(layout)
        this.modal.find('.modal-body').html(modalBodyContent)
        this.modal.find('.modal-footer').html(modalFooterContent)

        return this
    }

}
