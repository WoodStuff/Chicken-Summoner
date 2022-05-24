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
			'X   ^^ C         XXXXXXX',
			'XXXXXXXXX       XXXXXXXX',
			'X              XX      X',
			'X  >                   X',
			'XXXXXXXX  XXXXXXX    ^^X',
			'XXXXXXXX^^XXXXXXXC XXXXX',
			'XXXXXXXXXXXXXXXXXXXXXXXX',
		],
		xScroll: true,
		yScroll: true,
	},
	{
		level: 1,
		tiles: [
			'XXXXXXXXXXXXXXXXXXXXXXXX',
			'X                      X',
			'X       O              X',
			'X      XXX   X         X',
			'X        X        XX   X',
			'X      ^ X^^^^^^^^     X',
			'XXXXXXXXXXXXXXXXXX     X',
			'X                     CX',
			'X                    XXX',
			'X   ^^ C         XXXXXXX',
			'X   XXXXX^^^^^^^XXXXXXXX',
			'X       XXXXXXXXX      X',
			'X                      X',
			'XXXXXXXXXXXXXXXXX    > X',
			'XXXXXXXXXXXXXXXXXXXXXXXX',
			'XXXXXXXXXXXXXXXXXXXXXXXX',
		],
		xScroll: true,
		yScroll: true,
	},
]

const TILES = {
	' ': 'empty',
	'X': 'block',
	'O': 'spawn',
	'>': 'exit',
	'^': 'spike',
	'C': 'checkpoint',
}