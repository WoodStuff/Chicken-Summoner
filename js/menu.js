function updateStats() {
	const e = a => document.getElementById(a);
	const s = a => e(`stat-${a}`);

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

	s('starwins').innerHTML = game.completedLevels().filter()
}