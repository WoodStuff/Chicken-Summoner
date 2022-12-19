const e = a => document.getElementById(a);
const s = a => e(`stat-${a}`);
const o = a => e(`option-${a}`);

function updateStats() {
	s('deaths').innerHTML = game.getTotalStat('deaths');
	s('wins').innerHTML = game.completed();
	s('jumps').innerHTML = game.getTotalStat('jumps');

	const time = game.getTotalStat('time');
	const d = a => a < 10 ? '0' + a : a;
	const seconds = d(time % 60);
	const minutes = d(Math.floor(time / 60) % 60);
	const hours   = d(Math.floor(time / 3600));
	s('playtime').innerHTML = `${hours}:${minutes}:${seconds}`;
	
	s('unlimited').innerHTML = game.unlimited.best;

	s('diffwins').innerHTML = game.completedLevels().filter(x => x.difficulty == e('diffwins'));

	/*switch (e('starwins-1').value) {
		case 'exactly':
			s('starwins').innerHTML = Object.values(game.completedLevels('states')).filter(x => )
			break;
	
		default:
			break;
	}*/
}

function inputOptions() {
	o('gravity').value = player.gravity;
	o('jump').value = player.jumpHeight;
	o('speed').value = player.speed;
}
function saveOptions() {
	player.gravity = o('gravity').value;
	player.jumpHeight = o('jump').value;
	player.speed = o('speed').value;
}