

function JQElement (i, j, status){
	var self = this;
	self.number = 0;
	self.$ = $('<div class="block" data-i=' + i + ' data-j=' + j + ' data-status='+ status +'>');
}
JQElement.prototype.open = function() {
	var self = this;
	self.$.css('background','white');
	self.$.attr('data-status','opened');
	self.$.text(self.number);
	self.removeHandler();
};
JQElement.prototype.check = function(){
	var self = this;
	self.removeHandler();
	self.$.css('background','gray');
}
JQElement.prototype.bomb = function() {
	var self = this;
	self.$.css('background','red');
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
	self.$.css('background','gold');
};
JQElement.prototype.unmark = function() {
	var self = this;
	self.$.attr('data-status','closed');
	self.$.css('background','');
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


function Board(data, $container){
	var blocks = [];
	var blockData = data.blockData;
	var _numberOfMines = data.numberOfMines;
	var _numberOfBlocks = data.numberOfBlocks;
	var _numberOfSafeBlock = _numberOfBlocks - _numberOfMines;
	var _numberOfOpenedBlock = 0;
	var _numberOfMarks = 0;
	var _$container = $container;
	var _seconds = 0;
	var _interval = undefined;
	Block.prototype.board=this;
	this.init = function init(){
		_$container.css({'width': blockData[0].length * 24});
		for (var i = 0; i < blockData.length; i++) {
			blocks[i] = [];
			for (var j = 0; j < blockData[i].length; j++) {
				blocks[i][j] = new Block( i, j, blockData[i][j]);
				_$container.append(blocks[i][j].jQElement.$);
			}
		}
		for (var i = 0; i < blockData.length; i++) {
			for (var j = 0; j < blockData[i].length; j++) {
				var neighbors = {
					west : (j>0) ? blocks[i][j-1] : undefined,
					northWest : (j>0 && i>0) ? blocks[i-1][j-1] : undefined,
					north : (i>0) ? blocks[i-1][j] : undefined,
					northEast : (i>0 && j<blockData[0].length-1) ? blocks[i-1][j+1] : undefined,
					east : (j<blockData[0].length-1) ? blocks[i][j+1] : undefined,
					southEast : (j<blockData[0].length-1 && i<blockData.length-1) ? blocks[i+1][j+1] : undefined,
					south : (i<blockData.length-1) ? blocks[i+1][j] : undefined,
					southWest : (j>0 && i<blockData.length-1) ? blocks[i+1][j-1] : undefined,
				}
				if(i==2&&j==3)console.log(neighbors)
				blocks[i][j].setNeighbors( neighbors );
			}
		}
		_interval = setInterval(function(){
			_seconds++;
			console.log(_seconds);
		},1000);
	}
	this.gameover = function gameover(){
		for (var i = 0; i < blocks.length; i++) {
			for (var j = 0; j < blocks[i].length; j++) {
				blocks[i][j].gameover();
			}
		}
		clearInterval(_interval);
	}
	this.open = function open(){
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
	this.mark = function mark(n){
		_numberOfMarks+=n;
		console.log('remain mines',  _numberOfMines-_numberOfMarks);
	}
}