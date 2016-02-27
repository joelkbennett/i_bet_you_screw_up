$(document).ready(function() {

  $('.cards div.card-expired').hide();

  $('#toggle-expired-promises').click(function() {
    $('.cards div.card-expired').toggle();
  });

  $('#toggle-friends-promises').click(function(){

    if (this.checked) {
      $.ajax({
          url: '/friends/promises',
          type: 'GET',
          success: function(result) {
            var friends = result[0];
            var promises = result[1];
            $('div.cards').empty();
            var src = "http://placehold.it/400x400";
            var alt = "Logo image";
            promises.forEach( function(promise) {
              var name = fullName(friends, promise);
              var timeRemaining = hoursUntilExpired(promise.expires_at);
              var card = addClassCardExpired(timeRemaining);
              createCard(promise, card, name, timeRemaining, src, alt);
          });
        }
      });
    }
    else {
      $.ajax({
          url: '/all/promises',
          type: 'GET',
          success: function(result) {
            var users = result[0];
            var promises = result[1];
            $('div.cards').empty();
            var src = "http://placehold.it/400x400";
            var alt = "Logo image";
            promises.forEach( function(promise) {
              var name = fullName(users, promise);
              var timeRemaining = hoursUntilExpired(promise.expires_at);
              var card = addClassCardExpired(timeRemaining);
              createCard(promise, card, name, timeRemaining, src, alt);
          });
        }
      }); 
    }
  });

  function hoursUntilExpired(expires_at) {
    var today = new Date();
    var time_difference = (Date.parse(expires_at) - today) + 28800000
    console.log(Date.parse(expires_at) - today);
    var hours = (time_difference / (1000 * 60 * 60));
    var minutes = (time_difference / (1000 * 60));
    if (hours >= 1)
      return("Expires in " + Math.ceil(hours) +" hours!");
    else if (minutes >= 1)
      return("Expires in " + Math.ceil(minutes) +" minutes!");
    else if (time_difference > 0)
      return("Expires in " + Math.ceil(time_difference) +" seconds!");
    else  
      return("Expired!");
  }

  function addClassCardExpired(time_remaining) {
    var cards = $('div.cards');
    if (time_remaining == "Expired!") {
      return($('<div>').addClass('card').addClass('card-expired').appendTo(cards));
    }
    else {
      return($('<div>').addClass('card').appendTo(cards));
    }
  }

  function fullName(friends, promise) {
    var name;
    friends.forEach( function(friend) {
      if (promise.user_id == friend.id) {
        name = friend.first_name + " " + friend.last_name;
      }
    });
    return(name);
  }

  function createCard(promise, card, name, timeRemaining, src, alt) {
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
      .text(timeRemaining))
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
  }

});