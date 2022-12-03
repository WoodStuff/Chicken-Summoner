function hardReset(save = 'chickenSummonerSave') {
	const n1 = Math.floor(Math.random() * ((20 + 1) - 10)) + 10;
	const n2 = Math.floor(Math.random() * ((20 + 1) - 10)) + 10;
	if (prompt(`Are you sure you want to reset your progress? There is no going back!\nTo confirm, type the result of ${n1}+${n2}.`) == n1 + n2) {
		localStorage.removeItem(save);
		location.reload();
	}
	else alert('Hard reset failed.')
}

function save(save = 'chickenSummonerSave') {
	if (localStorage.getItem(save) == null) game = new Player();
	localStorage.setItem(save, JSON.stringify(game));
}

function load(save = 'chickenSummonerSave') {
	game = JSON.parse(localStorage.getItem(save));
	if (game == null) return console.log('First time playing game');

	// 1. flatten the object
	function flatten(data, c) {
		var result = {};
		for (var i in data) {
			if (typeof data[i] == 'object' && !data[i].array) Object.assign(result, flatten(data[i], c + '.' + i));
			else result[(c + '.' + i).replace(/^\./, "")] = data[i];
		}
		if (data.length == 0) result[c] = [];
		else if (Object.keys(data) == undefined || Object.keys(data).length == 0) result[c] = {};
		return result;
	}
	game = flatten(game, 'object');

	// 2. replace everything that should be a class instance with a class instance
	for (const value in game) game[value] = convertToClass(game[value]);
	
	// 3. unflatten the object
	function unflatten(data) {
		var result = {}
		for (var i in data) {
			var keys = i.split('.')
			keys.reduce(function(r, e, j) {
				return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : [])
			}, result)
		}
		return result;
	}
	game = unflatten(game);
	game = game.object;
	game = convertToClass(game);
	
	// class instances are back!! yay :D
}