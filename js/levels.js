const LEVELS = [
	{
		level: 0,
		tiles: [
			'XXXXXXXXXXXXXXXXXXXXXXXX',
			'X        XX            X',
			'X        X             X',
			'X    XX  X  XX        ^X',
			'XX   XX  X        XX  XX',
			'XXX O                  X',
			'XXXXXXXXXXXXXXXXXX     X',
			'X                      X',
			'X                    XXX',
			'X   ^^           XXXXXXX',
			'XXXXXXXXX       XXXXXXXX',
			'X              XX      X',
			'X                      X',
			'XXXXXXXX  XXXXXXX    ^^X',
			'XXXXXXXX^^XXXXXXXXXXXXXX',
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
	'^': 'spike',
}