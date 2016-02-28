$(document).ready(function() {

  var topBetsButton = $('#toggle-top-promises')[0];
  var friendsButton = $('#toggle-friends-promises')[0];
  var hideButton = $('#toggle-expired-promises')[0];
  friendsButton.checked = false;
  topBetsButton.checked = false;
  hideButton.checked = false;
  displayPromises('/all/promises');
  hideExpired();

  $('#toggle-expired-promises').click(function() {
    hideExpired();
  });

  $('#toggle-top-promises').click(function() {
    var url;
    if (this.checked && friendsButton.checked) {
      url = '/friends/top_bets/promises';
    } 
    else if (!this.checked && friendsButton.checked) {
      url = '/friends/promises';
    }
    else if (this.checked) {
      url = '/top_bets/promises';
    }
    else {
      url = '/all/promises';
    }
    displayPromises(url);
  });

  $('#toggle-friends-promises').click(function(){
    var url;
    if (this.checked && topBetsButton.checked) {
      url = '/friends/top_bets/promises';
    } 
    else if (!this.checked && topBetsButton.checked) {
      url = '/top_bets/promises';
    }
    else if (this.checked) {
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
                  var users = result["users"];
                  var promises = result["promises"];
                  var user = result["user"];
                  var bets = result["bets"];
                  // var myArray = [ 'people', 'food', 'cats', 'city', 'nature', 'abstract', 'fashion', 'animals', 'sports', 'technics', 'nightlife', 'business' ];
                  $('div.cards').empty();
                  var alt = "Logo image";
                  promises.forEach( function(promise) {
                    // var category = myArray[Math.floor(Math.random() * myArray.length)];
                    // var src = "http://www.gravatar.com/avatar/" + md5(email);
                    var nameImageAndUser = fullNameImageAndUser(users, promise);
                    var name = nameImageAndUser[0];
                    var src = nameImageAndUser[1];
                    var userOfThisPromise = nameImageAndUser[2];
                    var timeRemaining = hoursUntilExpired(promise.expires_at);
                    var content = promiseContent(promise.content);
                    var card = addClassCardExpired(timeRemaining);
                    createCard(promise, card, name, timeRemaining, content, src, alt, user, bets, userOfThisPromise, promises);
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

  function fullNameImageAndUser(users, promise) {
    var nameImageUserArray = [];
    users.forEach( function(user) {
      if (promise.user_id == user.id) {
        nameImageUserArray.push(user.first_name + " " + user.last_name);
        nameImageUserArray.push("http://www.gravatar.com/avatar/"+user.email_hash+"?s=250&d=retro");
        nameImageUserArray.push(user);
      }
    });
    return(nameImageUserArray);
  }

  function totalPromisesKeptByThisPromiseUser(promises, userOfThisPromise) {
    var count = 0;
    promises.forEach(function(promise) {
      if (promise.user_id == userOfThisPromise.id && promise.validated) {
        count++;
      }
    });
    return(count);
  }

  function totalPromisesBrokenByThisPromiseUser(promises, userOfThisPromise) {
    var count = 0;
    promises.forEach(function(promise) {
      if (promise.user_id == userOfThisPromise.id && !promise.validated) {
        count++;
      }
    });
    return(count);
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

  function alreadyBet(user, bets, promise) {
    var checkBet = null;
    bets.forEach(function(bet) {
      if (bet.user_id == user.id && bet.promise_id == promise.id) {
        checkBet = bet;
        console.log
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

  function createCard(promise, card, name, timeRemaining, content, src, alt, user, bets, userOfThisPromise, promises) {

    var lastParagraph, currentUser;
    var usersForThePromise = totalUsersBetForPromise(promise, bets);
    var usersAgainstThePromise = totalUsersBetAgainstPromise(promise, bets);
    var bet = alreadyBet(user, bets, promise);
    var inFavour = "";

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
        if (bet != null && bet.in_favour) {
          inFavour = "will keep their promise!";
        }
        else if (bet != null && !bet.in_favour) {
          inFavour = "will screw-up!";
        }
        if (bet != null) {
          lastParagraph = $('<div>')
                          .addClass('promise-content')
                          .append($('<p>')
                            .text("You bet "+bet.bet_value+"pts that "+name+" "+inFavour));
        }
        else {
          lastParagraph = $('<div>')
                          .addClass('modal')
                          .append($('<label>')
                            .attr("for", "modal-2")
                            .append($('<div>')
                              .addClass("modal-trigger")
                              .text("Make a Bet!")))
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
                                .append($('<input>')
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
    .append($('<div>')
      .addClass('card-stats')
      .append($('<div>')
        .addClass('stat-box')
        .append($('<p>')
          .addClass("stat-title")
          .text("Promises"))
        .append($('<p>')
          .addClass("stat-success")
          .text("Kept : "+totalPromisesKeptByThisPromiseUser(promises, userOfThisPromise)))
        .append($('<p>')
          .addClass("stat-error")
          .text("Broken : "+totalPromisesBrokenByThisPromiseUser(promises, userOfThisPromise))))
      .append($('<div>')
        .addClass('stat-box')
        .append($('<p>')
          .addClass("stat-title")
          .text("Bets"))
        .append($('<p>')
          .addClass("stat-success")
          .text("For : "+totalUsersBetForPromise(promise, bets)))
        .append($('<p>')
          .addClass("stat-error")
          .text("Against : "+totalUsersBetAgainstPromise(promise, bets)))))
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