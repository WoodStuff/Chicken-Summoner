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
		var a = images.levels_button;
		a.style.opacity = 0.5;
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
		clicks.add('levels',      0.0625, 0.3 + 0 * spacing, size / (93/394), size * 2, () => {});
		clicks.add('leveleditor', 0.0625, 0.3 + 1 * spacing, size / (93/747), size * 2, () => {});
		clicks.add('statistics',  0.0625, 0.3 + 2 * spacing, size / (93/624), size * 2, () => {});
		clicks.add('missions',    0.0625, 0.3 + 3 * spacing, size / (93/541), size * 2, () => {});
		clicks.add('options',     0.0625, 0.3 + 4 * spacing, size / (93/511), size * 2, () => {});
	}

	function play() {
		// background
		ctx.fillStyle = '#486362';
		ctx.fillRect(0, 0, xtopixel(1), ytopixel(1));

		const level = parseLevel();

		let spawnX = 4;
		let spawnY = 4;

		let Xscroll = 0;
		let Yscroll = 0;

		let checkpoints = [{ x: 4, y: 4 }];

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

					ctx.drawImage(texture, (x - 1 - Xscroll) * xtopixel(tileSize), (y - 1 - Yscroll) * xtopixel(tileSize), xtopixel(tileSize), xtopixel(tileSize));

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
			if (player.checkpoint == 0) {
				timerfull = 0;
			}
			reset();
			resetPending = false;
		}

		// making sure there are no rounding errors
		player.x = Math.round((player.x + Number.EPSILON) * 1000) / 1000;
		player.y = Math.round((player.y + Number.EPSILON) * 1000) / 1000;

		ctx.drawImage(images.man, ((player.x - 1 - Xscroll) * xtopixel(tileSize)), ((player.y - 1 - Yscroll) * xtopixel(tileSize)), xtopixel(tileSize * 0.75), xtopixel(tileSize * 0.75));

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
				if (!sp) {
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
				if (!sp) {
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
		function specialCollide(prop) { // returns true if no hitbox
			if (prop.tile == 'spike') {
				reset();
				return true;
			}
			if (prop.tile == 'exit' && player.level != LEVELS.length - 1) {
				player.checkpoint = 0;
				player.level++;
				nextLevelPending = true;
				timerfull = 0;
			}
			if (prop.tile == 'checkpoint') {
				player.checkpoint = prop.checkpoint;
				return true;
			}
		}
	}
}