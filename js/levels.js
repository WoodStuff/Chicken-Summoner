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
			'XXXXXXXXXXXXXXXXXX  XXXX',
			'X                      X',
			'X                 XX   X',
			'XXX   XXXX       XXXXXXX',
			'X               XXXXXXXX',
			'X  XX          XXXXXXXXX',
			'X             XXXXXXXXXX',
			'XXXXXXXXXXXXXXXXXXXXXXXX',
		],
		xScroll: true,
		yScroll: true,
	}
]

const TILES = {
	' ': 'empty',
	'X': 'block',
	'O': 'spawn',
	'>': 'exit',
}