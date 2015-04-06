// YOUR CODE HERE:
$(function(){
  $.ajax({
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'GET',
  contentType: 'application/json',
  success: function (data) {
    // debugger;
    if (data.results){
      _.each(data.results, function(message){
        var $wrapper = $('<div></div>');
        $wrapper.addClass('messageWrapper');
        var $username = $('<div></div>');
        $username.html(message.username);
        $username.addClass('username');
        $username.appendTo($wrapper);
        var $text = $('<div></div>');
        $text.html(message.text);
        $text.addClass('messageText');
        $text.appendTo($wrapper);
        $('#main').append($wrapper);
      });
    }
    console.log(data);
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
  });
});
