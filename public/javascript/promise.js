$(document).ready(function() {

  $('#toggle-expired-promises').click(function() {
    $('.cards div.card-expired').toggle();
  });

  $('#toggle-friends-promises').click(function(){
    $.ajax({
        url: '/friends/promises',
        type: 'GET',
        success: function(result) {
          debugger;
          $('div.cards').empty();
          var cards = $('div.cards');
          var src = "http://placehold.it/400x400";
          var alt = "Logo image";
          var today = new Date();
          result[1].forEach( function(promise) {
            var name = "";
            result[0].forEach( function(friend) {
              if (promise.user_id == friend.id) {
                name = friend.first_name + " " + friend.last_name;
              }
            });
            var hours_until_expired = (Date.parse(promise.expires_at) - today) + 2880000;
            if (promise.hours_until_expired < 0) {
              var card = $('<div>').addClass('card').addClass('card-expired').appendTo(cards);
            }
            else {
              var card = $('<div>').addClass('card').appendTo(cards);
            }
            $('<div>').addClass('card-image')
            .append($('<img>').attr("src", src).attr("alt", alt))
            .appendTo(card);
            $('<div>')
            .addClass('card-header')
            .append($('<a>').attr("href", 'promises/'+promise.id)
              .append($('<h1>').text(name+" has promised...")))
            .appendTo(card);
            $('<div>')
            .addClass('card-copy')
            .append($('<p>')
              .text(promise.content))
            .append($('<p>')
              .addClass('promise-detail')
              .text(hours_until_expired))
            .append($('<p>')
              .addClass('button')
              .addClass('button-default')
              .addClass('card-button')
              .attr("href",'#')
              .text('Quick Wager'))
            .append($('<br>'))
            .append($('<br>'))
            .append($('<p>')
              .addClass('button')
              .addClass('button-default')
              .addClass('card-button')
              .attr("href",'promises/'+promise.id)
              .text('Details'))
            .appendTo(card);
        });
      }
    });
  });
});
