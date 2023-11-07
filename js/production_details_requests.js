$(document).ready(function() {
	$('#linename').bind('change', function(){
		linename = $(this).val();
		if(linename != ''){
			url1 = 'connections/production_productname.php';
			$.get(
			url1,
			{linename : linename},
			function(data){
				$('#productname').html(data);
			});
			url2 = 'connections/production_bundles.php';
			$.get(
			url2,
			{linename : linename},
			function(data){
				$('#bundles').html(data);
			});
		}
	});
});