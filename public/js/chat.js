

jQuery(document).ready(function($) {
	// var socket = io('http://localhost:1337');
	var socket = io.connect('http://localhost:3000',  {
		reconnect: false
	});
	var form = $(document.forms['chat-form']);
	var input = $( "input[name$='messange']" );
	var chatBody = $('.chat');
	var typingContainer = $('.typing_container');
	var typing = false;
	var lastTypingTime;
	var TYPING_TIMER_LENGTH = 400; 




	// on meessange (MESSANGE RECEIVED)
	socket
	.on('message', function (data) {
		console.log('data', data);	
		printMessange(data.text, data.user.name, data.created);
	})
	.on('leave', function(username) {
		printStatus(username + " exit chat", "info");
	})
	.on('join', function(username) {
		printStatus(username + " entered chat", "info");
	})
	.on('typing', function(username) {
		addTypingMsg(username);
	})
	.on('stop typing', function (username) {
		removeTypingMsg(username);
	})
	.on('connect', function() {
		console.log('form', form);
		printStatus("соединение установлено", "success");
		form.on('submit', sendMessage);
		input.on('input', function() {
			updateTyping();
		});
	})
	.on('disconnect', function() {
		printStatus("соединение потеряно", "danger");
		form.off('submit', sendMessage);
		setTimeout(reconnect, 500);
	})
	.on('logout', function() {
		location.href = "/";
	})
	.on('reconnect_failed', function () {
		printStatus("соединение потеряно навсегда", "danger");
	})
	.on('connect_error', function (e) {
		console.log(e);
	});


	function updateTyping () {
		if (!typing) {
			typing = true;
			socket.emit('typing');
		}
		lastTypingTime = (new Date()).getTime();
		
		setTimeout(function () {
			var typingTimer = (new Date()).getTime();
			var timeDiff = typingTimer - lastTypingTime;
			if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
				socket.emit('stop typing');
				typing = false;
			}
		}, TYPING_TIMER_LENGTH);
	}

	// on form submit (SEND MESSANGE)
	function sendMessage () {
		var input = $(this.elements.messange);
		var msg = input.val();
		input.val('');
		if (msg === '')return;

		socket.emit('message', msg, function() {
			printMessange(msg, 'me', new Date());
		});
		return false;
	}


	function reconnect() {
		socket.once('error', function() {
			setTimeout(reconnect, 500);
		});
		socket.connect();
	}


	function printMessange (text, author, time) {
		var imageSrc = (author === 'me') ? 'images/me.png' : 'images/you.png';

		$('<li>').addClass('left clearfix')
		.append($('<span>').addClass('chat-img pull-left')
			.append($('<img>', {src: imageSrc}).addClass('img-circle')))
		.append($('<div>').addClass('chat-body clearfix')
			.append($('<div>').addClass('header')
				.append($('<strong>').addClass('header').text(author))
				.append($('<small>').addClass('pull-right text-muted').text(time)
					.append($('<span>').addClass('glyphicon glyphicon-time')))
				.append($('<p>').text(text))))
		.appendTo(chatBody);
	}

	function printStatus (msg, status) {
		$('<div>', {text: msg, role: "alert"})
		.addClass('alert alert-'+ status)
		.appendTo(chatBody);
	}
	function addTypingMsg (name) {
		$('<div>', {text: name + ' is typing...'})
		.addClass('typing-message')
		.attr('data-name', name)
		.appendTo(typingContainer);
	}
	function removeTypingMsg (name) {
		var msg = typingContainer.find("div[data-name='" + name +"']");
		msg.remove();
	}
});
