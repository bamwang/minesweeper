$(function () {
	board = new Board($('#board'));
	$('#controller form').on('submit', function(){
		event.preventDefault();
		var width = $(this).find('#width').val();
		var height = $(this).find('#height').val();
		var mine = $(this).find('#mines').val();
		mine = mine > width * height ? (width * height / 2 ^ 0) : mine;
		// console.log(mine)
		board.reset({
			width : width,
			height : height,
			numberOfMines : mine
		});
	})
	board.init({
		width : 10,
		height : 10,
		numberOfMines : 10
	});
})