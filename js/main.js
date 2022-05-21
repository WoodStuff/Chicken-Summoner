/*
	the main code of the game, primarily drawing to the canvas
*/

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

function tick() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

setInterval(tick, 10);

// every frame
function init() {
	// background
	ctx.fillStyle = '#101080';
	ctx.fillRect(0, 0, xtopixel(1), ytopixel(1));

	requestAnimationFrame(init);
}