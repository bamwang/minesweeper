

function JQElement (i, j, status){
	var self = this;
	self.number = 0;
	self.$ = $('<div class="block" data-i=' + i + ' data-j=' + j + ' data-status='+ status +'>');
}
JQElement.prototype.open = function() {
	var self = this;
	self.$.addClass('open');
	self.$.attr('data-status','opened');
	self.$.addClass('n_'+self.number);
	self.removeHandler();
};
JQElement.prototype.open2 = function() {
	var self = this;
	self.$.animate('background','yellow');
	self.$.attr('data-status','opened');
	self.$.text(self.number);
	self.removeHandler();
};
JQElement.prototype.check = function(){
	var self = this;
	self.removeHandler();
	self.$.addClass('wrong');
}
JQElement.prototype.bomb = function() {
	var self = this;
	self.open();
	self.$.addClass('bomb');
	self.$.attr('data-status','over');
	self.removeHandler();
	// self.$.text(self.number);
};
JQElement.prototype.bomb2 = function() {
	var self = this;
	self.$.animate('background','pink');
	self.$.attr('data-status','over');
	self.removeHandler();
	// self.$.text(self.number);
};
JQElement.prototype.removeHandler = function() {
	var self = this;
	self.$.off('contextmenu');
	self.$.off('click');
	self.$.on('contextmenu',function(){
		event.preventDefault();
	});
};
JQElement.prototype.setNumber = function(number){
	var self = this;
	self.number = number;
	// console.log(self.number);
}
JQElement.prototype.mark = function() {
	var self = this;
	self.$.attr('data-status','marked');
	self.$.addClass('mark');
};
JQElement.prototype.unmark = function() {
	var self = this;
	self.$.attr('data-status','closed');
	self.$.removeClass('mark');
};
JQElement.prototype.assignLeftClickHandler = function(leftClickHandler, block) {
	var self = this;
	self.$.on('click',function(){
		leftClickHandler(block);
	});
}
JQElement.prototype.assignRightClickHandler = function(rightClickHandler, block) {
	var self = this;
	self.$.on('contextmenu',function(){
		event.preventDefault();
		rightClickHandler(block);
	});
}

function Block ( i, j, isMine ) {
	var self = this;
	//private variables
	var _j = j;
	var _i = i;
	var _jQElementLeftClickHandler = self.getJQElementLeftClickHandler();
	var _jQElementRightClickHandler = self.getJQElementRightClickHandler();

	//public variables
	self.number = 0;
	self.isMine = isMine;
	self.status = 'closed';
	self.neighbors = {};
	self.jQElement = new JQElement(_i, _j, self.status);
	//init
	// console.log(self.jQElement);
	self.jQElement.assignLeftClickHandler( _jQElementLeftClickHandler, self );
	self.jQElement.assignRightClickHandler( _jQElementRightClickHandler, self );
}
Block.prototype.setNeighbors = function( neighbors ){
	var self = this;
	self.neighbors = neighbors;
	if(self.isMine) self.number = -1;
	else
		for( var __item in self.neighbors )
			if( self.neighbors[__item] && self.neighbors[__item].isMine ) self.number++;
	// console.log(self.number);
	self.jQElement.setNumber(self.number);
}
Block.prototype.open = function() {
	var self = this;
	// console.log(self.isMine);
	if(self.isMine && self.status == 'closed'){
		self.status = 'open';
		self.jQElement.bomb();
		self.board.gameover();
		// self.gameover2()
	}else{
		if(self.status == 'closed'){
			self.status = 'opened';
			// console.log('to open');
			self.jQElement.open();
			self.board.open();
			if(self.number == 0){
				self.openNeighbors();
			}
		}
	}
};
Block.prototype.gameover = function(){
	var self = this;
	// console.log(self);
	if(self.isMine && self.status == 'closed'){
		self.jQElement.open();
	}else if(!self.isMine && self.status == 'marked'){
		self.jQElement.check();
	}else{
		self.jQElement.removeHandler();
	}
}

Block.prototype.gameover2 = function(){
	var self = this;
	// console.log(self);
	if(self.isMine && self.status == 'closed'){
		self.jQElement.bomb2();
	}else if(!self.isMine && self.status == 'marked'){
		self.jQElement.check();
	}else{
		self.jQElement.open2();
		self.jQElement.removeHandler();
	}
	for( var __i in self.neighbors){
		if(self.neighbors[__i])
			self.neighbors[__i].gameover2()
	}
}
Block.prototype.win = function(){
	var self = this;
	if(self.status == 'closed' || self.status == 'marked')
		self.jQElement.removeHandler();
}
Block.prototype.getJQElementLeftClickHandler = function(){
	return function leftClickHandler(self){
		var _i = $(this).attr('data-i');
		var _j = $(this).attr('data-j');
		// console.log(self);
		self.open();
	};
}
Block.prototype.getJQElementRightClickHandler = function(){
	return function rightClickHandler(self){
		var _i = $(this).attr('data-i');
		var _j = $(this).attr('data-j');
		self.mark();
	};
}
Block.prototype.openNeighbors = function() {
	var self = this;
	for( var __item in self.neighbors ){
		if( self.neighbors[__item] && self.neighbors[__item].status == 'closed' ) self.neighbors[__item].open();
	}
};
Block.prototype.mark = function() {
	var self = this;
	if( self.status == 'closed' ){
		self.status = 'marked';
		self.jQElement.mark();
		self.board.mark(1);
	}
	else{
		self.status = 'closed';
		self.jQElement.unmark();
		self.board.mark(-1);
	}
};


function Board($container){
	var _data = undefined;
	var _config = undefined;
	var _blockData= undefined;
	var self = this;
	var blocks = [];
	var _$container = $container;
	var _$field = _$container.find('#field');
	var _$button = _$container.find('#button');
	var _$timer = _$container.find('#timer');
	var _$count = _$container.find('#count');
	var _seconds = 0;
	var _interval = undefined;
	Block.prototype.board=self;
	
	function generateMineKeys(width, height, numberOfMines){
		var mineKeys = {};
		var number = 0;
		var total = width * height;
		while(number < numberOfMines){
			var key = Math.random() * total ^ 0;
			if( mineKeys[key] == undefined ){
				mineKeys[key] = true;
				number++;
			}
		}
		return mineKeys;
	}
	function generateData(width, height, numberOfMines){
		var blockData = [];
		var mineKeys = generateMineKeys(width, height, numberOfMines);
		for (var i = 0; i < height; i++) {
				blockData[i] = [];
			for (var j = 0; j < width; j++) {
				if(mineKeys[i * width + j])
					blockData[i][j]=true;
				else
					blockData[i][j]=false;
			}
		}
		var data = {
			numberOfMines : numberOfMines,
			numberOfBlocks : width * height,
			blockData : blockData
		}
		return data;
	}

	self.init = function init(config){
		_config = config;
		_data = generateData(config.width, config.height, config.numberOfMines);
		// console.log(_data)
		_blockData = _data.blockData;
		_numberOfMines = _data.numberOfMines;
		_numberOfBlocks = _data.numberOfBlocks;
		_numberOfSafeBlock = _numberOfBlocks - _numberOfMines;
		_numberOfOpenedBlock = 0;
		_numberOfMarks = 0;
		_seconds = 0;
		_interval = undefined;
		_$field.css({'width': _blockData[0].length * 24});
		_$container.css({'width': _blockData[0].length * 24 + 4});
		for (var i = 0; i < _blockData.length; i++) {
			blocks[i] = [];
			for (var j = 0; j < _blockData[i].length; j++) {
				blocks[i][j] = new Block( i, j, _blockData[i][j]);
				_$field.append(blocks[i][j].jQElement.$);
			}
		}
		for (var i = 0; i < _blockData.length; i++) {
			for (var j = 0; j < _blockData[i].length; j++) {
				var neighbors = {
					west : (j>0) ? blocks[i][j-1] : undefined,
					northWest : (j>0 && i>0) ? blocks[i-1][j-1] : undefined,
					north : (i>0) ? blocks[i-1][j] : undefined,
					northEast : (i>0 && j<_blockData[0].length-1) ? blocks[i-1][j+1] : undefined,
					east : (j<_blockData[0].length-1) ? blocks[i][j+1] : undefined,
					southEast : (j<_blockData[0].length-1 && i<_blockData.length-1) ? blocks[i+1][j+1] : undefined,
					south : (i<_blockData.length-1) ? blocks[i+1][j] : undefined,
					southWest : (j>0 && i<_blockData.length-1) ? blocks[i+1][j-1] : undefined,
				}
				blocks[i][j].setNeighbors( neighbors );
			}
		}
		_$timer.text(0);
		_$count.text(_numberOfMines);
		_interval = setInterval(function(){
			_seconds++;
			_$timer.text(_seconds)
		},1000);
	}
	self.gameover = function gameover(){
		_$button.addClass('over');
		for (var i = 0; i < blocks.length; i++) {
			for (var j = 0; j < blocks[i].length; j++) {
				blocks[i][j].gameover();
			}
		}
		clearInterval(_interval);
	}
	self.open = function open(){
		_numberOfOpenedBlock++;
		if( _numberOfOpenedBlock == _numberOfSafeBlock ){
			alert('win');
			clearInterval(_interval);
			for (var i = 0; i < blocks.length; i++) {
				for (var j = 0; j < blocks[i].length; j++) {
					blocks[i][j].win();
				}
			}
		}
	}
	self.mark = function mark(n){
		_numberOfMarks+=n;
		_$count.text(_numberOfMines-_numberOfMarks);
	}
	self.destroy = function destroy(){
		_$button.removeClass('over');
		_blockData = null;
		clearInterval(_interval);
		_$field.html('');
	}
	self.reset = function reset(config){
		var config = config ? config : _config;
		self.destroy();
		self.init(config);
	}
	_$button.on('click', function(){
		self.reset();
	})
}