//menu
$(function (){
  var $body = $('body');
  $('.trg-menu-button').click(function(){
    $body.toggleClass('hide-side-menu');
  });

  $('.trg-menu__label').click(function(){
    var $submenu = $(this).parent();
    console.log($submenu,$submenu.hasClass('trg-menu__submenu-wrapper--expanded'));
    if(!$submenu.hasClass('trg-menu__submenu-wrapper--expanded'))
    {
      console.log($submenu.closest('.trg-menu__list'),$submenu.closest('.trg-menu__list').find('.trg-menu__submenu-wrapper--expanded'));
      $submenu.closest('.trg-menu__list').find('.trg-menu__submenu-wrapper--expanded').removeClass('trg-menu__submenu-wrapper--expanded');
    }
    $submenu.toggleClass('trg-menu__submenu-wrapper--expanded')
  });
});
