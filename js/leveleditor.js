const editor = document.getElementById('leveleditor');
const levelcode = document.getElementById('levelcode');
function levelPreset(preset) {
	switch (preset) {
		case 0:
			levelcode.value =
`XXXXXXXXXXXXXXXXXXXXXXXX
X                      X
X                      X
X                      X
X                      X
X                      X
X                      X
X                      X
X                      X
X                      X
X                      X
X                      X
X  O                   X
XXXXXXXXXXXXXXXXXXXXXXXX`
			break;

		case 1:
			levelcode.value =
`XXXXXXXXXXXXXXXXXXXXXXXX
X                      X
X                      X
X  >                   X
XXXXXXXXX              X
X                      X
X            XXX       X
X                      X
X                     XX
X                      X
X             XX       X
X     XXX              X
X  O                   X
XXXXXXXXXXXXXXXXXXXXXXXX`
			break;

		case 2:
			levelcode.value =
`XXXXXXXXXXXXXXXXXXXXXXXX
X                      X
X                      X
X                      X
X                      X
X                 X    X
X                      X
X                    XXX
X >  ^^^^^^^^^^^^      X
XXXXXXXXXXXXXXXXXXX    X
X                      X
X                    XXX
X           ^^^^       X
X  O      XXXXXXXXX    X
XXXXXX                 X
XXXXXX^^^^^^^^^^^^^^^^^X
XXXXXXXXXXXXXXXXXXXXXXXX`
			break;

		case 3:
			levelcode.value =
`XXXXXXXXXXXXXXXXXXXXXXXX
X                      X
X                      X
X      ^^^^^ >         X
X   XXXXXXXXXXX        X
X                      X
XX                     X
X^C                    X
XXXX       ^^          X
XXXX^    ^^XX^^  C     X
XXXXXXXXXXXXXXXXXXX    X
XXXXXXXXXXXXXXXXXXX    X
X                     XX
X                     XX
X              ^^    XXX
X              XX    XXX
X        XXXX  XX  XXXXX
X O  ^^^^XXXX^^XX^^XXXXX
XXXXXXXXXXXXXXXXXXXXXXXX`
			break;
	
		default:
			break;
	}
}

function loadLevel() {
	LEVELS.length = 0;
	LEVELS.push({
		level: 0,
		tiles: levelcode.value.split(`
`),
		xScroll: true,
		yScroll: true,
	});
	editor.style.display = 'none';
	resetPending = true;
}