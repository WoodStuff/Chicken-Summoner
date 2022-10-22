/*
	the main code of the game, primarily drawing to the canvas
*/

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

// Timer. Use this for speedrunning! ~ Quitin
timerfull = 0;
timer = Math.floor(timerfull*100)/100;

let l, r, jump, resetPending, nextLevelPending; // abbreviations for left and right

function setup() {
	tick(); // so the game won't randomly be bigger for a frame
	setInterval(tick, 100/6);
	init();
}

// every frame, runs 60 fps, for technical stuff
function tick() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;

	if (width > height * 2) width = canvas.width = height * 2;
	else height = canvas.height = width / 2;

	timerfull = timerfull + 1/60;
	timer = Math.floor(timerfull*100)/100;
}

const player = {
	x: 2,
	y: 3,
	vx: 0,
	vy: 0,
	speed: 0.5,
	level: 0,
	checkpoint: 0,
	spawned: false,
	canJump: false,
}

const tileSize = 0.05;

function newImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}

const images = {
	// MAIN
	man: newImage(`media/tiles/man.png`),
	logo: newImage(`media/logo.png`),

	// BACKGROUND
	menu: newImage(`media/menu.png`),

	// TILES
	block: newImage(`media/tiles/block.png`),
	exit: newImage(`media/tiles/exit.png`),
	spike: newImage(`media/tiles/spike.png`),
	checkpoint: newImage(`media/tiles/checkpoint.png`),
	checkpointactive: newImage(`media/tiles/checkpointactive.png`),
}

/**
 */
const state = {
	playing: false,
	tab: 'menu',
	subtab: 'main',
}

function keyDownHandler(event) {
	if (event.keyCode == 39 || event.keyCode == 68) {
		r = true;
	}
	else if (event.keyCode == 37 || event.keyCode == 65) {
		l = true;
	}
	else if (event.keyCode == 32 || event.keyCode == 38 || event.keyCode == 87) {
		jump = true;
	}
	else if (event.keyCode == 82) {
		resetPending = true;
	}

	else if (event.keyCode == 76) {
		const editor = document.getElementById('leveleditor');
		if (editor.style.display == 'block') editor.style.display = 'none';
		else editor.style.display = 'block';
	}
}

function keyUpHandler(event) {
	if (event.keyCode == 39 || event.keyCode == 68) {
		r = false;
	}
	else if (event.keyCode == 37 || event.keyCode == 65) {
		l = false;
	}
}
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function parseLevel() {
	const tiles = [];
	let x = 0;
	let y = 0;

	for (const row of LEVELS[player.level].tiles) {
		y++;
		const split = row.split('');
		for (const tile of split) {
			x++;
			if (TILES[tile] == 'empty' || TILES[tile] == undefined) continue;
			tiles.push({
				x: x,
				y: y,
				tile: TILES[tile],
			})
		}
		x = 0;
	}

	return tiles;
}