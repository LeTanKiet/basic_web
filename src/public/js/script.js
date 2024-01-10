(function ($) {
  'use strict';

  var searchPopup = function () {
    // Open search box
    $('#navbar').on('click', '.search-button', function (e) {
      $('.search-popup').toggleClass('is-visible');
    });

    $('#navbar').on('click', '.btn-close-search', function (e) {
      $('.search-popup').toggleClass('is-visible');
    });

    $('.search-popup-trigger').on('click', function (b) {
      b.preventDefault();
      $('.search-popup').addClass('is-visible'),
        setTimeout(function () {
          $('.search-popup').find('#search-popup').focus();
        }, 350);
    }),
      $('.search-popup').on('click', function (b) {
        $(b.target).is('.search-popup') && (b.preventDefault(), $(this).removeClass('is-visible'));
      }),
      $(document).keyup(function (b) {
        '27' === b.which && $('.search-popup').removeClass('is-visible');
      });
  };

  $(document).ready(function () {
    searchPopup();
  }); // End of a document ready
})(jQuery);
