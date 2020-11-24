

$(document).ready(function () {
  $("#tweet-text").on('change keyup paste', function () {
    const counter = $(this).next().children()[1];
    counter.value = 140 - $(this).val().length;

    if (counter.value < 0) {
      $(counter).css("color", "red");

    } else {
      $(counter).css("color", "#545149");

    }
  });
});