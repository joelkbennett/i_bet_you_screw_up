$(document).ready(function() {

  hideExpired();

  $('#toggle-expired-promises').click(function() {
    hideExpired();
  });

  $('#toggle-top-promises').click(function() {
    var url;
    $('#toggle-friends-promises').checked = false;
    if (this.checked) {
        url = '/top_bets/promises';
    } else {
        url = '/all/promises';
    }
    displayPromises(url);
  });

  $('#toggle-friends-promises').click(function(){
    var url;
    $('#toggle-top-promises').checked = false;
    if (this.checked) {
        url = '/friends/promises';
    } else {
        url = '/all/promises';
    } 
    displayPromises(url);
  });

  function displayPromises(url) {
    var params = {
        type: "GET",
        success: function (result) {
                  var users = result[0];
                  var promises = result[1];
                  var user = result[2];
                  var bets = result[3];
                  // var myArray = [ 'people', 'food', 'cats', 'city', 'nature', 'abstract', 'fashion', 'animals', 'sports', 'technics', 'nightlife', 'business' ];
                  $('div.cards').empty();
                  var alt = "Logo image";
                  promises.forEach( function(promise) {
                    // var category = myArray[Math.floor(Math.random() * myArray.length)];
                    // var src = "http://www.gravatar.com/avatar/" + md5(email);
                    var nameAndImage = fullNameAndImage(users, promise);
                    var name = nameAndImage[0];
                    var src = nameAndImage[1];
                    var timeRemaining = hoursUntilExpired(promise.expires_at);
                    var content = promiseContent(promise.content);
                    var card = addClassCardExpired(timeRemaining);
                    createCard(promise, card, name, timeRemaining, content, src, alt, user, bets);
                  });
                  hideExpired();
                }
    };
    params.url = url;
    $.ajax(params);
  }
 
  function hoursUntilExpired(expires_at) {
    var today = new Date();
    var time_difference = (Date.parse(expires_at) - today) + 28800000
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

  function fullNameAndImage(users, promise) {
    var nameImageArray = [];
    users.forEach( function(user) {
      if (promise.user_id == user.id) {
        nameImageArray.push(user.first_name + " " + user.last_name);
        nameImageArray.push("http://www.gravatar.com/avatar/"+user.email_hash+"?s=250&d=retro");
      }
    });
    return(nameImageArray);
  }

  function totalUsersBetForPromise(promise, bets){
    var count = 0;
    bets.forEach(function(bet) {
      if (bet.promise_id == promise.id && bet.in_favour == true) {
        count ++;
      }
    });
    return(count);
  }

  function totalUsersBetAgainstPromise(promise, bets){
    var count = 0;
    bets.forEach(function(bet) {
      if (bet.promise_id == promise.id && bet.in_favour == false) {
        count ++;
      }
    });
    return(count);
  }

  function alreadyBet(user, bets) {
    var checkBet = null;
    bets.forEach(function(bet) {
      if (bet.user_id == user.id && bet.promise_id == promise.id) {
        checkBet = bet;
      }
    });
    return(checkBet);
  }

  function isLoggedIn(user) {
    if (user) {
      return(true);
    }
    else {
      return(false);
    }
  }

  function isCurrentUserPromiseUser(promise, user) {
    if (promise.user_id == user.id) {
      return(true);
    }
    else {
      return(false);
    }
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

  function hideExpired() {
    var toggleExpired = $('#toggle-expired-promises');
    if (toggleExpired.is(':checked')) {
      $('.cards .card-expired').show();
    }
    else {
      $('.cards .card-expired').hide();
    }
  }

  function createCard(promise, card, name, timeRemaining, content, src, alt, user, bets) {

    var lastParagraph, currentUser;

    if (isLoggedIn(user)){
      currentUser = isCurrentUserPromiseUser(promise, user);
    }
    else {
      lastParagraph = $('<p>').text(" to place a bet!").append($('<a>').attr("href", '/').text("Login"));
    }

    if (timeRemaining == 'Expired!' || promise.validated != null) {
      if (promise.validated == true) {
        lastParagraph = $('<p>').addClass("flash-success").text("Promise Kept!");
      }
      else {
        if (currentUser) {
          lastParagraph = $('<p>').addClass("flash-error").text("You screwed up..");
        }
        else {
          lastParagraph = $('<p>').addClass("flash-error").text(name + " screwed up..");
        }
      }
    }
    else {
      if (promise.user_id == user.id) {
        lastParagraph = $('<div>')
                        .addClass('modal')
                        .append($('<label>')
                          .attr("for", "modal-1")
                          .append($('<div>')
                            .addClass("modal-trigger")
                            .text("Validate your promise!")))
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
                                .val("Promise Not Kept")))));
      }
      else {
        var bet = alreadyBet(user, bets, promise);
        var inFavour = "";
        if (bet.in_favour) {
          inFavour = "will keep their promise!";
        }
        else {
          inFavour = "will screw-up!";
        }
        if (bet != null) {
          lastParagraph = $('<div>')
                          .addClass('promise-content')
                          .append($('<p>')
                            .text("You bet "+bet.bet_value+"pts that "+name+" "+inFavour));
        }
        else {
          var usersForThePromise = totalUsersBetForPromise(promise, bets);
          var usersAgainstThePromise = totalUsersBetAgainstPromise(promise, bets);
          lastParagraph = $('<div>')
                          .addClass('modal')
                          .append($('<label>')
                            .attr("for", "modal-2")
                            .append($('<div>')
                              .addClass("modal-trigger")
                              .text("Validate your promise!")))
                          .append($('<input>')
                            .addClass("modal-state")
                            .attr("id", "modal-2")
                            .attr("type", "checkbox"))
                          .append($('<div>')
                            .addClass("modal-fade-screen")
                            .append($('<div>')
                              .addClass("modal-inner")
                              .append($('<div>')
                                .addClass("modal-close")
                                .attr("for", "modal-2"))
                              .append($('<h1>')
                                .text("Will "+name+" keep their promise?"))
                              .append($('<form>')
                                .attr("method", "post")
                                .attr("action", "/promises/"+promise.id+"/new_bet")
                                .append($('<input>')
                                  .addClass("place_bet")
                                  .attr("type", "text")
                                  .attr("name", "bet_value")
                                  .attr("placeholder", "Enter Bet Value")
                                  .attr("required", true)
                                  .attr("autofocus", true))
                                .append($('<input>')
                                  .addClass("place_bet")
                                  .attr("type", "submit")
                                  .attr("name", "in_favour")
                                  .val("Yes ("+usersForThePromise+")"))
                                .apend($('<input>')
                                  .addClass("place_bet")
                                  .attr("type", "submit")
                                  .attr("name", "not_in_favour")
                                  .val("Yes ("+usersAgainstThePromise+")")))));
        }
      }
    }
    $('<div>')
    .addClass('card-header')
    .addClass('promise-card-header')
    .append($('<img>')
      .addClass('profile-image')
      .addClass('profile-image-small')
      .attr("src", src)
      .attr("alt", alt))
    .append($('<a>')
      .attr("href", 'promises/'+promise.id)
      .text(name+" promised:"))
    .append($('<p>')
      .text(content))
    .appendTo(card);
    $('<div>')
    .addClass('card-copy')
    .append($('<p>')
      .addClass('promise-detail')
      .text(timeRemaining))
    .append(lastParagraph)
    .appendTo(card);
  }

});