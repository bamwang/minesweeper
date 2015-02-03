

function JQElement (i, j, status){
	var self = this;
	self.number = 0;
	self.$ = $('<div class="block" data-i=' + i + ' data-j=' + j + ' data-status='+ status +'>');
}
JQElement.prototype.open = function() {
	var self = this;
	// console.log('jQElement open');
	// console.log(self.$);
	// console.log(self.number);
	self.$.css('background','white');
	self.$.attr('data-status','opened');
	self.$.text(self.number);
};
JQElement.prototype.check = function(){
	var self = this;
	self.$.css('background','gray');
}
JQElement.prototype.bomb = function() {
	var self = this;
	self.$.css('background','red');
	self.$.attr('data-status','over');
	// self.$.text(self.number);
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
		self.board.gameover();
	}else{
		if(self.status == 'closed'){
			self.status = 'opened';
			// console.log('to open');
			self.jQElement.open();
			if(self.number == 0){
				self.openNeighbors();
			}
		}
	}
};
Block.prototype.gameover = function(){
	var self = this;
	// console.log(self);
	if(self.isMine && self.status != 'marked'){
		self.jQElement.bomb();
	}else if(!self.isMine){
		self.jQElement.open();
		if(self.status == 'marked')
			self.jQElement.check();
	}
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
	}
	else{
		self.status = 'closed';
		self.jQElement.unmark();
	}
};


function Board(data, $container){
	var blocks = [];
	var _$container = $container;
	Block.prototype.board=this;
	this.init = function init(){
		for (var i = 0; i < data.length; i++) {
			blocks[i] = [];
			for (var j = 0; j < data[i].length; j++) {
				blocks[i][j] = new Block( i, j, data[i][j]);
				_$container.append(blocks[i][j].jQElement.$);
			}
		}
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j < data[i].length; j++) {
				var neighbors = {
					west : (j>0) ? blocks[i][j-1] : undefined,
					northWest : (j>0 && i>0) ? blocks[i-1][j-1] : undefined,
					north : (i>0) ? blocks[i-1][j] : undefined,
					northEast : (i>0 && j<data[0].length-1) ? blocks[i-1][j+1] : undefined,
					east : (j<data[0].length-1) ? blocks[i][j+1] : undefined,
					southEast : (j<data[0].length-1 && i<data.length-1) ? blocks[i+1][j+1] : undefined,
					south : (i<data.length-1) ? blocks[i+1][j] : undefined,
					southWest : (j>0 && i<data.length-1) ? blocks[i+1][j-1] : undefined,
				}
				if(i==2&&j==3)console.log(neighbors)
				blocks[i][j].setNeighbors( neighbors );
			}
		}
	}
	this.gameover = function gameover(){
		for (var i = 0; i < blocks.length; i++) {
			for (var j = 0; j < blocks[i].length; j++) {
				blocks[i][j].gameover();
			}
		}
	}
}