$(document).on('change', 'select.selectized', function() {
   try {
        let $this = $(this).attr('id'),
            $val = $(this).val()

        if ( $this === 'factory' ) {
            let where = $val === 'all' || $val === '' ? '' : `WHERE factoryname = '${$val}'`
            selectizeFilter(`SELECT linename FROM factory_lines ${where} ORDER BY linename`, '#line', 'linename')
        }

        if ( $this === 'line' ) {
            let where = $val === 'all' || $val === '' ? '' : `WHERE linename = '${$val}'`
            selectizeFilter(`SELECT project FROM factory_projects ${where} ORDER BY project`, '#project', 'project')
        }

        if ( $this === 'group' ) {
            let where = $val === 'all' || $val === '' ? '' : `WHERE groupname = '${$val}'`
            selectizeFilter(`SELECT subgroupname FROM rawmaterials_subgroups INNER JOIN rawmaterials_groups AS g ON groupid = g.id ${where} ORDER BY subgroupname`, '#subgroup', 'subgroupname')
        }

        if ( $this === 'subgroup' ) {
            let where = $val === 'all' || $val === '' ? '' : `WHERE subgroupname = '${$val}'`
            selectizeFilter(`SELECT productname FROM rawmaterials_products INNER JOIN rawmaterials_subgroups AS s ON subgroupid = s.id ${where} ORDER BY productname`, '#product', 'productname')
        }

        if ( $this === 'gradetype' ) {
            let where = $val === 'all' || $val === '' ? '' : `WHERE gradetype = '${$val}'`
            selectizeFilter(`SELECT DISTINCT productname FROM bpl_products ${where} ORDER BY productname`, '#product', 'productname')
        }
   } catch (err) {
       console.error(err)
    }
})
