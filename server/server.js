var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/../client'));

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/../client/index.html');
// });
var settings = {
	walkAcc: 5,
	walkDec: 5,
	walkVelMax: 6,
	// walkVelMax: 3,
}	

var sockets = {};

var data = {
	players: {},
	poops: []	
}

var playerChanges = [];

io.on('connection', function(socket) { 
	console.log("new user");

	playerJoin(socket);
	loadWorld(socket);
	// playeMovement(socket);

	socket.on('disconnect', function() {
		removePlayer(socket.id);
		console.log("new user left");
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function removePlayer(id) {
	delete sockets[id];
	delete data.players[id];
}

function initWorld(data) {
	
}



function createPlayer(id, name) {
	function controller() {
		var controls = {
			isDown: false,
			isUp: true,
			keyPress: undefined,
			keyReleased: undefined,
		}
		return controls;
	}
	var player = {
		id: id,
		name: name,
		x: 0, 
		y: 0, 
		vx: 0,
		vy: 0,
		controls: { 
			left: controller(),
			right: controller()
		}
	}
	return player;
}



function playerJoin(socket) {
	socket.on('player join', function(name) {
		sockets[socket.id] = socket;
		var player = createPlayer(socket.id);
		data.players[player.id] = player;
	});
}

function loadWorld(socket) {
	socket.on('assets loaded', function() {
		socket.emit('load world', data);
	});

	socket.on('world loaded', function() {
		gameStart();
	})
	playerMovement(socket);

}

function playerMovement(socket) {
	var walkAcc = settings.walkAcc;
	var walkDec = settings.walkDec;
	var walkVelMax = settings.walkVelMax;

	socket.on("left down", function() {
		var player = data.players[socket.id];
		var controller = player.controls;
		console.log("left down; " + player.vx);

		if (player.vx >= -walkVelMax) {
			// data.players[socket.id].vx -= walkAcc;	
			data.players[socket.id].vx = -walkAcc;
		}
		
	});

	socket.on("left up", function() {
		var player = data.players[socket.id];
		console.log("left up");
		if (player.vx < 0) {
			// data.players[socket.id].vx += walkDec;	
			data.players[socket.id].vx = 0;
		}
	});

	socket.on("right down", function() {
		var player = data.players[socket.id];
		console.log("right down; " + player.vx);
		if (player.vx <= walkVelMax) {
			// data.players[socket.id].vx += walkAcc;	
			data.players[socket.id].vx = walkAcc;
		}	
	});

	socket.on("right up", function() {
		var player = data.players[socket.id];
		console.log("right up");
		if (player.vx > 0) {
			// data.players[socket.id].vx -= walkDec;
			data.players[socket.id].vx = 0	
		}
	});
}


function gameLoop() {

}

function moveLoop() {
	// console.log("move loop");
	for (var id in data.players) {
		data.players[id].x += data.players[id].vx;
		data.players[id].y += data.players[id].vy;
	}
	io.emit('run', data);
}

function gameStart() {
	setInterval(moveLoop, 1000 / 100);
	setInterval(gameLoop, 1000);
}


