// JavaScript Document
// this file contains shared functions across pages 

// disable non_numeric keys 
function isNumberKey(e)
	{
		var charcode= (e.which) ? e.which: event.keyCode
		if(charcode > 31 && (charcode < 48 || charcode > 57))
			return false
			
		return true
	}

function Notice (content,color)
	{
		new jBox('Notice',{theme:'NoticeFancy',
			attributes:
				{
				x:'top',
				y:'right'
				},
		color:color,
		content:content,
		animation:{open:'slide:bottom',close:'slide:left'}
		})
	}

$(document).on("keypress",'input[name="quantity[]"],input[name="quantity"]',function(e)
	   {
		// console.log($(this)) 
		var charcode= (e.which) ? e.which: event.keyCode
		if(charcode > 31 && (charcode < 48 || charcode > 57))
			return false
			
		return true
	   })
   
function refreshDiv($area,$link,$data,callback){
	$data=$data||''
	$.ajax({
		url:$link,
		dataType:'html',
		data:$data,
		type:"POST",
		success:function(html,status)
			{
			$($area).fadeOut().empty().append(html).fadeIn();
			
			},
		error: function(xhr, textStatus, errorThrown) 
			{
			alert('An error occurred! ' + ( errorThrown ? errorThrown:	xhr.status ));

			}
		
		})
		
	}

	   
function refreshDiv2($area,$link,$data,callback,dataType='html'){
	$data=$data||''
    // if string passed to the display area ;
    if(typeof($area) != 'object')
        $area = $($area) ;

    let disp_area_zindex =  isNaN ($area.css('z-index')) ? 0 : $area.css('z-index');
    let disp_area_position = $area.css('position') ;
    let disp_area_minheight = $area.css('min-height');
	$.ajax({
		url:$link,
		dataType:dataType,
		data:$data,
		type:"POST",
        beforeSend : function()
            {
            // get the z-index of the display area ;
            // get the position of the display area ;
            // set the z-index of the loading icon to the display area's z-index+1
            // set the position of the display area to relative ;
            // append the loading icon to the display area ;
            let mtop =
            $area.css({'position':'relative','min-height':'200px'})
                .append('<div style="position:absolute;width:100%;height:100%;min-height:200px;text-align:center;z-index:'+ (disp_area_zindex + 1) +';background:rgba(143, 144, 149, 0.2)" id="loader-spinner">'
                        +'<i class="fa fa-spin fa-spinner fa-2x" style="margin-top:'+($area.height()/2)+'px "></i>'
                    +'</div>');
            },
		complete: function()
			{
            // reset the display area to its default ;
            $area.css({'position':disp_area_position,'min-height':disp_area_minheight}).find('#loader-spinner').remove() ;
			},
		success:function(resp,status)
			{


            if( dataType =='json')
                {
                callback(resp,status);
                }
            else
                {
                $area.fadeOut().empty().append(resp).fadeIn();
                if (callback)
                    {
                    callback(resp,status);
                    }
                }

			},
		error: function(xhr, textStatus, errorThrown)
			{
			alert('An error occurred! ' + ( errorThrown ? errorThrown:	xhr.status ));

			}

		})

	}
$(document).on('click','.smoothscroll', function (e) {
	target = $(this).attr('href')
	$target    = $(target);

	e.preventDefault();
	e.stopPropagation();	  

	$('html, body').stop().animate({
		'scrollTop': $target.offset().top
	})

});
	
// Show or hide the sticky footer button

var pxShow  = 500,         // height on which the button will show
fadeInTime  = 400,         // how slow/fast you want the button to show
fadeOutTime = 400,         // how slow/fast you want the button to hide
scrollSpeed = 300,         // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
goTopButton = $("#go-top")

$(window).on('scroll', function() {
	if ($(window).scrollTop() >= pxShow) {
		goTopButton.fadeIn(fadeInTime);
	} else {
		goTopButton.fadeOut(fadeOutTime);
	}
});

