/*
	helper functions & stuff
*/

/**
 * `ch` chance of succeeding.
 * @param {number} ch The chance.
 * @example chance(0.1) // 10% chance of returning true
 * @returns {boolean} If succeeded
 */
function chance(ch) {
	return Math.random() < ch;
}

/**
 * Returns a random value from the array.
 * @param {any[]} array The array to choose from.
 * @returns {any} The result.
 */
function randomArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * @example
 * weightedChoose(
 * 	{
 * 		'thing': 2,
 * 		'egg': 5,
 * 		'h': 1,
 * 	}
 * )
 * 
 * // this will make it so egg has the biggest chance of getting selected and h has the least chance of getting selected
 * // an element has a value in sum of values of the object chance of getting selected
 * // the sum of values is 2+5+1 = 8
 * // so thing has a 2 in 8 (1 in 4) chance of getting selected (25%), egg has a 5 in 8 chance (62.5%) 
 * // and h has a 1 in 8 chance of getting selected (12.5%)
 * 
 * // how it works: each element of the object gets added to an array the number of times in the number
 * // then a random value from the array is chosen
*/
function weightedChoose(object) {

	let array = [];
	for (const value in object) {
		if (Object.hasOwnProperty.call(object, value)) {
			const element = object[value];
			for (let weight = 0; weight < element; weight++) {
				array.push(value);
			}
		}
	}

	return randomArray(array);
}

const xtoperc  = v => v / width;
const ytoperc  = v => v / height;
const xtopixel = v => v * width;
const ytopixel = v => v * height;
function hasHitbox(tile) {
	return ['block', 'spike', 'exit', 'checkpoint'].includes(tile);
}
function hitboxNoSolid(tile) {
	return ['exit', 'checkpoint'].includes(tile);
}
function getWidth(level) {
	let length = 0;
	for (const row of level) {
		if (row.length > length) length = row.length;
	}
	return length;
}

const clicks = {
	add(name, x, y, width, height, func, clickToClear = false, cursor = true) {
		if (this.get(name)) return false;
		name ||= clickables.length;
		clickables.push({
			x: x,
			y: y,
			width: width,
			height: height,
			name: name,
			click: func,
			clickToClear: clickToClear,
			cursor: cursor,
		})
		return true;
	},
	remove(name) {
		const index = clickables.findIndex(c => c.name == name);
		if (index == -1) return false;
		clickables.splice(index, 1);
		return true;
	},
	get(name) {
		return clickables.find(c => c.name == name);
	},
	clear() {
		clickables.splice(0, clickables.length - 1);
	}
}

/**
 * Gets the color of a difficulty.
 * @param {Difficulty} diff The difficulty to get color of.
 * @returns {string} The color of the difficulty. Includes the #.
 */
function getDiffColor(diff) {
	return {
		basic:   '#3C78D8',
		easy:    '#6AA84F',
		medium:  '#F1C232',
		hard:    '#E69138',
		extreme: '#CC0000',
		insane:  '#A64D79',
		unrated: '#FFFFFF',
	}[diff];
}

/**
 * Converts an object to a class instance. If it's not from a class it just returns the object.
 * @param {object} obj The object to check.
 * @returns {object} The class instance or the object.
 */
function convertToClass(obj) {
	/** @type {{ [x: string]: string[] }} */
	const checks = {
		Player: ['levels', 'levelstate', 'resets', 'unlimited'],
		Level: ['data', 'difficulty', 'stars', 'name', 'id'],
	}

	let type = null;
	// checking: the class being checked right now
	// cl:       the list of checks to do for this class
	// prop:     the property that is being checked for right now
	for (const checking in checks) { // check a single array of properties
		const cl = checks[checking];
		for (const prop of cl) {
			if (!Object.hasOwnProperty.call(obj, prop)) break;
			//  prop is the last element in cl
			if (prop == cl[cl.length - 1]) type = checking; // we got through
		}
		if (type != null) break; // get out of this loop if we already got the type
	}

	let build; // the class instance being built
	switch (type) { // no way to do this with a different way
		case 'Player':
			build = new Player();
			break;

		case 'Level':
			build = new Level();
			break;
	
		default:
			return obj; // return the object if its not a class instance, if the object gets past this it has to be a class instance
	}

	for (const p in obj) {
		build[p] = obj[p];
	}

	return build;
}