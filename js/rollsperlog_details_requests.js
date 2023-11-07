$(document).ready(function() {
	$('#productname').bind('change', function(){
		productname = $(this).val();
		if(productname != ''){
			url = 'connections/production_productcode.php';
			$.get(
			url,
			{productname : productname},
			function(data){
				$('#productcode').html(data);
			});
		}
			
	});
});
	
$(document).ready(function() {
	$('#hardrollwidth').bind('change', function(){
		hardroll = $(this).val();
		productname = $('#productname').val();
		if(hardroll != '' && productname != ''){
			url1 = 'connections/production_sheetwidth.php';
			$.get(
			url1,
			{hardroll : hardroll, productname : productname},
			function(data){
				$('#sheetwidth').html(data);
			});

			url2 = 'connections/production_rollsperlog.php';
			$.get(
			url2,
			{hardroll : hardroll, productname : productname},
			function(data){
				$('#rollsperlog').html(data);
			});

			url3 = 'connections/production_logweight.php';
			$.get(
			url3,
			{hardroll : hardroll, productname : productname},
			function(data){
				$('#logweight').html(data);
			});
		}

	});
});
	