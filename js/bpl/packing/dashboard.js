"use strict"

let items, containers = []

const dashboard = () => {
    let content = $(`
        <div class="container-fluid p-3 border-bottom">
            <div class="row">
                <div class="col-md-6">
                    <div class="d-inline-block mr-4" style="min-width: 250px">
                        <select class="form-control proforma" onchange="openProforma(this)">
                            <option value="">Select proforma invoice</option>
                        </select>
                    </div>
                </div>

                <div class="col-md-6 text-md-right mt-3 mt-md-0">
                    <a href="javascript:_push('bpl_packing_list')" class="btn btn-sm btn-secondary">View packing entries</a>
                </div>
            </div>
        </div>

        <div class="container-fluid py-3">
            <div class="row">
                <div class="col-md-6 info">
                    <p class="text-info">Choose invoice to display items here</p>
                </div>

                <div class="col-md-5 offset-md-1 mt-2 mt-md-0" style="max-width: 400px">
                    <h4 class="mb-3">Container Inputs</h4>
                    <div class="container-list"></div>
                </div>                       
            </div>

            <div class="row border-top">
                <div class="col-sm-12 entries"></div>                 
            </div>
        </div>
    `)

    if ( location.hash && location.hash === '#new' ) {
        _fetch('app/bpl_packing_proforma')
        .then( data => {
            for (let res of JSON.parse(data)) {
                content.find('.proforma').append(`<option value="${res.id}" data-number="${res.number}" data-container="${res.container}">${res.proforma}</option>`)
                selecter(content.find('.proforma'))
            }
        } )
        .catch( error => feedback({ message: error, alert: 'danger' }) )
        
        return content
    }

    _fetch( 'app/bpl_packing_list' + location.hash.replace('#', '/') )
    .then( data => loadProforma(JSON.parse(data)) )
    .catch( error => {
        feedback({ message: error, alert: 'danger', timeout: 3500 })
        $($('.col-md-6')[0]).html(createBtn('bpl_packing_list#new'))
        $('.container-fluid')[1].remove()
    } )
    
    return content
}

const containerInput = (e, target) => {
    if ( e.keyCode === 13 ) {
        let val = $(target).val().toUpperCase(), inputID = $(target).attr('id'), container = containers.find(item => item.name === val)

        if ( containers.find(item => item.name === val) ) {
            if ( inputID !== container.id ) {
                feedback({ message: 'Container number already exists', alert: 'danger' })
                return false
            }
        }

        if (val) openModal($(target), containers.find(item => item.id === inputID))
    }
}

const infoContent = `
    <h4 class="mb-3">Proforma Invoice Items</h4>
    <table class="table table-md">
        <thead>
            <tr>
                <th>Description</th>
                <th class="text-center">Weight</th>
                <th class="text-right">Loaded</th>
            </tr>
        </thead>

        <tbody />
    </table>
`

const entriesContent = `
    <h4 class="my-2">Container Entries</h4>
    <div id="accordion"></div>
    <input type="text" name="date" class="form-control form-control-sm my-3" id="date" placeholder="Date Picker" autocomplete="off" style="max-width: 250px;">
    <button type="button" class="btn btn-sm btn-primary save-containers" onclick="saveContainers()">Save</button>
`

const openProforma = target => {
    if ( ! $(target).val() ) return false

    $('.info').html(infoContent)

    _fetch(`app/bpl_proforma/${$(target).val()}`)
    .then( data => {
        items = JSON.parse(data).items.map( items => {
            items.loaded = 0
            return items
        } )
        
        updateTable($('.info'))       
    } )
    .catch( error => feedback({ message: error, alert: 'danger' }) )

    let container = $('.container-list').html('')

    for ( let i = 1; i <= $(target).find(':selected').data('container'); i++ ) {
        container.append(`
            <div class="form-group">
                <label for="cont${i}" class="mb-1">Container ${i}</label>
                <input type="text" class="form-control form-control-sm" id="container_${i}" placeholder="Enter number and Press Enter" autocomplete="off" onkeydown="containerInput(event, this)">
            </div>
        `)
    }

    $('.entries')
        .html(entriesContent)
        .find('#date').datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true })
    
    containers = []
    updateTab()
}

const loadProforma = data => {
    const { id, order_id, number, proforma, container, date, ...rest } = data
    containers = rest.containers
    items = rest.items.map( item => {
        item.loaded = 0
        for ( let container of rest.containers ) {
            for ( let payload of container.goods ) {
                if ( payload.description === item.fullname ) {
                    item.loaded += payload.weight
                }
            }
        }
        return item       
    } )

    $('select.proforma')
        .html(`<option value="${order_id}" data-id="${id}" data-number="${number}" data-container="${container}">${proforma}</option>`)
        .attr('disabled', true)
        .parent().parent().append(createBtn('bpl_packing_list#new'))

    $('.info').html(infoContent)
    $('.entries')
        .html(entriesContent)
        .find('#date')
            .datepicker({ format: 'yyyy/mm/dd', autoclose: true, endDate: 'today', todayHighlight: true })
            .datepicker('setDate', date)

    rest.containers.forEach( (container, i) => $('.container-list').append(`
        <div class="form-group">
            <label for="cont${i+1}" class="mb-1">Container ${i+1}</label>
            <input type="text" class="form-control form-control-sm" id="container_${i+1}" placeholder="Enter number and Press Enter" value="${container.name}" autocomplete="off" onkeydown="containerInput(event, this)">
        </div>    
    `) )

    updateTable($('.info'))
    updateTab()
}

const openModal = (node, container = undefined) => {
    let disable = ' disabled'

    modalPop.find('.modal-title').text(node.val()).addClass('m-0')
    modalPop.find('.modal-body').html(`
        <form class="submit-disabled" onsubmit="addGoods(event, this)">
            <input type="hidden" name="id" value="${node.attr('id')}">

            <div class="d-flex mb-2">
                <label>Container Weight (kgs):</label>
                <input type="number" name="container_weight" class="form-control form-control-sm ml-2" min="100" step="0.01" placeholder="Container Weight (kgs)" autocomplete="off" value="1000" required style="max-width: 250px;">                    
            </div>

            <table class="table table-md">
                <thead>
                    <tr>
                        <th class="border-top-0">Description</th>
                        <th class="border-top-0 text-center" style="width: 150px;">No of Rolls</th>
                        <th class="border-top-0 text-right" style="width: 200px;">Net Weight</th>
                    </tr>
                </thead>

                <tbody>
                    ${ items.map( ({ productname, fullname }, index) => {
                        let rolls = '', weight = ''
                        if (container) {
                            disable = ''

                            let item = container.goods.find(item => item.description === fullname)
                            if (item) {
                                rolls = item.rolls
                                weight = item.weight
                            }
                        }

                        return `
                            <tr class="item" data-key="${index}" data-desc="${fullname}">
                                <td>${productname}</td>
                                <td>
                                    <input type="number" name="rolls" class="form-control form-control-sm text-center rolls" min="1" step="1" value="${rolls}" autocomplete="off">
                                </td>
                                
                                <td>
                                    <input type="number" name="weight" class="form-control form-control-sm text-center weight" min="1" step="0.01" value="${weight}" autocomplete="off">
                                </td>             
                            </tr>
                        `
                    } ).join('') }
                </tbody>
            </table>

            <button type="submit" class="btn btn-primary" id="submit"${disable}>Add Goods</button>
        </form>
    `)

    modalPop.modal({ backdrop: 'static' })    
}

const updateTable = (node) => {
    node.find('tbody').html('')

    const rows = items.map( item => {
        let loaded = 0
        
        for ( let container of containers ) {
            for ( let goods of container['goods'] ) {
                if ( goods.description === item.fullname ) {
                    loaded += goods.weight
                }
            }
        }        

        return `
            <tr>
                <td>${item.fullname}</td>
                <td class="text-center">${item.weight}</td>
                <td class="text-right">${loaded}</td>             
            </tr>
        `
    })
    node.find('tbody').append(rows)            
}

const updateTab = () => {
    if ( containers.length > 0 ) {
        $('#accordion').html(
            containers.map( ({id, name, weight, goods}, index) => `
                <div class="card mb-2">
                    <div class="card-header d-flex align-items-center justify-content-between px-2 py-1">
                        <a class="btn btn-sm collapsed font-weight-bold" data-toggle="collapse" data-target="#c${index}">#${name} - ${weight} kgs</a>
                        <i class="fa fa-trash pointer" data-target="${id}" onclick="deleteContainer(this)"></i>
                    </div>

                    <div id="c${index}" class="collapse" data-parent="#accordion">
                        <div class="card-body p-0">
                            <table class="table table-md">
                                <tr>
                                    <th>S/N</th>
                                    <th>Description</th>
                                    <th>No of Rolls</th>
                                    <th>Net Weight</th>
                                </tr>
                                ${ goods.map( (lot, i) => `
                                    <tr>
                                        <td>${i + 1}</td>
                                        <td>${lot.description}</td>
                                        <td>${lot.rolls}</td>
                                        <td>${lot.weight}</td>
                                    </tr>
                                ` ).join('') }
                            <table>
                        </div>
                    </div>
                </div>
            ` )
        )
    } else {
        $('#accordion').html(`<p class="text-danger">You have not made any entry</p>`)
    }

    if ( containers.length === $('.proforma').find(':selected').data('container') ) {
        $('.save-containers').removeClass('d-none')
    } else {
        $('.save-containers').addClass('d-none')
    }                    
}

const containerGoods = (goods = []) => {
    for (let row of $('tr.item')) {
        let rolls = parseInt($(row).find('.rolls').val()),
            weight = parseFloat($(row).find('.weight').val())

        if ( rolls && weight ) {
            let i = $(row).data('key')
            items[i].loaded = parseFloat(items[i].loaded) + weight            
            goods.push({ description: $(row).data('desc'), rolls, weight })
        }
    }

    return goods    
}

const addGoods = (e, target) => {
    let id = target['id'].value,
        weight = target['container_weight'].value,
        goods = containerGoods()

    if ( weight && goods.length > 0 ) {
        let c_Key = containers.findIndex(item => item.id === id)
        if (c_Key < 0) {
            containers.push({ id, name: $('.modal-title').text(), weight, goods })
        } else {
            containers[c_Key].name = $('.modal-title').text()
            containers[c_Key].weight = weight
            containers[c_Key].goods = goods
        }

        updateTable($('.info'))
        updateTab()
        modalPop.modal('hide')                
    } else {
        feedback({ message: 'No goods is added', alert: 'danger' })
    }

    e.preventDefault()
}

const saveContainers = () => {
    if ( ! $('#date').val() ) {
        feedback({ message: 'Date is required!', alert: 'danger' })
        return false
    }

    if ( items.every(item => item.loaded !== 0) ) {
        let id = $('.proforma').find(':selected').data('id'),
            url = id ? `app/bpl_packing_list/${id}` : 'app/bpl_packing_list'

        _fetch(url, {
            method: id ? 'PUT' : 'POST',
            body: JSON.stringify({
                order_id: $('.proforma').val(),
                number: $('.proforma').find(':selected').data('number'),
                containers: JSON.stringify(containers),
                date: $('#date').val()
            }),
            headers: {'Content-Type': 'application/json'}
        })
        .then( data => {
            feedback({ message: 'Success', alert: 'success' })
            window.open('app/bpl_packing_printout/'+JSON.parse(data).id, '_blank')
            setTimeout( () => _push('bpl_packing_list'), 500 )
        } )
        .catch( error => feedback({ message: error, alert: 'danger', timeout: 3500 }) )                
    } else {
        feedback({ message: 'Goods still on ground', alert: 'danger' })
    }    
}

const deleteContainer = target => {
    const id = $(target).data('target')
    const container = containers.find(item => item.id === id )
    containers = containers.filter( item => item.id !== id )

    for ( let item of container.goods ) {
        const i = items.findIndex( ({fullname}) => fullname === item.description )
        items[i].loaded = parseFloat(items[i].loaded) - item.weight
    }

    updateTable($('.info'))
    updateTab()
    $('#'+id).val('')
}
