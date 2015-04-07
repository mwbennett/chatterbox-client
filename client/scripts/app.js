var addMessageToDOM = function(message) {
  var $wrapper = $('<div></div>');
  $wrapper.addClass('messageWrapper');
  $wrapper.attr('data-roomname', message.roomname);
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
    // app.clearMessages();

  },

  send: function(message) {
    $.ajax({
      url: app.server,
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
            app._rooms[message.roomname] = message.roomname;
            addMessageToDOM(message);
          });
        }
        _.each(app._rooms, function(room){
          app.addRoom(room);
        });
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
  },

  addRoom: function(room) {
    var $wrapper = $('<div>');
    var $room = $('<div class="roomname">');
    $room.html(room);
    $room.appendTo($wrapper);
    $wrapper.appendTo('#roomSelect');
  },

  addFriend: function(){
  },

  handleSubmit: function(){

  },

  _rooms: {},

  filterByRoom: function(roomname){
    $('.messageWrapper').show();
    $('.messageWrapper[data-roomname!="' + roomname + '"]').hide();
  }
};

$(function() {
  $('#chats').on('click', '.username', function(){
    app.addFriend();
  });
  $('.submit').on('submit', function(e){
    e.preventDefault();
    app.handleSubmit();
  });
  $('#roomSelect').on('click', '.roomname', function(){
    app.filterByRoom($(this).text());
  })
});


// app.fetch();
// setInterval(app.fetch, 5000);

