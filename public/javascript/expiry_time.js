$(function () {

  $.ajax('/promises/expiry').done(function (times) { '/promises',
    times.forEach(function (element) {
        $('#detail-'+element[1]).text(element[0]);
        if (element[0] == 'Expired!') {
        $('#card-'+element[1]).addClass('card-expired');
      }
    });
  });
});