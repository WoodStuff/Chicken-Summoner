const LEVELS = [
	{
		level: 0,
		tiles: [
			'         X',
			'         X',
			'X    XX  X',
			'XX       X',
			'XXX O     ',
			'XXXXXXXXXX',
		],
		xScroll: false,
		yScroll: false,
	}
]

const TILES = {
	' ': 'empty',
	'X': 'block',
	'O': 'spawn',
	'>': 'exit',
}