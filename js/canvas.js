/** every frame, for rendering stuff */ 
function init() {
	ctx.clearRect(0, 0, xtopixel(1), ytopixel(1));

		 if (state.playing) play();
	else if (state.tab == 'menu') menu();

	requestAnimationFrame(init);

	function menu() {
		clicks.clear();
		ctx.drawImage(images.menu, 0, 0, xtopixel(1), ytopixel(1));
		ctx.drawImage(images.logo, xtopixel(0.125), ytopixel(0.075), xtopixel(0.75), xtopixel(0.75) / (774/77));

		const spacing = 0.12;
		const size = 0.0472081218;                                             // put in the width of the image here ↓↓↓
		ctx.drawImage(images.levels_button,      xtopixel(0.0625), ytopixel(0.3 + 0 * spacing), xtopixel(size) / (93/394), xtopixel(size));
		ctx.drawImage(images.leveleditor_button, xtopixel(0.0625), ytopixel(0.3 + 1 * spacing), xtopixel(size) / (93/747), xtopixel(size));
		ctx.drawImage(images.statistics_button,  xtopixel(0.0625), ytopixel(0.3 + 2 * spacing), xtopixel(size) / (93/624), xtopixel(size));
		ctx.drawImage(images.missions_button,    xtopixel(0.0625), ytopixel(0.3 + 3 * spacing), xtopixel(size) / (93/541), xtopixel(size));
		ctx.drawImage(images.options_button,     xtopixel(0.0625), ytopixel(0.3 + 4 * spacing), xtopixel(size) / (93/511), xtopixel(size * 116/93));
		ctx.drawImage(images.levels_bg,          xtopixel(0.0625), ytopixel(0.3 + 0 * spacing), xtopixel(size) / (93/394), xtopixel(size));
		ctx.drawImage(images.leveleditor_bg,     xtopixel(0.0625), ytopixel(0.3 + 1 * spacing), xtopixel(size) / (93/747), xtopixel(size));
		ctx.drawImage(images.statistics_bg,      xtopixel(0.0625), ytopixel(0.3 + 2 * spacing), xtopixel(size) / (93/624), xtopixel(size));
		ctx.drawImage(images.missions_bg,        xtopixel(0.0625), ytopixel(0.3 + 3 * spacing), xtopixel(size) / (93/541), xtopixel(size));
		ctx.drawImage(images.options_bg,         xtopixel(0.0625), ytopixel(0.3 + 4 * spacing), xtopixel(size) / (93/511), xtopixel(size));
		clicks.add('levels',      0.0625, 0.3 + 0 * spacing, size / (93/394), size * 2, () => { state.playing = true }, true);
		clicks.add('leveleditor', 0.0625, 0.3 + 1 * spacing, size / (93/747), size * 2, () => { state.tab = 'leveleditor' }, true);
		clicks.add('statistics',  0.0625, 0.3 + 2 * spacing, size / (93/624), size * 2, () => {	state.tab = 'stats'; updateStats(); }, true);
		clicks.add('missions',    0.0625, 0.3 + 3 * spacing, size / (93/541), size * 2, () => { alert('Sorry, not implemented yet!') });
		clicks.add('options',     0.0625, 0.3 + 4 * spacing, size / (93/511), size * 2, () => { state.tab = 'options'; inputOptions(); });
	}

	function play() {
		// background
		ctx.fillStyle = '#486362';
		ctx.fillRect(0, 0, xtopixel(1), ytopixel(1));

		level = parseLevel();

		let Xscroll = 0;
		let Yscroll = 0;

		const checkpoints = [];

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

		let lv = level;
		// render the level
		for (let y = 1; y < LEVELS[player.level].tiles.length + 1; y++) {
			for (let x = 1; x < getWidth(LEVELS[player.level].tiles) + 1; x++) {
				if (lv[0].x == x && lv[0].y == y) {
					if (level[0].tile == 'spawn') checkpoints[0] = [spawnX, spawnY];
					if (level[0].tile == 'checkpoint') {
						checkpoints.push({
							x: x,
							y: y,
						});
					}
					let texture = images[lv[0].tile];
					if (lv[0].tile == 'checkpoint' && player.checkpoint == checkpoints.length) texture = images.checkpointactive;
					lv.shift();

					if (texture == undefined) continue;
					ctx.drawImage(texture, (x - 1 - Xscroll) * xtopixel(tileSize), (y - 1 - Yscroll) * xtopixel(tileSize), xtopixel(tileSize), xtopixel(tileSize));
				}
			}
		}

		ctx.drawImage(images.man, ((player.x - 1 - Xscroll) * xtopixel(tileSize)), ((player.y - 1 - Yscroll) * xtopixel(tileSize)), xtopixel(tileSize * 0.75), xtopixel(tileSize * 0.75));
	}
}