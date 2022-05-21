/*
	the main code of the game, primarily drawing to the canvas
*/

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

let l, r, jump, reset; // abbreviations for left and right

// every frame, runs 60 fps, for technical stuff
function tick() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;

	if (width > height * (16/9)) width = canvas.width = height * (16/9);
	else height = canvas.height = width * (9/16);
}

setInterval(tick, 100/6);

const player = {
	x: 2,
	y: 3,
	vx: 0,
	vy: 0,
	speed: 0.5,
	level: 0,
	spawned: false,
	canJump: false,
}

const tileSize = 0.05;

// every frame, for rendering stuff
function init() {
	ctx.clearRect(0, 0, xtopixel(1), ytopixel(1));

	// background
	ctx.fillStyle = '#5050A0';
	ctx.fillRect(0, 0, xtopixel(1), ytopixel(1));

	const level = parseLevel();

	let spawnX = 20;
	let spawnY = 20;

	const hitboxes = [];

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

				if (tileSolid(level[0].tile)) {
					hitboxes.push({
						tile: level[0].tile,
						top: (y - 1) * tileSize * 20,
						left: (x - 1) * tileSize * 20,
						bottom: ((y - 1) * tileSize + tileSize) * 20,
						right: ((x - 1) * tileSize + tileSize) * 20,
					});
				}

				level.shift();
			}
		}
	}
	for (const value of hitboxes) {
		// making sure there are no rounding errors
		value.top = Math.round((value.top + Number.EPSILON) * 1000) / 1000;
		value.left = Math.round((value.left + Number.EPSILON) * 1000) / 1000;
		value.bottom = Math.round((value.bottom + Number.EPSILON) * 1000) / 1000;
		value.right = Math.round((value.right + Number.EPSILON) * 1000) / 1000;
	}
	if (!player.spawned) {
		player.x = spawnX;
		player.y = spawnY;
		player.spawned = true;
	}


	let friction = 0.99;
	let velThreshold = 0.8;

	// adding the man
	const man = new Image();
	man.src = 'media/images/man.png';

	if (l) player.vx -= player.speed;
	if (r) player.vx += player.speed;
	if (jump) {
		jump = false;
		if (player.canJump) {
			player.vy = -20;
			player.canJump = false;
		}
	}

	gravitate();
	move();

	if (player.vx > 0 && l) friction = 0.9;
	if (player.vx < 0 && r) friction = 0.9;
	if (!l && !r) friction = 0.875;
	if (player.vx > -velThreshold && player.vx < velThreshold && !l && !r) friction = 0.81;
	if (player.vx > -velThreshold && player.vx < 0 && l && !r) friction += 0.2;
	if (player.vx < velThreshold && player.vx > 0 && r && !l) friction += 0.2;
	friction -= Math.abs(player.vx) / 2000;

	player.vx *= friction;

	// making sure there are no rounding errors
	player.x = Math.round((player.x + Number.EPSILON) * 1000) / 1000;
	player.y = Math.round((player.y + Number.EPSILON) * 1000) / 1000;

	ctx.drawImage(man, ((player.x - 1) * xtopixel(tileSize)), ((player.y - 1) * xtopixel(tileSize)), xtopixel(tileSize * 0.75), xtopixel(tileSize * 0.75));

	requestAnimationFrame(init);


	function move() {
		let dir;
		let temp = player.x;
		let tempcollide = colliding();

		player.x += player.vx / 150;
		if (player.x > temp) dir = 'right';
		if (player.x < temp) dir = 'left';
		if (player.x == temp) dir = 'none';

		let collide = colliding();
		if (collide && !tempcollide) {
			if (dir == 'right') {
				player.x = collide.left + 0.25;
				player.vx = 0;
			}
			if (dir == 'left') {
				player.x = collide.right + 1;
				player.vx = 0;
			}
		}


		temp = player.y;
		tempcollide = colliding();

		player.y += player.vy / 150;
		if (player.y > temp) dir = 'down';
		if (player.y < temp) dir = 'up';
		if (player.y == temp) dir = 'none';

		collide = colliding();
		if (collide && !tempcollide) {
			if (dir == 'down') {
				player.y = collide.top + 0.25;
				player.vy = 0;
				player.canJump = true;
			}
			if (dir == 'up') {
				player.y = collide.bottom + 1;
				player.vy = 0;
			}
		}
		if (!collide && !timingOut) {
			timingOut = true;
			setTimeout(() => {
				player.canJump = false;
				timingOut = false;
			}, 100);
		}
	}
	function gravitate() {
		player.vy += 0.5;
	}
	function colliding() {
		for (const box of hitboxes) {
			if (player.x > box.left + 0.25 && player.x - 1 < box.right && player.y > box.top + 0.25 && player.y - 1 < box.bottom) return box;
		}
		return false;
	}
}

function keyDownHandler(event) {
	if (event.keyCode == 39) {
		r = true;
	}
	else if (event.keyCode == 37) {
		l = true;
	}
	else if (event.keyCode == 32) {
		jump = true;
	}
	else if (event.keyCode == 82) {
		reset = true;
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