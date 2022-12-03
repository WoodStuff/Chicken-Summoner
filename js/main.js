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

const trim = { x: 0, y: 0 }

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
	speed: 0.5,
	level: 0,
	checkpoint: 0,
	spawned: false,
	canJump: false,
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
		state.playing = true;
	}
	else if (event.keyCode == 82) resetPending = true; // r
	else if (event.keyCode == 27) { // esc
		if (!state.playing) {
			state.tab = 'menu';
			state.subtab = 'main';
		}
		state.playing = false;
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
	if (/* autosave setting checker */ true) save();
}, 15_000);