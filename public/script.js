// console.log("sdfs")

var canv, ctx, w, h;
var mousePressed = false;
var rad = 3;
var clrArr = ["#D72827","#F2461C","#EBC335","#30A135","#58C1DA","#2A12DA"];
var clr = '#fff';
var clrGuest = '#ba0055';

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
	socket = io.connect('http://localhost:3000');
	socket.on('mouseNoiseMove', serverMouseMove);
	socket.on('mouseNoiseDown', serverMouseDown);
	socket.on('mouseNoiseUp', serverMouseUp);
	socket.on('userAdded', serverAddedUser);
	// console.log("socket "+ socket);
}

function serverAddedUser(e){
	//update stats
	//e.total;
	//e.users;
}

function serverMouseMove(e){
	// console.log("client: doMouse called");
	console.log("client: doMouse called "+e.total+" "+clrArr.length );
	ctx.strokeStyle = clrArr[e.total%clrArr.length];
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
