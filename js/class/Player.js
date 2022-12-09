class Player {
	constructor() {
		/**
		 * All custom levels that are saved.
		 * @type {{
		 * 	saved: Level[],
		 * 	created: Level[],
		 * }}
		 */
		this.levels = {
			saved: [],
			created: [],
		}
		/**
		 * The state of the player's saved levels. Deaths include resets. Time is in seconds.
		 * @type {{ [x: string]: {
		 * 	wins: number,
		 * 	time: number,
		 * 	deaths: number,
		 * 	jumps: number,
		 * 	total_time: number,
		 * 	total_deaths: number,
		 * 	total_jumps: number,
		 * } }}
		 */
		this.levelstate = {};
		/**
		 * The levels the player has favorited.
		 * @type {string[]}
		 */
		this.favoriteLevels = [];
		/**
		 * Current assigned challenges.
		 * @type {Challenge[]}
		 */
		this.challenges = [];
		/**
		 * Attempt count. This is incremented each time a reset happens or a level is started.
		 * @type {number}
		 */
		this.attempts = 0;
		/**
		 * Info regarding the progress of Unlimited Mode.
		 */
		this.unlimited = {
			best: 0,
			attempts: 0,
		}
	}

	/**
	 * Returns the number of times the player has died.
	 * @returns {number} The number of times the player has died.
	 */
	deaths() {
		const val = Object.values(this.levelstate);
		let d = val.map(state => state.total_deaths).reduce((prev, next) => prev + next);
		d += this.unlimited.attempts;
		return d;
	}

	/**
	 * Returns if the player has saved the level or created it. May return undefined if the level hasn't been saved.
	 * @param {string} id The ID of the level to type-check.
	 * @returns {'created' | 'saved' | undefined } The type of the level.
	 */
	levelType(id) {
		if (this.levels.created.find(l => l.id == id)) return 'created';
		if (this.levels.saved.find(l => l.id == id)) return 'saved';
	}

	/**
	 * Returns all of the levels, regardless if created or saved.
	 * @returns {Level[]} All saved levels.
	 */
	allLevels() {
		return this.levels.created.concat(this.levels.saved);
	}

	/**
	 * Saves a level to the player's saved list.
	 * @param {string} id The level ID to save as.
	 * @param {Level} level The data of the level.
	 * @param {boolean} created If the level should be saved in the created list.
	 */
	saveLevel(id, level, created = false) {
		const lvl = level;
		const ids = this.allLevels().map(l => l.id);
		let proposedID = JSON.stringify(id.toLowerCase()).replace(/\W/g, '');
		while (ids.includes(proposedID)) {
			if (proposedID.match(/-[0-9]+$/)) {
				const array = proposedID.split('-');
				array[array.length - 1]++;
				proposedID = array.join('-');
			}
			else proposedID += '-0';
		}
		lvl.id = proposedID;
		this.levels[created ? 'created' : 'saved'].push(lvl);
	}

	/**
	 * Gets the total amount of a stat.
	 * @param {'deaths' | 'time' | 'jumps' | 'wins'} stat The stat to get.
	 * @returns {number} The total amount of deaths taken, playtime in levels, number of total jumps or level completions.
	 */
	getTotalStat(stat) {
		let count = 0;
		for (const state in this.levelstate) {
			let total = this.levelstate[state][stat == 'wins' ? 'wins' : `total_${stat}`];
			if (!isNaN(total)) count += total;
			else count += this.levelstate[state][stat];
		}
		return count;
	}

	/**
	 * Get the completed levels.
	 * @param {'levels' | 'states'} type The level type to return.
	 */
	completedLevels(type = 'levels') {
		if (type == 'levels') return this.allLevels().filter(x => this.levelstate[x.id].wins > 0);
		let levels = this.levelstate;
		for (const state in levels) if (levels[state].wins < 1) delete levels[state];
		return levels;
	}
	/**
	 * Get the amount of completed levels.
	 */
	completed() {
		return this.completedLevels().length;
	}
}