/**
 * Essentially contains some code from factory.js, 
 */

function toggleNav (view) { // toggle navigation
    if (view === 'show') {
        $('div.toggleNav i').removeClass('fa-angle-down').addClass('fa-angle-up');
            $('div.optionNav').slideDown(1000);
                $('div.toggleNav').attr('data-view', 'hide');
    } else {
        $('div.toggleNav i').removeClass('fa-angle-up').addClass('fa-angle-down');
            $('div.optionNav').slideUp(1000);
                $('div.toggleNav').attr('data-view', 'show');
    }
} // toggle navigation

$(document).on('click', 'div.toggleNav', function() {
    var view = $(this).attr('data-view');
        toggleNav(view);
})