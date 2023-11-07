//Enter Button to Next Line and Count Current
$(document).ready(function() {
	$('.barcode').keypress(function(event) {
		if(event.which == 13) {
			barcodeclass = $(this).val();
			barcodeid = $(this).attr('id');
      		barcodeint = parseInt(barcodeid) + 1;
    		barcodecount = $('.barcode').length;
			val = 0;
    		for(i = 1; i <= barcodecount; i++){
				if($('input[name="barcode'+i+'"]').val() != ''){
					val += 1;
        		}
    		}
    		$('#currentcount').html(val);
     		str1 = '#';
    		newval = str1.concat(barcodeint);
    		$(newval).focus();
    		event.preventDefault();
    		if (barcodeclass != ''){
     			url1 = 'connections/production_barcode_icon_request.php';
				url2 = 'connections/production_barcode_productname_request.php';
				url3 = 'connections/production_barcode_bundles_request.php';
     			$.get(
      			url1,
      			{barcodeclass : barcodeclass},
      			function(data){
     				$('#icon'+barcodeid).html(data);
        		})
				$.get(
				url2,
				{barcodeclass : barcodeclass, barcodeid : barcodeid},
      			function(data){
     				$('#productname'+barcodeid).html(data);
        		})
				$.get(
				url3,
				{barcodeclass : barcodeclass, barcodeid : barcodeid},
      			function(data){
     				$('#bundles'+barcodeid).html(data);
        		});
   			}
   		}		
	});
	$('.barcode').on('change', function() {
			barcodeclass = $(this).val();
			barcodeid = $(this).attr('id');
      		barcodeint = parseInt(barcodeid) + 1;
    		barcodecount = $('.barcode').length;
			val = 0;
    		for(i = 1; i <= barcodecount; i++){
				if($('input[name="barcode'+i+'"]').val() != ''){
					val += 1;
        		}
    		}
    		$('#currentcount').html(val);
     		str1 = '#';
    		newval = str1.concat(barcodeint);
    		$(newval).focus();
    		if (barcodeclass != ''){
     			url1 = 'connections/production_barcode_icon_request.php';
				url2 = 'connections/production_barcode_productname_request.php';
				url3 = 'connections/production_barcode_bundles_request.php';
     			$.get(
      			url1,
      			{barcodeclass : barcodeclass},
      			function(data){
     				$('#icon'+barcodeid).html(data);
        		})
				$.get(
				url2,
				{barcodeclass : barcodeclass, barcodeid : barcodeid},
      			function(data){
     				$('#productname'+barcodeid).html(data);
        		})
				$.get(
				url3,
				{barcodeclass : barcodeclass, barcodeid : barcodeid},
      			function(data){
     				$('#bundles'+barcodeid).html(data);
        		});
   			}
	});
});