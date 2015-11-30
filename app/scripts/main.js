//menu
$(function (){
 $('button').click(function(e){e.preventDefault();});
  function isNodeInRoot(node, root) {
    while (node) {
      if (node === root) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  }


  var $body = $('body');
  var $doc = $(document);

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


  var $facility = $('.trg-facility');
  var facilityMenu = $facility.find('.trg-facility__menu')[0];

  function closeFacilityMenu(e){
    console.log($(e.target),$(e.target).closest('.trg-facility').length);
    if($(e.target).closest('.trg-facility').length)return;

    $facility.removeClass('trg-facility__state-select');
    $doc.off('click',closeFacilityMenu);
  }

  $('.trg-facility__button').click(
    function(){
      console.log(1);
      $facility.addClass('trg-facility__state-select');
      $doc.on('click', closeFacilityMenu);
  });
});

$(function(){
    function getType(status){
        switch (status){
            case 1: return 4;
            case 2: return 2;
            case 3: return 3;
        }
    }

    var uiNotifications = $('.js-ui-notifications').data('notifications');
    uiNotifications.forEach(function(notification, index){setTimeout(function(){notie.alert(getType(notification.Status),notification.Message, notification.Duration);},index*1500)});
});
