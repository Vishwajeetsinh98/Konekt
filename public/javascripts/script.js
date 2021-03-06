$(document).ready(function(){
  $('#index-left p').hide();
  $('#index-left').hover(function(){
    $('#index-left img').css({
      'transform': 'scale(0.8)',
      'transition': '0.3s'
    });
    $('#index-left p').fadeIn(1000)
  });
  $('#index-left').mouseleave(function(){
    $('#index-left img').css({
      'transform': 'scale(1.0)',
      'transition': '0.3s'
    })
    $('#index-left p').fadeOut(1000)
  });
  $('select').material_select();
  if($('#flash').val() != null){
    Materialize.toast($('#flash').val(), 3000);
  }
  $(".button-collapse").sideNav();
  $('.comments-trigger').click(function(){
    $('#comments-modal').openModal();
  })
  $('.chat-trigger').click(function(){
    $('#chat-modal').openModal();
  })
  $('#changepp-trigger').click(function(){
    $('#changepp-modal').openModal();
  });
  $('#changecover-trigger').click(function(){
    $('#changecover-modal').openModal();
  });
  $('#message-trigger').click(function(){
    $('#message-modal').openModal();
  })
})
