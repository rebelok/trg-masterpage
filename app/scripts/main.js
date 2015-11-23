//menu
$(function (){
  var $body = $('body');
  $('.trg-menu-button').click(function(){
    $body.toggleClass('hide-side-menu');
  });

  $('.trg-menu__label').click(function(){
    $(this).parent().toggleClass('trg-menu__submenu-wrapper--expanded')
  });
});
