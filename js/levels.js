const LEVELS = [
	{
		level: 0,
		tiles: [
			'XXXXXXXXXXXXXXXXXXXXXXXX',
			'X        XX           XX',
			'X        X             X',
			'X    XX  X  XX         X',
			'XX   XX  X        XX   X',
			'XXX O                  X',
			'XXXXXXXXXXXXXXXXXXXXXXXX',
		],
		xScroll: true,
		yScroll: false,
	}
]

const TILES = {
	' ': 'empty',
	'X': 'block',
	'O': 'spawn',
	'>': 'exit',
}