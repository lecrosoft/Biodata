jQuery(document).ready(function($){
	var $lateral_menu_trigger = $('#menu-trigger'),
		$content_wrapper = $('.main-content'),
		$navigation = $('header');

	//open-close lateral menu clicking on the menu icon
	$lateral_menu_trigger.on('click', function(event){
		event.preventDefault();

		$lateral_menu_trigger.toggleClass('is-clicked');
		$navigation.toggleClass('lateral-menu-is-open');
		$content_wrapper.toggleClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			// firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
			$('body').toggleClass('overflow-hidden');
		});
		$('#lateral-nav').toggleClass('lateral-menu-is-open');

		//check if transitions are not supported - i.e. in IE9
		if($('html').hasClass('no-csstransitions')) {
			$('body').toggleClass('overflow-hidden');
		}
	});

	//close lateral menu clicking outside the menu itself
	$content_wrapper.on('click', function(event){
		if( !$(event.target).is('#menu-trigger, #menu-trigger span') ) {
			$lateral_menu_trigger.removeClass('is-clicked');
			$navigation.removeClass('lateral-menu-is-open');
			$content_wrapper.removeClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').removeClass('overflow-hidden');
			});
			$('#lateral-nav').removeClass('lateral-menu-is-open');
			//check if transitions are not supported
			if($('html').hasClass('no-csstransitions')) {
				$('body').removeClass('overflow-hidden');
			}

		}
	});

	//open (or close) submenu items in the lateral menu. Close all the other open submenu items.
	$('.item-has-children').children('a').on('click', function(event){
		event.preventDefault();
		$(this).toggleClass('submenu-open').next('.sub-menu').slideToggle(200).end().parent('.item-has-children').siblings('.item-has-children').children('a').removeClass('submenu-open').next('.sub-menu').slideUp(200);
	});


	var current_page = window.location.href ;
	current_page = current_page.split('?')[0] ;
	current_page = current_page.split('/') ;
	current_page = current_page[current_page.length-1] ;
	current_page = current_page.split('#')[0] ;

	// console.log('current page', current_page);
	//let keys = Object.keys(page_links) ;
	$('#lateral-nav a[href="'+current_page+'"]').parents('.sub-menu').prev().trigger('click') ;

	// remove empty sub-menus and parent menu items with no child



let userlevel = $('#lateral-nav #userlevel').data('val').toString();
	// userlevel = userlevel;
let submenus = 	$('#lateral-nav .sub-menu');

// remove_dom($('#lateral-nav .sub-menu'),userlevel) ;
remove_dom($('#lateral-nav .item-has-children'),userlevel) ;

function remove_dom($elem,userlevel)
	{
	let access_level ;
	
	$elem.each(function(i){
	access_level = $(this).data('access-level') ;

	if(access_level != undefined )
		{
		access_level = access_level.toString() ;
		access_level = access_level.split(',') ;
		//	console.log(access_level,userlevel) ;
		// userlevel not in accepted list ;
		if(access_level.indexOf(userlevel) == -1)
			{
			$(this).remove() ;
			// console.log('removing')
			}
		}
	else
	 	{
		// console.log('left ') ;
		}
	})
}
});
