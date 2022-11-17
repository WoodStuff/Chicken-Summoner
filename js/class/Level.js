/**
 * A difficulty, for use in levels and challenges.
 * 
 * Challenges do not have `insane` and have Normal difficulty instead of Medium, but `medium` is used in code.
 * @typedef Difficulty
 * @type { 'basic' | 'easy' | 'medium' | 'hard' | 'extreme' | 'insane' | 'unrated' }
 */

class Level {
	constructor(name, data) {
		/**
		 * The level's name.
		 * @type {string}
		 */
		this.name = name || 'Unnamed Level';
		/**
		 * The level's unique ID. Assigned when a player saves the level.
		 * @type {?string}
		 */
		this.id = null;
		/**
		 * The data of the level, the blocks inside it.
		 * @type {string[]}
		 */
		this.data = data || [
			'XXXXXXXXXX',
			'X        X',
			'X        X',
			'X P AA E X',
			'XXXXXXXXXX',
		]
		/**
		 * The difficulty of the level.
		 * @type {Difficulty}
		 */
		this.difficulty = 'unrated';
		/**
		 * The time needed to achieve a star, in milliseconds.
		 * 
		 * **Leave index 0 as** `Infinity`**!** Use indexes 1 to 5, where 5 is most stars (fastest).
		 * @type {number[]}
		 */
		this.stars = [
			Infinity,
			10_000,
			9_000,
			7_500,
			6_750,
			5_000
		]
	}

	/**
	 * Returns the size of the level.
	 * @returns {number[]} An array with the dimensions of the level. Index 0 is width, index 1 is height.
	 */
	size() {
		let rWidth = 0;
		this.data.forEach(row => rWidth = Math.max(rWidth, row.length));
		return [rWidth, this.data.length];
	}
}