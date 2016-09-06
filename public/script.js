// console.log("sdfs")

var canv, ctx, w, h;
var mousePressed = false;
var rad = 0.25;
var clr = '#fff';
var color = "";
//
var socket;
//
init();

function init(){
	canv = document.getElementById("c");
	ctx = canv.getContext("2d");
	w = document.width;
	h = document.height;
	canv.width = 500;
	canv.height = 400;
	ctx.lineWidth = rad*2;
	ctx.fillStyle = ctx.strokeStyle = clr;
	
	initSocket();
	initEvents();
}

function initSocket(){
	socket = io.connect();
	// socket = io.connect('https://martian-socket.herokuapp.com:443');

	socket.on('connect', function(){
		socket.emit('colorRequest', 'name', function (data){
			// color = data;
			console.log("color should be:"+ data.color);
			color = data.color;
			updateStats(data);
		})
	})
	socket.on('mouseNoiseMove', serverMouseMove);
	socket.on('mouseNoiseDown', serverMouseDown);
	socket.on('mouseNoiseUp', serverMouseUp);
	socket.on('userAdded', serverAddedUser);
	// console.log("socket "+ socket);
}

function handleResponse(e){

}

function serverAddedUser(e){
	console.log("updatingStats because a user is here");
	//update stats
	updateStats(e);
	// e.total;
	// e.users;

}
function updateStats(e){
  ctx.clearRect(0, 0, 150, 50);
  ctx.fillStyle="#fff";
  ctx.font="9px sans-serif";
  var str1 = "active users: "+ e.users;
  var str2 = "total connections: "+ e.total;
  ctx.fillText(str1, 10, 10);
  ctx.fillText(str2, 10, 20);
  ctx.fillText("your color:", 10, 30);
  ctx.save();
  console.log(socket.id+" ||||| "+e.id);
  ctx.fillStyle = color;
  ctx.fillRect (56,25,40,6);
  ctx.restore();
}

function serverMouseMove(e){
	// console.log("client: doMouse called "+e.total+" "+e.color);
	// var num = e.position%clrArr.length;
	ctx.strokeStyle = e.color;
	// console.log("client: doMouse called: "+e.position);
	draw(e.x, e.y);
}
function serverMouseDown(e){
	ctx.beginPath();
	ctx.moveTo(e.x, e.y);
}
function serverMouseUp(e){

}

function initEvents(){
	canv.addEventListener("mousedown", doMouseDown, false);
	canv.addEventListener("mouseup", doMouseUp, false);
	canv.addEventListener("mousemove", doMouseMove, false);
	
}

function update(){
	//
	requestAnimationFrame(update);
}

function doMouseDown(e){
	e.preventDefault();
	var xpos = e.pageX;
	var ypos = e.pageY;
	mousePressed = true;
	ctx.beginPath();
	ctx.moveTo(e.pageX, e.pageY);
	var mpos = {x:xpos, y:ypos};
	socket.emit('mousedown', mpos);
}

function doMouseUp(e){
	e.preventDefault();
	mousePressed = false;
	socket.emit('mouseup');
}

function doMouseMove(e){
	e.preventDefault();
	var xpos = e.pageX;
	var ypos = e.pageY;

	if(mousePressed){
		var m = {x:xpos, y:ypos};
		socket.emit('mousemove', m);
		ctx.strokeStyle = clr;
		draw(xpos, ypos);
	}else{
		//
	}
}

function draw(x, y){
	ctx.lineTo(x,y);
	ctx.stroke();
	// ctx.arc(x, y, rad, 0, Math.PI*2);
	// ctx.fill();


}
