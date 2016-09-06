console.log("welcome to the server");

var userList = {
	totalCount:0,
	list:[]
};
initUsers(); 

var express = require('express');

var app = express();

var server = app.listen(process.env.PORT || 443, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at localhost:'+ port);
}

app.use(express.static('public'));



var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
	 console.log("new person: "+ socket.id);
	addUser(socket);
	socket.on('mousemove', doMouse);
	function doMouse(data){
		data.position = socket.position;
		data.total = userList.totalCount;
		// console.log("*mouseNoiseMove*"+ socket.position);
		socket.broadcast.emit('mouseNoiseMove', data);
	}

	socket.on('mousedown', doMouseDown);
	function doMouseDown(data){
		console.log("******mouseDown*");
		socket.broadcast.emit('mouseNoiseDown', data);
	}

	socket.on('mouseup', doMouseUp);
	function doMouseUp(data){
		console.log("******mouseUp*");
		socket.broadcast.emit('mouseNoiseUp', data);
	}

	socket.on('disconnect', doDisconnect);
	function doDisconnect(data){
		
		console.log("disconnected: "+socket.id);
		removeUser(socket);
	}

};


function initUsers(){
	userList.list = [];
}
function addUser(socket){
	var exists = 0;
	for (var i = 0; i < userList.list.length; i++) {
		if(userList.list[i].id==socket.id){
			exists++;
		}
	}
	if(exists==0){
		socket.position = userList.list.length;
		userList.list.push(socket);
		userList.totalCount++;
		console.log("adding user to position: "+socket.position);
		var data = {
			total: userList.totalCount,
			users: userList.list.length
		}
		socket.broadcast.emit('userAdded', data);
	}
}
//
function removeUser(socket){
	var i = userList.list.indexOf(socket);
	userList.list.splice(i,1);
	console.log("removing user at position: "+i);
	//TODO: fill the undefined array pos, or recycle the positoin color
}


