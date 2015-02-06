$(function () {
	board = new Board($('#board'));
	$('#controller form').on('submit', function(event){
		event.preventDefault();
		var width = $(this).find('#width').val();
		var height = $(this).find('#height').val();
		var mine = $(this).find('#mines').val();
		if(width >= 5 && width <= 50 && height >= 5 && height <=30 && mine > 0){
			mine = mine > width * height ? (width * height / 2 ^ 0) : mine;
			// console.log(mine)
			board.reset({
				width : width,
				height : height,
				numberOfMines : mine
			});
		}else{
			alert('Wrong input');
		}
	})
	board.init({
		width : 10,
		height : 10,
		numberOfMines : 10
	});
})