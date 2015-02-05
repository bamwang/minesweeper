$(function () {
	board = new Board($('#board'));
	board.init({
		width : 20,
		height : 20,
		numberOfMines : 100
	});
})