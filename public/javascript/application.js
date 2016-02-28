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

// Search filter

// var Filter = (function() {
//   function Filter(element) {
//     this._element = $(element);
//     this._optionsContainer = this._element.find(this.constructor.optionsContainerSelector);
//   }

//   Filter.selector = '.filter';
//   Filter.optionsContainerSelector = '> div';
//   Filter.hideOptionsClass = 'hide-options';

//   Filter.enhance = function() {
//     var klass = this;

//     return $(klass.selector).each(function() {
//       return new klass(this).enhance();
//     });
//   };

//   Filter.prototype.enhance = function() {
//     this._buildUI();
//     this._bindEvents();
//   };

//   Filter.prototype._buildUI = function() {
//     this._summaryElement = $('<label></label>').
//       addClass('summary').
//       attr('data-role', 'summary').
//       prependTo(this._optionsContainer);

//     this._clearSelectionButton = $('<button class=clear></button>').
//       text('Clear').
//       attr('type', 'button').
//       insertAfter(this._summaryElement);

//     this._optionsContainer.addClass(this.constructor.hideOptionsClass);
//     this._updateSummary();
//   };

//   Filter.prototype._bindEvents = function() {
//     var self = this;

//     this._summaryElement.click(function() {
//       self._toggleOptions();
//     });

//     this._clearSelectionButton.click(function() {
//       self._clearSelection();
//     });

//     this._checkboxes().change(function() {
//       self._updateSummary();
//     });

//     $('body').click(function(e) {
//       var inFilter = $(e.target).closest(self.constructor.selector).length > 0;

//       if (!inFilter) {
//         self._allOptionsContainers().addClass(self.constructor.hideOptionsClass);
//       }
//     });
//   };

//   Filter.prototype._toggleOptions = function() {
//     this._allOptionsContainers().
//       not(this._optionsContainer).
//       addClass(this.constructor.hideOptionsClass);

//     this._optionsContainer.toggleClass(this.constructor.hideOptionsClass);
//   };

//   Filter.prototype._updateSummary = function() {
//     var summary = 'All';
//     var checked = this._checkboxes().filter(':checked');

//     if (checked.length > 0 && checked.length < this._checkboxes().length) {
//       summary = this._labelsFor(checked).join(', ');
//     }

//     this._summaryElement.text(summary);
//   };

//   Filter.prototype._clearSelection = function() {
//     this._checkboxes().each(function() {
//       $(this).prop('checked', false);
//     });

//     this._updateSummary();
//   };

//   Filter.prototype._checkboxes = function() {
//     return this._element.find(':checkbox');
//   };

//   Filter.prototype._labelsFor = function(inputs) {
//     return inputs.map(function() {
//       var id = $(this).attr('id');
//       return $("label[for='" + id + "']").text();
//     }).get();
//   };

//   Filter.prototype._allOptionsContainers = function() {
//     return $(this.constructor.selector + " " + this.constructor.optionsContainerSelector);
//   };

//   return Filter;
// })();

// $(function() {
//   Filter.enhance();
// });

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

  bet.on('keyup', function() {
    var calculatedWin = 
    keptWinnings.text(Math.round((broken/kept) * parseInt(bet.val())));
    brokenWinnings.text(Math.round((kept/broken) * parseInt(bet.val())));
  });
  
})();

// comments

$(document).ready(function() { add_comment (); });

function add_comment() {
  var comment_form = $('#new-comment');
  var promise_id = comment_form.data("promise");
  var url = '/promises/' + promise_id + '/comment/new'
  
  $.post(url, 
    function(data) {
      $("#new-comment").html(data);
    },
    'text');
};

// $(function() { 
  
//   var comment_form = $('#new-comment');
//   var promise_id = comment_form.data("promise");
//   var url = '/promises/' + promise_id + '/comment/new'
//   var div = $('#new-comment');

//   comment_form.submit(function(ev) {

//     ev.preventDefault();

//     $.ajax(url, { method: 'POST', data: data}).done(function(res) {
//         console.log(res);
//       });
//   });
// });

