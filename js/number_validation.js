// Disable Mouse scrolling
$('input[type=number]').on('mousewheel',function(e){ $(this).blur(); });

// Disable keyboard scrolling
$('input[type=number]').on('keydown',function(e){
    var key = e.charCode || e.keyCode;

    // Disable Up and Down Arrows on Keyboard
    if(key == 38 || key == 40 ){
        e.preventDefault();
    } else {
        return;
    }
});


// Catch all events related to changes
$('body').on('change blur', 'input[type=number]', function() {
  // Remove invalid characters
  var sanitized = $(this).val().replace(/[^0-9.]/g, '');
  // Update value
  $(this).val(sanitized);
});



/*var str = "1.2"
var regexp = /^[0-9]+([,.][0-9]+)?$/g
var result = regexp.test(str)

console.log(result)*/