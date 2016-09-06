console.log("welcome to the server");
var userList = {
	totalCount:0,
	list:[],
	colorArr: ["#666666","#D72827","#F2461C","#EBC335","#30A135","#58C1DA","#1A2A8F"]
};
initUsers(); 

var express = require('express');

var app = express();

var server = app.listen(process.env.PORT || 443, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at'+ host +" "+ port);
}

app.use(express.static('public'));



var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
	 // console.log("new person: "+ socket.id);
	addUser(socket);
	//
	socket.on('colorRequest', function (name, fn){
		var data = {
			total: userList.totalCount,
			users: userList.list.length,
			id: socket.id,
			color: socket.color
		}
		fn(data);
	});
	socket.on('mousemove', doMouse);
	socket.on('mousedown', doMouseDown);
	socket.on('mouseup', doMouseUp);
	socket.on('disconnect', doDisconnect);
	//
	function doMouse(data){
		data.position = socket.position;
		data.total = userList.totalCount;
		data.color = socket.color;
		// console.log("*mouseNoiseMove*"+ socket.position);
		socket.broadcast.emit('mouseNoiseMove', data);
	}

	function doMouseDown(data){
		// console.log("******mouseDown*");
		socket.broadcast.emit('mouseNoiseDown', data);
	}

	function doMouseUp(data){
		// console.log("******mouseUp*");
		socket.broadcast.emit('mouseNoiseUp', data);
	}

	function doDisconnect(data){
		
		// console.log("disconnected postion: "+socket.position);
		// console.log("disconnected: "+socket.id);
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
		var num = userList.totalCount%userList.colorArr.length;
		socket.color = userList.colorArr[num];
		// console.log(num+" socket.color = "+socket.color);
		console.log("added user to position: "+socket.position+ " totalConnections: "+userList.totalCount + " currentCount: "+userList.list.length+ " colorPos: "+num);
		var data = {
			total: userList.totalCount,
			users: userList.list.length,
			id: socket.id,
			color: socket.color
		}
		socket.broadcast.emit('userAdded', data);
	}
}
//
function removeUser(socket){
	var i = userList.list.indexOf(socket);
	userList.list.splice(i,1);
	console.log("removed user at position: "+i+" | userList.length is now: "+userList.list.length);
	//TODO: fill the undefined array pos, or recycle the positoin color
}


