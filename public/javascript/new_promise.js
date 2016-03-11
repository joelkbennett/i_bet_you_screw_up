$(document).ready(function() {

  if ($('.flash-error-new-promise')) {
    $('.flash-error-new-promise').remove();
  }
  if ($('.flash-success-new-promise')) {
    $('.flash-success-new-promise').remove();
  }

  $('#new-promise').click(function(e) {
    if ($('.flash-error-new-promise')) {
      $('.flash-error-new-promise').remove();
    }
    if ($('.flash-success-new-promise')) {
      $('.flash-success-new-promise').remove();
    }
    e.preventDefault();
      var url = '/promises/new';
      var promiseContent = $('#promise-text').val();
      var expiresAt = $('#promise-date').val();
      $.ajax({ 
          url: url,
          method: 'POST',
          data: { content: promiseContent, expires_at: expiresAt }
      }).done(function(result) {
        var error_message = result["error_message"];
        if (error_message) {  
          $('.new-promise')
          .prepend(
            $('<div>')
            .addClass("flash-error-new-promise")
            .text(error_message));
        }
        else {

          $('#promise-text').val('');
          $('#promise-date').val('');
          var success_message = result["success_message"];
          var user = result["user"];
          var promisesBroken = result["promises_broken"];
          var promisesKept = result["promises_kept"];
          var promise = result["promise"];
          var name = result["name"];
          var timeRemaining = result["time_remaining"];
          $('.new-promise')
          .prepend(
            $('<div>')
            .addClass("flash-success-new-promise")
            .text(success_message));
          var newCard = createNewCard(name, user, promisesBroken, promisesKept, promise, timeRemaining);

          $('div.cards').prepend(newCard);
        }
      });
  });

  function createNewCard(name, user, promisesBroken, promisesKept, promise, timeRemaining) {
    var card = $('<div>').addClass('card');
    $('<div>')
    .addClass('card-header')
    .addClass('promise-card-header')
    .append($('<img>')
      .addClass('profile-image')
      .addClass('profile-image-small')
      .attr("src", "http://www.gravatar.com/avatar/"+user.email_hash+"?s=250&d=retro")
      .attr("alt", "Logo image"))
    .append($('<a>')
      .attr("href", 'promises/'+promise.id)
      .text(name+" promised:"))
    .append($('<p>')
      .text(promiseContent(promise.content)))
    .append($('<div>')
      .addClass('card-stats')
      .append($('<div>')
        .addClass('stat-box')
        .append($('<p>')
          .addClass("stat-title")
          .text("Promises"))
        .append($('<p>')
          .addClass("stat-success")
          .text("Kept : "+promisesKept))
        .append($('<p>')
          .addClass("stat-error")
          .text("Broken : "+promisesBroken)))
      .append($('<div>')
        .addClass('stat-box')
        .append($('<p>')
          .addClass("stat-title")
          .text("Bets"))
        .append($('<p>')
          .addClass("stat-success")
          .text("For : 0"))
        .append($('<p>')
          .addClass("stat-error")
          .text("Against : 0"))))
    .appendTo(card);
    $('<div>')
    .addClass('card-copy')
    .append($('<p>')
      .addClass('promise-detail')
      .text(timeRemaining))
    .append($('<div>')
            .addClass('modal')
            .append($('<label>')
              .attr("for", "modal-1")
              .append($('<div>')
                  .addClass("flash-alert")
                  .append($('<div>')
                    .addClass("modal-trigger")
                    .text("Validate your promise!"))))
            .append($('<input>')
              .addClass("modal-state")
              .attr("id", "modal-1")
              .attr("type", "checkbox"))
            .append($('<div>')
              .addClass("modal-fade-screen")
              .append($('<div>')
                .addClass("modal-inner")
                .append($('<div>')
                  .addClass("modal-close")
                  .attr("for", "modal-1"))
                .append($('<h1>')
                  .text("Did you keep your promise?"))
                .append($('<form>')
                  .attr("method", "post")
                  .attr("action", "/promises/"+promise.id+"/validate")
                  .append($('<input>')
                    .addClass("verify-promise")
                    .attr("type", "submit")
                    .attr("name", "yes")
                    .val("Promise Kept"))
                  .append($('<input>')
                    .addClass("verify-promise")
                    .attr("type", "submit")
                    .attr("name", "no")
                    .val("Promise Not Kept"))))))
    .appendTo(card);
    return(card);
  }

  function promiseContent(content) {
    var new_content = "";
    if (content.length > 30) {
      for (var i = 0; i < 30; i++) {
        new_content += content[i];
      } 
    }
    else {
      new_content = content;
    }
    return(new_content);
  }

});