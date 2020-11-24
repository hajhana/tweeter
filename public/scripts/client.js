// calculate delay time between tweetes
let date_diff_indays = function (date1, date2) {
  dt1 = new Date(date1);
  dt2 = new Date(date2);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60*60*24));
}

// from the random helper in server; this is creating a tweet object
const createTweetElement = function (tweet) {
  const $tweet =
    `
  <article class="tweet">
      <header>
        <div class="left">
          <img class="profile-picture" src="${tweet.user.avatars}" alt="Profile Picture">
          <div>${tweet.user.name}</div>
        </div>
        <span class="handle">
          ${tweet.user.handle}
        </span>
      </header>
      ${($(`<div class="content">`).text(tweet.content.text)).prop('outerHTML')}
      <footer>
        <div>
          ${date_diff_indays(tweet.created_at, Date.now())} days ago posted
        </div>
        <div class="icons">
          <i class="fa fa-flag"></i>
          <i class="fa fa-retweet"></i>
          <i class="fa fa-heart"></i>
        </div>
      </footer>
    </article>
    `;
  return $tweet;
};

// Runner of tweet object creation
const renderTweets = function (tweets) {
  $('article.tweet').remove();

  tweets = tweets.reverse();

  for (tweet of tweets) {
    let $tweet = createTweetElement(tweet);
    $('.container').append($tweet);
  }
};

// loops through the tweets to render them all
let loadTweets = function () {
  $.get("/tweets", function (data) {
    $(document).ready(() => {
      renderTweets(data);
    });
  }, "json");
}

$(document).ready(function () {
  $(".new-tweet").hide();
  $(".error").hide();

  $('.submit-tweet').on('submit', function (event) {
    event.preventDefault();
    const data = $(this).serialize().slice(5);
    // Catching all kind of errors in tweets, long tweets and empty ones
    if (data === "" || data === null) {
      $(".error").show();
      $(".error-msg").text("Please write some text!");
      return false;
    } else if (unescape(data).length > 140) {
      $(".error").show();
      $(".error-msg").text("Too long, tweet twice!")
      $('#tweet-text').val('');
      return false;
    }
    $(".error").hide();
    $.post('/tweets', $(this).serialize(), function () {
      loadTweets();
      $('#tweet-text').val('');
      $('#tweet-text').change();
    })
  });

  $(".compose-btn").on("click", function (event) {
    if ($(".new-tweet").is(":hidden")) {
      $(".new-tweet").show('slow', function () {
        $("#tweet-text").focus();
      });
    } else {
      $(".new-tweet").hide('slow');
    }
  });

  loadTweets();
});