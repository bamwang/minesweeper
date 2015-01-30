function Block ( i, j, data ) {
	var self = this;
	var j = j;
	var i = i;
	var isMine = data[i][j];
	var number = 0;
	self.status = 'closed';
	var neighbors={
		west : (j>0) ? data[i][j-1] : false,
		northWest : (j>0 && i>0) ? data[i-1][j-1] : false,
		north : (i>0) ? data[i-1][j] : false,
		northEast : (i>0 && j<data.length-1) ? data[i-1][j+1] : false,
		east : (j<data.length-1) ? data[i][j+1] : false,
		southEast : (j<data.length-1 && i<data[0].length-1) ? data[i+1][j+1] : false,
		south : (i<data[0].length-1) ? data[i+1][j] : false,
		southWest : (j>0 && i<data[0].length-1) ? data[i+1][j-1] : false,
	}
	for( var item in neighbors ){
		if( neighbors[item] ) number++;
	}
	self.$element = $('<div class="block" data-i=' + i + ' data-j=' + j + ' data-status=closed>');
	self.$element.on('click',function(){
		if( $(this).attr('data-status')=='closed' ){
			$(this).attr('data-status','open');
			open($(this));
		}else{
			// console.log(i,j)
		}
		function open($element){
			// console.log(isMine);
			if(isMine){
				// console.log($element);
				$element.parent().children('div[data-status=closed]').click();
				$element.css('background','red');
			}else{
				$element.css('background','white');
				$element.text(number);
				if(number==0){
					$element.parent().children('div[data-i=' + (i-1) + '][data-j=' + (j-1) + '][data-status=closed]').css('background','yellow').click();
					$element.parent().children('div[data-i=' + (i-1) + '][data-j=' + (j+1) + '][data-status=closed]').css('background','yellow').click();
					$element.parent().children('div[data-i=' + (i+1) + '][data-j=' + (j-1) + '][data-status=closed]').css('background','yellow').click();
					$element.parent().children('div[data-i=' + (i+1) + '][data-j=' + (j+1) + '][data-status=closed]').css('background','yellow').click();
					$element.parent().children('div[data-i=' + (i) + '][data-j=' + (j-1) + '][data-status=closed]').css('background','yellow').click();
					$element.parent().children('div[data-i=' + (i) + '][data-j=' + (j+1) + '][data-status=closed]').css('background','yellow').click();
					$element.parent().children('div[data-i=' + (i-1) + '][data-j=' + (j) + '][data-status=closed]').css('background','yellow').click();
					$element.parent().children('div[data-i=' + (i+1) + '][data-j=' + (j) + '][data-status=closed]').css('background','yellow').click();
				}
			}
		}
	})
	self.$element.on('contextmenu',function(){
		event.preventDefault();
		if($(this).attr('data-status')=='mine'){
			$(this).css('background','').attr('data-status','closed');	
		}else{
			$(this).css('background','black').attr('data-status','mine');	
		}

	})
}

function Board(data){
	this.blocks = [];
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].length; j++) {
			var block = new Block(i,j,data);
			$('#board').append(block.$element);
		}
	}
}