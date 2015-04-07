var addMessageToDOM = function(message) {
  var $wrapper = $('<div></div>');
  $wrapper.addClass('messageWrapper');
  var $username = $('<div></div>');
  $username.html(message.username);
  $username.addClass('username');
  $username.appendTo($wrapper);
  var $text = $('<div></div>');
  $text.html((message.text || '').replace(/</g, "&lt;"));
  $text.addClass('messageText');
  $text.appendTo($wrapper);
  $('#chats').append($wrapper);
};

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',

  init: function() {
    app.clearMessages();

  },

  send: function(message) {
    $.ajax({
      url: app.server,
      headers: {'X-Parse-Application-Id': "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r", "X-Parse-REST-API-Key": "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf"},
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(message),
      success: function (data, status, jqXHR) {
        // if (jqXHR.status === 201){
        //   addMessageToDOM(message);
        // }
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
        console.error(data);
      }
    });
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // debugger;
        app.clearMessages();
        if (data.results) {
          _.each(data.results, function(message){
            addMessageToDOM(message);
          });
        }
        console.table(data.results);
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  clearMessages: function() {
    $('#chats').html('');
  },

  addMessage: function(message) {
    addMessageToDOM(message);
  }
};

app.addMessage({
          username: 'Mel Brooks',
          text: 'Never underestimate the power of the Schwartz!',
          roomname: 'lobby'
        });
// app.fetch();
// setInterval(app.fetch, 5000);

