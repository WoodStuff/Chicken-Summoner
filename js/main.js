/*
	the main code of the game, primarily drawing to the canvas
*/

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

let l, r, jump, resetPending, nextLevelPending; // abbreviations for left and right

// every frame, runs 60 fps, for technical stuff
function tick() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;

	if (width > height * 2) width = canvas.width = height * 2;
	else height = canvas.height = width /2;
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

const images = {
	man: new Image(),
	block: new Image(),
	exit: new Image(),
	spike: new Image(),
}
images.man.src = `media/images/man.png`;
images.block.src = `media/images/block.png`;
images.exit.src = `media/images/exit.png`;
images.spike.src = `media/images/spike.png`;

// every frame, for rendering stuff
function init() {
	ctx.clearRect(0, 0, xtopixel(1), ytopixel(1));

	// background
	ctx.fillStyle = '#5050A0';
	ctx.fillRect(0, 0, xtopixel(1), ytopixel(1));

	const level = parseLevel();

	let spawnX = 20;
	let spawnY = 20;

	let Xscroll = 0;
	let Yscroll = 0;

	const hitboxes = [];

	if (LEVELS[player.level].xScroll) {
		if (LEVELS[player.level].tiles[0].length > 1 / tileSize) {
			if (player.x >= 0.5 / tileSize && player.x <= LEVELS[player.level].tiles[0].length - 0.5 / tileSize) {
				Xscroll = player.x - 0.5 / tileSize;
			}
			else if (player.x <= 0.5 / tileSize) {
				Xscroll = 0;
			}
			else {
				Xscroll = LEVELS[player.level].tiles[0].length - 1 / tileSize;
			}
		}
	}
	if (LEVELS[player.level].yScroll) {
		if (LEVELS[player.level].tiles.length > 0.5 / tileSize) {
			if (player.y >= 0.25 / tileSize && player.y <= LEVELS[player.level].tiles.length - 0.25 / tileSize) {
				Yscroll = player.y - 0.25 / tileSize;
			}
			else if (player.y <= 0.25 / tileSize) {
				Yscroll = 0;
			}
			else {
				Yscroll = LEVELS[player.level].tiles.length - 0.5 / tileSize;
			}
		}
	}

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
				ctx.drawImage(images[level[0].tile], (x - 1 - Xscroll) * xtopixel(tileSize), (y - 1 - Yscroll) * xtopixel(tileSize), xtopixel(tileSize), xtopixel(tileSize));

				let tDecr = 0;
				if (level[0].tile == 'spike') tDecr = 0.1;

				if (tileSolid(level[0].tile)) {
					hitboxes.push({
						tile: level[0].tile,
						top: (y - 1 + tDecr) * tileSize * 20,
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
		player.x = spawnX + 0.125;
		player.y = spawnY + 0.125;
		player.spawned = true;
	}


	let friction = 0.99;
	let velThreshold = 0.8;

	if (l) player.vx -= player.speed;
	if (r) player.vx += player.speed;
	if (jump) {
		jump = false;
		if (player.canJump) {
			player.vy = -20;
			player.canJump = false;
		}
	}

	if (nextLevelPending) {
		reset();
		nextLevelPending = false;
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

	if (resetPending) {
		reset();
		resetPending = false;
	}

	// making sure there are no rounding errors
	player.x = Math.round((player.x + Number.EPSILON) * 1000) / 1000;
	player.y = Math.round((player.y + Number.EPSILON) * 1000) / 1000;

	ctx.drawImage(images.man, ((player.x - 1 - Xscroll) * xtopixel(tileSize)), ((player.y - 1 - Yscroll) * xtopixel(tileSize)), xtopixel(tileSize * 0.75), xtopixel(tileSize * 0.75));

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
		if (collide) {
			let sp = specialCollide(collide);
			if (!tempcollide && !sp) {
				if (dir == 'right') {
					player.x = collide.left + 0.25;
					player.vx = 0;
				}
				if (dir == 'left') {
					player.x = collide.right + 1;
					player.vx = 0;
				}
			}
		}

		
		temp = player.y;
		tempcollide = colliding();

		player.y += player.vy / 150;
		if (player.y > temp) dir = 'down';
		if (player.y < temp) dir = 'up';
		if (player.y == temp) dir = 'none';

		collide = colliding();
		if (collide) {
			sp = specialCollide(collide);
			if (!tempcollide && !sp) {
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
		}
		if (!collide) {
			player.canJump = false;
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
	function reset() {
		player.x = spawnX + 0.125;
		player.y = spawnY + 0.125;
		player.vx = 0;
		player.vy = 0;
	}
	function specialCollide(prop) { // returns true if no hitbox
		if (prop.tile == 'spike') {
			reset();
			return true;
		}
		if (prop.tile == 'exit' && player.level != LEVELS.length - 1) {
			player.level++;
			nextLevelPending = true;
		}
	}
}

function keyDownHandler(event) {
	if (event.keyCode == 39 || event.keyCode == 68) {
		r = true;
	}
	else if (event.keyCode == 37 || event.keyCode == 65) {
		l = true;
	}
	else if (event.keyCode == 32) {
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