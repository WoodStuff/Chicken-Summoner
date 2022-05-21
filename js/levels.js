const LEVELS = [
	{
		level: 0,
		tiles: [
			'          ',
			'          ',
			'          ',
			'          ',
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