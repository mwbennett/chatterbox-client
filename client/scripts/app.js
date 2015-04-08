var addMessageToDOM = function(message) {
  var $wrapper = $('<div></div>');
  $wrapper.addClass('messageWrapper');
  $wrapper.attr('data-roomname', message.roomname);
  var $username = $('<div></div>');
  var $anchor = $('<a href="#">');
  $anchor.text(message.username);
  $anchor.appendTo($username);
  $username.addClass('username');
  $username.appendTo($wrapper);
  var $text = $('<div></div>');
  $text.text(message.text);
  $text.addClass('messageText');
  $text.appendTo($wrapper);
  app.$chats.append($wrapper);
};

var app = {
  username: 'anonymous',
  room: 'lobby',
  server: 'https://api.parse.com/1/classes/chatterbox',

  init: function() {
    // Initialize variables
    app._rooms = {};
    app._friends = {};
    app.username = window.location.search.substr(10);

    // selectors
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$friendSelect = $('#friendSelect');
    app.$message = $('#message');

    // event listeners
    app.$chats.on('click', '.username', function(){
      app.addFriend($(this).text());
    });

    $('.submit').on('submit', function(e){
      e.preventDefault();
      app.handleSubmit();
      app.$message.val('');
    });

    app.$roomSelect.on('click', '.roomname', function(){
      var selectedRoom = $(this).text();
      app.room = selectedRoom;
      app.filterByRoom(selectedRoom);
      $('#main .title').text('chatterbox > ' + $(this).text());
    });

    $('#allRooms').on('click', function(){
      app.room = 'lobby';
      app.fetch();
      $('#main .title').text('chatterbox');
    });

    // initiate fetch
    app.fetch();
    // setInterval for fetch
    // setInterval(app.fetch, 5000);
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(message),
      success: function (data, status, jqXHR) {
        if (jqXHR.status === 201){
          // addMessageToDOM(message);
          // app.fetch();
        }
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
      data: {order: '-createdAt'},
      success: function (data) {
        app.clearMessages();
        app._rooms = {};
        app.clearRooms();
        console.table(data.results);
        if (data.results) {
          _.each(data.results, function(message){
            app._rooms[message.roomname] = message.roomname;
            addMessageToDOM(message);
          });
        }
        _.each(app._rooms, function(room){
          app.addRoom(room);
        });
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  clearRooms: function() {
    $('.roomname').remove();
  },

  addMessage: function(message) {
    addMessageToDOM(message);
  },

  addRoom: function(room) {
    var $wrapper = $('<div>');
    var $room = $('<div class="roomname">');
    var $anchor = $('<a href="#">');
    $anchor.text(room);
    $anchor.appendTo($room);
    $room.appendTo($wrapper);
    $wrapper.appendTo(app.$roomSelect);
  },

  addFriend: function(friend){
    if (!app._friends[friend]) {
      var $wrapper = $('<div>');
      var $friend = $('<div class="friend">');
      var $anchor = $('<a href="#">');
      $anchor.text(friend);
      $anchor.appendTo($friend);
      $friend.appendTo($wrapper);
      $wrapper.appendTo(app.$friendSelect);
    }
    app._friends[friend] = friend;
    var $usernames = $('.username');
    $usernames.filter(function(i, e){
      return _.contains(app._friends, $(e).text());
    }).parent().css('font-weight', 'bold');
  },

  handleSubmit: function(){
    // var message = {
    //   username: app.username,
    //   text: app.$message.val(),
    //   roomname: app.room
    // };
    // app.send(message);
  },

  filterByRoom: function(roomname){
    $('.messageWrapper').show();
    $('.messageWrapper[data-roomname!="' + roomname + '"]').hide();
  }
};

$(function() {
  app.init();
});

