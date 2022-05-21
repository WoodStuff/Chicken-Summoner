/*
	the main code of the game, primarily drawing to the canvas
*/

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

let l, r; // abbreviations for left and right

// every frame, runs 60 fps, for technical stuff
function tick() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;

	if (width > height * (16/9)) width = canvas.width = height * (16/9);
	else height = canvas.height = width * (9/16);
}

setInterval(tick, 100/6);

const player = {
	x: 0.5,
	y: 0.8,
	subx: 0.5,
	suby: 0.5,
	level: 0,
	spawned: false,
}

const tileSize = 0.05;

// every frame, for rendering stuff
function init() {
	ctx.clearRect(0, 0, xtopixel(1), ytopixel(1));

	// background
	ctx.fillStyle = '#5050A0';
	ctx.fillRect(0, 0, xtopixel(1), ytopixel(1));

	const level = parseLevel();

	let spawnX = 1;
	let spawnY = 1;

	// render the level
	for (let y = 1; y < LEVELS[player.level].tiles.length + 1; y++) {
		for (let x = 1; x < LEVELS[player.level].tiles[0].length + 1; x++) {
			if (level[0].x == x && level[0].y == y) {
				if (level[0].tile == 'spawn') {
					spawnX = level[0].x;
					spawnY = level[0].y;
					level.shift();
					continue;
				}
				const tile = new Image();
				tile.src = `media/images/${level[0].tile}.png`;
				ctx.drawImage(tile, (x - 1) * xtopixel(tileSize), (y - 1) * xtopixel(tileSize), xtopixel(tileSize), xtopixel(tileSize));

				level.shift();
			}
		}
	}
	if (!player.spawned) {
		player.x = spawnX;
		player.y = spawnY;
		player.spawned = true;
	}


	// adding the man
	const man = new Image();
	man.src = 'media/images/man.png';
	if (l) player.x -= 0.066;
	if (r) player.x += 0.066;

	ctx.drawImage(man, (player.x - 1) * xtopixel(tileSize), (player.y - 1) * xtopixel(tileSize), xtopixel(tileSize), xtopixel(tileSize));

	requestAnimationFrame(init);
}

function keyDownHandler(event) {
	if(event.keyCode == 39) {
		r = true;
	}
	else if(event.keyCode == 37) {
		l = true;
	}
}

function keyUpHandler(event) {
	if (event.keyCode == 39) {
		r = false;
	}
	else if (event.keyCode == 37) {
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
			if (TILES[tile] == 'empty') continue;
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