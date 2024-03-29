const editor = document.getElementById('leveleditor');
const levelcode = document.querySelector('textarea');
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
X  P                   X
XXXXXXXXXXXXXXXXXXXXXXXX`
			break;

		case 1:
			levelcode.value =
`XXXXXXXXXXXXXXXXXXXXXXXX
X                      X
X                      X
X  E                   X
XXXXXXXXX              X
X                      X
X            XXX       X
X                      X
X                     XX
X                      X
X             XX       X
X     XXX              X
X  P                   X
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
X E  AAAAAAAAAAAA      X
XXXXXXXXXXXXXXXXXXX    X
X                      X
X                    XXX
X           AAAA       X
X  P      XXXXXXXXX    X
XXXXXX                 X
XXXXXXAAAAAAAAAAAAAAAAAX
XXXXXXXXXXXXXXXXXXXXXXXX`
			break;

		case 3:
			levelcode.value =
`XXXXXXXXXXXXXXXXXXXXXXXX
X                      X
X                      X
X      AAAAA E         X
X   XXXXXXXXXXX        X
X                      X
XX                     X
XAC                    X
XXXX       AA          X
XXXXA    AAXXAA  C     X
XXXXXXXXXXXXXXXXXXX    X
XXXXXXXXXXXXXXXXXXX    X
X                     XX
X                     XX
X              AA    XXX
X              XX    XXX
X        XXXX  XX  XXXXX
X P  AAAAXXXXAAXXAAXXXXX
XXXXXXXXXXXXXXXXXXXXXXXX`
			break;
	
		default:
			break;
	}
}

function loadLevel() {
	let i = levelcode.value.length;
	while (i--) {
		if (TILES[levelcode.value[i]] == undefined && levelcode.value[i] != '\n') return alert('Level code contains invalid tiles!')
	}
	LEVELS.length = 0;
	LEVELS.push({
		level: 0,
		tiles: levelcode.value.split(`
`),
		xScroll: true,
		yScroll: true,
	});
	state.playing = true;
	player.checkpoint = 0;
	resetPending = true;
}