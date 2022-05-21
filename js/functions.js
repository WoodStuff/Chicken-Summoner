/*
	helper functions & stuff
*/

function chance(ch) {
	return Math.random() < ch;
}
function randomArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}
function convertPos(value, method) {
	const width = canvas.width;
	const height = canvas.height;

	switch (method) {
		case enums.convertPos.xtoperc:
			return value / width;

		case enums.convertPos.xtopixel:
			return value * width;

		case enums.convertPos.ytoperc:
			return value / height;

		case enums.convertPos.ytopixel:
			return value * height;
	
		default:
			break;
	}
}