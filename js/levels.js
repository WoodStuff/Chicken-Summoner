const FEATURED = [];
FEATURED.push(new Level())








const LEVELS = [
	{
		level: 0,
		tiles: [
			'XXXXXXXXXXXXXXXXXXXXXXXX',
            'X        XX            X',
            'X        X             X',
            'X    XX  X  XX        AX',
            'XX   XX  X        XX  XX',
            'XXX P          S       X',
            'XXXXXXXXXXXXXXXXXX     X',
            'X                      X',
            'X                    XXX',
            'X   AA C         XXXXXXX',
            'XXXXXXXXX       XXXXXXXX',
            'X              XX      X',
            'X  E                   X',
            'XXXXXXXX  XXXXXXX    AAX',
            'XXXXXXXXAAXXXXXXXC XXXXX',
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
			'X       P              X',
			'X      XXX   X         X',
			'X        X        XX   X',
			'X      A XAAAAAAAA     X',
			'XXXXXXXXXXXXXXXXXX     X',
			'X                     CX',
			'X                    XXX',
			'X   AA C         XXXXXXX',
			'X   XXXXXAAAAAAAXXXXXXXX',
			'X       XXXXXXXXX      X',
			'X                      X',
			'XXXXXXXXXXXXXXXXX    E X',
			'XXXXXXXXXXXXXXXXXXXXXXXX',
			'XXXXXXXXXXXXXXXXXXXXXXXX',
		],
		xScroll: true,
		yScroll: true,
	},
	{
		level: 2,
		tiles: [
			'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
			'X                                       X                        X',
			'X                                       X                        X',
			'X                                       X                        X',
			'X                      AA   AA   AA     X   AA        E          X',
			'X         XXXXXXXXXXXXXXXXXXXXXXXXXXXXA XX AXXXXXXXXXXXXXXXXXXXX X',
			'X                                    XX    X                     X',
			'XXX                                  XXXXXXX                     X',
			'XXXXX               XXX   XXX                                    X',
			'XXXXXXX          AAAAAAAAAAAAAAA              AAA                X',
			'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX      X',
			'X                       X                              X         X',
			'X                       X                              X       X X',
			'X                     X   X                            X   X   X X',
			'XP                    X   X                                      X',
			'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
		],
		xScroll: true,
		yScroll: true,
	},
]

const TILES = {
	' ': 'empty',
	'X': 'block',
	'P': 'spawn',
	'E': 'exit',
	'A': 'spike',
	'C': 'checkpoint',
	'S': 'spring',
}