/*
	the main code of the game, primarily drawing to the canvas
*/

var canvas = document.getElementById('game');
var game = canvas.getContext('2d');

function tick() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

setInterval(tick, 10);