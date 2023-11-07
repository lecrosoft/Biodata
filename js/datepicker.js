$('#datediv').calendar({
            trigger: '#date',
            // offset: [0, 1],
            zIndex: 999,
            
        });

$('.datediv').calendar({
            trigger: '.date',
            // offset: [0, 1],
            zIndex: 999,
            
        });
$('#datediv2').calendar({
            trigger: '#date2',
            // offset: [0, 1],
            zIndex: 999,
            
        });
$('.datediv2').calendar({
            trigger: '.date2',
            // offset: [0, 1],
            zIndex: 999,
            
        });

$('.date').datepicker({
            format: 'yyyy/mm/dd',
            autoclose: true,
            endDate: 'today',
            todayHighlight: true
        }).attr("autocomplete", "off");
