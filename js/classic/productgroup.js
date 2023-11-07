window.addEventListener('load',function() {
        $('.productgroup').bind('change', function(){
			productgroup = $(this).val();
			url = 'Connections/getprodgroup.php';
			if(productgroup != ''){
			$.get(
			url,
			{productgroup : productgroup},
			function(data){
				$('.productname').html(data);
				});
			}
			
			});
    });
