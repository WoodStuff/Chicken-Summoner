/*
	the main code of the game, primarily drawing to the canvas
*/

/**
 * @type {Player}
 * The save data.
 */
let game = new Player();

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
	load();
	init();
}

const trim = { x: 0, y: 0 };
let level;

// every frame, runs 60 fps, for technical stuff
function tick() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;

	if (width > height * 2) {
		trim.x = (width - height * 2) / 2;
		trim.y = 0;
		width = canvas.width = height * 2;
	}
	else {
		trim.x = 0;
		trim.y = (height - width / 2) / 2;
		height = canvas.height = width / 2;
	}

	timerfull = timerfull + 1/60;
	timer = Math.floor(timerfull*100)/100;

	if (state.tab == 'leveleditor' && !state.playing) editor.style.display = 'block';
	else editor.style.display = 'none';
	if (state.tab == 'stats' && !state.playing) document.getElementById('stats').style.display = 'block';
	else document.getElementById('stats').style.display = 'none';
	if (state.tab == 'options' && !state.playing) document.getElementById('options').style.display = 'block';
	else document.getElementById('options').style.display = 'none';

	physics();

	function physics() {
		level = parseLevel();
		
		let checkpoints = [{ x: 4, y: 4 }];

		const hitboxes = [];

		for (let y = 1; y < LEVELS[player.level].tiles.length + 1; y++) {
			for (let x = 1; x < getWidth(LEVELS[player.level].tiles) + 1; x++) {
				if (level[0] == undefined) {
					level[0] = {
						x: x,
						y: y,
						tile: 'block',
					}
				}
				if (level[0].x == x && level[0].y == y) {
					if (level[0].tile == 'spawn') {
						spawnX = level[0].x;
						spawnY = level[0].y;
						checkpoints[0].x = spawnX;
						checkpoints[0].y = spawnY;
						level.shift();
						continue;
					}
					if (level[0].tile == 'checkpoint') {
						checkpoints.push({
							x: x,
							y: y,
						});
					}
					let texture = images[level[0].tile];
					if (level[0].tile == 'checkpoint' && player.checkpoint == checkpoints.length - 1) texture = images.checkpointactive;

					let tDecr = 0;
					if (level[0].tile == 'spike') tDecr = 0.15;

					if (hasHitbox(level[0].tile)) {
						if (level[0].tile == 'checkpoint') {
							hitboxes.push({
								tile: level[0].tile,
								top: (y - 1 + tDecr) * tileSize * 20,
								left: (x - 1) * tileSize * 20,
								bottom: ((y - 1) * tileSize + tileSize) * 20,
								right: ((x - 1) * tileSize + tileSize) * 20,
								checkpoint: checkpoints.length - 1,
							});
						}
						else {
							hitboxes.push({
								tile: level[0].tile,
								top: (y - 1 + tDecr) * tileSize * 20,
								left: (x - 1) * tileSize * 20,
								bottom: ((y - 1) * tileSize + tileSize) * 20,
								right: ((x - 1) * tileSize + tileSize) * 20,
							});
						}
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
			player.x = checkpoints[player.checkpoint].x + 0.125;
			player.y = checkpoints[player.checkpoint].y + 0.25;
			player.spawned = true;
		}


		let friction = 0.99;
		let velThreshold = 0.8;

		if (l) player.vx -= player.speed / 100;
		if (r) player.vx += player.speed / 100;
		if (jump) {
			jump = false;
			if (player.canJump) {
				player.vy = -player.jumpHeight;
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
			if (player.checkpoint == 0) {
				timerfull = 0;
			}
			reset();
			resetPending = false;
		}

		// making sure there are no rounding errors
		player.x = Math.round((player.x + Number.EPSILON) * 1000) / 1000;
		player.y = Math.round((player.y + Number.EPSILON) * 1000) / 1000;

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
				let sp = specialCollide(collide, 'x');
				if (!sp[0]) {
					if (dir == 'right') {
						player.x = collide.left + 0.25;
						if (!sp[1]) player.vx = 0;
					}
					if (dir == 'left') {
						player.x = collide.right + 1;
						if (!sp[1]) player.vx = 0;
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
				sp = specialCollide(collide, 'y');
				if (!sp[0]) {
					if (dir == 'down') {
						player.y = collide.top + 0.25;
						if (!sp[1]) {
							player.vy = 0;
							player.canJump = true;
						}
					}
					if (dir == 'up') {
						player.y = collide.bottom + 1;
						if (!sp[1]) player.vy = 0;
					}
				}
			}
			if (!collide) {
				player.canJump = false;
			}
		}
		function gravitate() {
			player.vy += player.gravity / 100;
		}
		function colliding() {
			let sfl = undefined; // save for later
			for (const box of hitboxes) {
				if (player.x > box.left + 0.25 && player.x - 1 < box.right && player.y > box.top + 0.25 && player.y - 1 < box.bottom) {
					if (hitboxNoSolid(box.tile)) {
						sfl = box;
						continue;
					}
					return box;
				}
			}
			if (sfl) return sfl;
			return false;
		}
		function reset() {
			player.x = checkpoints[player.checkpoint].x + 0.125;
			player.y = checkpoints[player.checkpoint].y + 0.25;
			player.vx = 0;
			player.vy = 0;
		}
		function specialCollide(prop, dir) { // 0 returns true if no hitbox, 1 returns true if shouldnt stop velocity
			if (prop.tile == 'spike') {
				reset();
				return [true];
			}
			if (prop.tile == 'exit' && player.level != LEVELS.length - 1) {
				player.checkpoint = 0;
				player.level++;
				nextLevelPending = true;
				timerfull = 0;
				return [true];
			}
			if (prop.tile == 'checkpoint') {
				player.checkpoint = prop.checkpoint;
				return [true];
			}
			if (prop.tile == 'spring' && dir == 'y') {
				player.vy = -player.springPower;
				return [false, true];
			}
			else return [false, false];
		}
	}
}

const mouse = {
	x: 0,
	y: 0,
}
canvas.addEventListener('mousemove', mousepos);
function mousepos(e) {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
	if (clickables.length == 0) return;

	hovered = '';

	clickables.forEach(c => {
		if (mouse.x > xtopixel(c.x) + trim.x // left hitbox
		&&  mouse.x < xtopixel(c.x + c.width) + trim.x // right hitbox
		&&  mouse.y > ytopixel(c.y) + trim.y // top hitbox
		&&  mouse.y < ytopixel(c.y + c.height) + trim.y // bottom hitbox
		) {
			hovered = c.name;
		}
	})

	if (hovered == '' || !clicks.get(hovered).cursor) canvas.style.cursor = 'default';
	else canvas.style.cursor = 'pointer';
}

canvas.addEventListener('mouseup', mouseclick);
function mouseclick(e) {
	if (hovered == '') return false;
	console.log(`Clicked button: ${hovered}`);
	clicks.get(hovered).click();
	if (clicks.get(hovered).clickToClear) clicks.clear();
}

const player = {
	x: 2,
	y: 3,
	vx: 0,
	vy: 0,
	speed: 60,
	level: 0,
	checkpoint: 0,
	spawned: false,
	canJump: false,
	jumpHeight: 25,
	gravity: 80,
	springPower: 35,
}

const tileSize = 0.05;

/**
 * Creates an image element from the URL.
 * @param {URL} src The source of the image, from the root of the game. 
 */
function newImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}

const images = {
	// MAIN
	man: newImage(`media/tiles/man.png`),
	logo: newImage(`media/logo.png`),

	// MENU
	levels_button: newImage(`media/menu/levels.png`),
	levels_bg: newImage(`media/menu/bg_levels.png`),
	leveleditor_button: newImage(`media/menu/leveleditor.png`),
	leveleditor_bg: newImage(`media/menu/bg_leveleditor.png`),
	statistics_button: newImage(`media/menu/statistics.png`),
	statistics_bg: newImage(`media/menu/bg_statistics.png`),
	missions_button: newImage(`media/menu/missions.png`),
	missions_bg: newImage(`media/menu/bg_missions.png`),
	options_button: newImage(`media/menu/options.png`),
	options_bg: newImage(`media/menu/bg_options.png`),

	// BACKGROUND
	menu: newImage(`media/menu.png`),

	// TILES
	block: newImage(`media/tiles/block.png`),
	exit: newImage(`media/tiles/exit.png`),
	spike: newImage(`media/tiles/spike.png`),
	checkpoint: newImage(`media/tiles/checkpoint.png`),
	checkpointactive: newImage(`media/tiles/checkpointactive.png`),
	spring: newImage(`media/tiles/spring.png`)
}

/**
 * Current menu state.
 * Starts at `playing: false`, `tab: 'menu'`, `subtab: 'main'`.
 */
const state = {
	playing: false,
	tab: 'menu',
	subtab: 'main',
}

/**
 * @type {{
 * x: number,
 * y: number,
 * width: number,
 * height: number,
 * name: string,
 * click: Function,
 * clickToClear: boolean,
 * cursor: boolean
 * }[]}
 */
const clickables = [];
let hovered = '';

function keyDownHandler(event) {
		 if (event.keyCode == 39 || event.keyCode == 68) r = true; // → d
	else if (event.keyCode == 37 || event.keyCode == 65) l = true; // ← a
	else if (event.keyCode == 32 || event.keyCode == 38 || event.keyCode == 87) { // space ↑ w
		jump = true;
	}
	else if (event.keyCode == 82) { // r
		if (event.shiftKey) player.checkpoint = 0;
		resetPending = true;
	}
	else if (event.keyCode == 27) { // esc
		if (!state.playing) {
			state.tab = 'menu';
			state.subtab = 'main';
		}
		state.playing = false;
	}
	else if (event.keyCode == 84 && event.shiftKey) { // shift+t
		player.level = 0;
		player.checkpoint = 0;
		resetPending = true;
	}
}

function keyUpHandler(event) {
		 if (event.keyCode == 39 || event.keyCode == 68) r = false; // → d
	else if (event.keyCode == 37 || event.keyCode == 65) l = false; // ← a
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

const autoSave = setInterval(() => {
	if (/* autosave setting checker */ false) save();
}, 15_000);