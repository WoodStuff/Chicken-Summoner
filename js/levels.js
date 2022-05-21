const LEVELS = [
	{
		level: 0,
		tiles: [
			'         X',
			'         X',
			'         X',
			'         X',
			' O        ',
			'   XXXXXXX',
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