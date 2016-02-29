// Menu toggle

$(document).ready(function() {
  var menuToggle = $('#js-mobile-menu').unbind();
  $('#js-navigation-menu').removeClass("show");

  menuToggle.on('click', function(e) {
    e.preventDefault();
    $('#js-navigation-menu').slideToggle(function(){
      if($('#js-navigation-menu').is(':hidden')) {
        $('#js-navigation-menu').removeAttr('style');
      }
    });
  });
});

// tabs

$(function () {
  $('.accordion-tabs').each(function(index) {
    $(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
  });

  $('.accordion-tabs').on('click', 'li > a.tab-link', function(event) {
    if (!$(this).hasClass('is-active')) {
      event.preventDefault();
      var accordionTabs = $(this).closest('.accordion-tabs');
      accordionTabs.find('.is-open').removeClass('is-open').hide();

      $(this).next().toggleClass('is-open').toggle();
      accordionTabs.find('.is-active').removeClass('is-active');
      $(this).addClass('is-active');
    } else {
      event.preventDefault();
    }
  });
});

// vertical tabs

$(".js-vertical-tab-content").hide();
$(".js-vertical-tab-content:first").show();

/* if in tab mode */
$(".js-vertical-tab").click(function(event) {
  event.preventDefault();

  $(".js-vertical-tab-content").hide();
  var activeTab = $(this).attr("rel");
  $("#"+activeTab).show();

  $(".js-vertical-tab").removeClass("is-active");
  $(this).addClass("is-active");

  $(".js-vertical-tab-accordion-heading").removeClass("is-active");
  $(".js-vertical-tab-accordion-heading[rel^='"+activeTab+"']").addClass("is-active");
});

/* if in accordion mode */
$(".js-vertical-tab-accordion-heading").click(function(event) {
  event.preventDefault();

  $(".js-vertical-tab-content").hide();
  var accordion_activeTab = $(this).attr("rel");
  $("#"+accordion_activeTab).show();

  $(".js-vertical-tab-accordion-heading").removeClass("is-active");
  $(this).addClass("is-active");

  $(".js-vertical-tab").removeClass("is-active");
  $(".js-vertical-tab[rel^='"+accordion_activeTab+"']").addClass("is-active");
});


// modal

$(function() {
  $("#modal-1, #modal-2").on("change", function() {
    console.log('modal-1')
    if ($(this).is(":checked")) {
      $("body").addClass("modal-open");
    } else {
      $("body").removeClass("modal-open");
    }
  });

  $(".modal-fade-screen, .modal-close").on("click", function() {
    console.log('test')
    $(".modal-state:checked").prop("checked", false).change();
  });

  $(".modal-inner").on("click", function(e) {
    e.stopPropagation();
  });
});


// Show potential winnings when making a bet

(function() {
  var bet = $('.place_bet');
  var keptWinnings = $('#kept-winnings span');
  var brokenWinnings = $('#broken-winnings span');
  var kept = parseInt($('.promise-kept').data('promise'));
  var broken = parseInt($('.promise-broken').data('promise'));
  console.log(kept);
  console.log(broken);

  bet.on('keyup', function() {
    // var calculatedWin = 
    keptWinnings.text(Math.round((broken/kept) * parseInt(bet.val())));
    brokenWinnings.text(Math.round((kept/broken) * parseInt(bet.val())));
  });
  
})();

// comments

$(function() { 
  
  var commentForm = $('#new-comment');
  var commentsList = $('#comments');

  commentForm.submit(function(e) {
    e.preventDefault();
    var promiseId = commentForm.data("promise");
    var url = '/promises/' + promiseId + '/comment/new'
    var commentBody = commentForm.find('#comment-body').val();
    $.ajax({ 
        url: url,
        method: 'POST',
        data: { body: commentBody }
    }).done(function(res) {
        commentForm.find('#comment-body').val('');
        commentsList.prepend(appendComment(res));
    });
  });

  function appendComment(data) {
    commentEl =  "<div class='comment new_comment'>"
    commentEl += "<div class='comment-image'>"
    commentEl += "<img src='" + data.user_image + "' alt='User image'>"
    commentEl += "</div>"
    commentEl += "<div class='comment-content'>"
    commentEl += "<a href='/users/2'><h1>You added a new comment</h1></a>"
    commentEl += "<p>" + data.comment + "<p>"
    commentEl += "<p class='comment-detail'>Posted on: " + data.date + "</p>"
    commentEl += "</div>"
    commentEl += "</div>"
    return commentEl; 
  }
});

// Fade box

$(document).ready(function() {
  var element = document.getElementById("js-fadeInElement");
  $(element).addClass('js-fade-element-hide');

  $(window).scroll(function() {
    if( $("#js-fadeInElement").length > 0 ) {
      var elementTopToPageTop = $(element).offset().top;
      var windowTopToPageTop = $(window).scrollTop();
      var windowInnerHeight = window.innerHeight;
      var elementTopToWindowTop = elementTopToPageTop - windowTopToPageTop;
      var elementTopToWindowBottom = windowInnerHeight - elementTopToWindowTop;
      var distanceFromBottomToAppear = 300;

      if(elementTopToWindowBottom > distanceFromBottomToAppear) {
        $(element).addClass('js-fade-element-show');
      }
      else if(elementTopToWindowBottom < 0) {
        $(element).removeClass('js-fade-element-show');
        $(element).addClass('js-fade-element-hide');
      }
    }
  });
});

// remove flash message

$(function() { 
  
  var messages = $('.flash')

  messages.find('.remove-flash').on('click', function(e) {
    var self = $(this);
    var noteId = self.data('id');
    self.parent('.flash').fadeOut();
    e.preventDefault();
    $.ajax({ 
        url: '/remove_notification',
        method: 'POST',
        data: { id: noteId }
    })
  });
});