var testData = [
	[false, false, false, true, false],
	[true, false, false, true, false],
	[true, false, false, false, false],
	[true, false, false, false, false],
	[true, false, false, false, false],
	[false, false, false, true, false],
	[true, false, false, true, false],
	[true, false, false, false, false],
	[true, false, false, false, false],
	[true, false, false, false, false],
	[false, false, false, true, false],
	[true, false, false, true, false],
	[true, false, false, false, false],
	[true, false, false, false, false],
	[true, false, false, false, false],
	[false, false, false, true, false],
	[true, false, false, true, false],
	[true, false, false, false, false],
	[true, false, false, false, false],
	[true, false, false, false, false],
	[false, false, false, true, false],
	[true, false, false, true, false],
	[true, false, false, false, false],
	[true, false, false, false, false],
	[true, false, false, false, false],
]


$(function () {
	// var board = new Board(testData);
	function generateMineKeys(width, height, numberOfMine){
		var mineKeys = {};
		var number = 0;
		var total = width * height;
		while(number < numberOfMine){
			var key = Math.random() * total ^ 0;
			if( mineKeys[key] == undefined ){
				mineKeys[key] = true;
				number++;
			}
		}
		return mineKeys;
	}
	function generateData(width, height, numberOfMine){
		var blockData = [];
		var mineKeys = generateMineKeys(width, height, numberOfMine);
		for (var i = 0; i < height; i++) {
				blockData[i] = [];
			for (var j = 0; j < height; j++) {
				if(mineKeys[i * width + j])
					blockData[i][j]=true;
				else
					blockData[i][j]=false;
			}
		}
		data = {
			numberOfMines : numberOfMine,
			numberOfBlocks : width * height,
			blockData : blockData
		}
		return data;
	}
	
	board = new Board(generateData(20, 20, 140), $('#board'));
	board.init();
})