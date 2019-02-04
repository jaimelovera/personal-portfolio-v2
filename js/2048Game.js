
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var boardValues=[ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ];
var coordinates = [ [10,10], [10,100] , [10,190], [10,280], [100,10], [100,100] 
				, [100,190], [100,280], [190,10], [190,100] , [190,190], [190,280]
				, [280,10], [280,100] , [280,190], [280,280]];
var tilesChanged = false;
var originalLine1= [0, 0, 0, 0];
var originalLine2= [0, 0, 0, 0];
var originalLine3= [0, 0, 0, 0];
var originalLine4= [0, 0, 0, 0];
var reversedML1= [0, 0, 0, 0];
var reversedML2= [0, 0, 0, 0];
var reversedML3= [0, 0, 0, 0];
var reversedML4= [0, 0, 0, 0];
var tileEmpty = new Image();
tileEmpty.src = "img/tiles/tileEmpty.png";
var tile2 = new Image();
tile2.src = "img/tiles/tile2.png";
var tile4 = new Image();
tile4.src = "img/tiles/tile4.png";
var tile8 = new Image();
tile8.src = "img/tiles/tile8.png";
var tile16 = new Image();
tile16.src = "img/tiles/tile16.png";
var tile32 = new Image();
tile32.src = "img/tiles/tile32.png";
var tile64 = new Image();
tile64.src = "img/tiles/tile64.png";
var tile128 = new Image();
tile128.src = "img/tiles/tile128.png";
var tile256 = new Image();
tile256.src = "img/tiles/tile256.png";
var tile512 = new Image();
tile512.src = "img/tiles/tile512.png";
var tile1024 = new Image();
tile1024.src = "img/tiles/tile1024.png";
var tile2048 = new Image();
tile2048.src = "img/tiles/tile2048.png";


//Display the current board.
function printBoard(){
	var tile = 0;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			ctx.drawImage(correspondingImage(boardValues[j][i]), coordinates[tile][0], coordinates[tile][1]);
		tile++;
		}
	}

	if(gameWon() == true){
		ctx.font = "50px Comic Sans MS";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText("YOU WON!!", 190,200); 
	}
	else if (gameLost() == true){
		ctx.font = "50px Comic Sans MS";
		ctx.fillStyle = "red";
		ctx.textAlign = "center";
		ctx.fillText("YOU LOST!!", 190,200); 
	}


	console.log(boardValues[0]);
	console.log(boardValues[1]);
	console.log(boardValues[2]);
	console.log(boardValues[3]);
}

//returns the image for the specified value.
function correspondingImage(number){
	if (number == 0) {
		return tileEmpty;
	}
	else if (number == 2){
		return tile2;
	}
	else if (number == 4){
		return tile4;
	}
	else if (number == 8){
		return tile8;
	}
	else if (number == 16){
		return tile16;
	}
	else if (number == 32){
		return tile32;
	}
	else if (number == 64){
		return tile64;
	}
	else if (number == 128){
		return tile128;
	}
	else if (number == 256){
		return tile256;
	}
	else if (number == 512){
		return tile512;
	}
	else if (number == 1024){
		return tile1024;
	}
	else if (number == 2048){
		return tile2048;
	}
}

//compares arrays. True if they are the same values.
function compareArrays (array1, array2) {
	for (i = 0; i < 4; i++) {
		if(array1[i] != array2[i]){
			return false;
		}
	}
	return true;
}

//returns value at specified location on board.
function getTile(row, col) {
	return boardValues[row][col];
}

//sets a tile at specified location to specified value
function setTile(row, col, value) {
	boardValues[row][col] = value;
}

//resets the board to an empty board.
function reset() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			setTile(i, j, 0);
		}
	}
	newTile();
	newTile();
}

//Check if 2048 was acheived
function gameWon() {
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			if (boardValues[i][j] == 2048) {
				return true;
			}
		}
	}
	return false;
}

//Check if game over, no repeated values left/no moves left
function gameLost() {
	//goes through each row.
	for (i = 0; i < 4; i++) {
		var prevTile = boardValues[i][0];
		for (j = 1; j < 4; j++) {
			if (boardValues[i][j] == prevTile || boardValues[i][j] == 0 || prevTile == 0) {
				return false;
			}
			prevTile = boardValues[i][j];
		}
	}
	//goes through each column
	for (i = 0; i < 4; i++) {
		var prevTile = boardValues[0][i];
		for (j = 1; j < 4; j++) {
			if (boardValues[j][i] == prevTile || boardValues[j][i] == 0 || prevTile == 0) {
				return false;
			}
			prevTile = boardValues[j][i];
		}
	}
	return true;
}

//Merge lines, according to the direction moved.
//Shifts tiles over. If 2 tiles are equal they merge. But only the first pair.
function merge(line, direction) {
	var resultLine = [0, 0, 0, 0];
	var resultIndex = 0;
	var lastTileMerged = false;
	var lastTileAdded = 0;

	//merges LEFT or UP
	if(direction == "Left" || direction == "Up"){
		for (i = 0; i < 4; i++) {
			var currentTile = line[i];
			if (currentTile > 0) {
				if ((currentTile == lastTileAdded) && !lastTileMerged) {
					resultLine[resultIndex  - 1] = currentTile * 2;
					lastTileAdded = currentTile * 2;
					lastTileMerged = true; 
				} else {
					resultLine[resultIndex] = currentTile;
					lastTileAdded = currentTile;
					lastTileMerged = false;
					resultIndex ++;
				}
			}
		}
	}
	//merges RIGHT or DOWN
	else if (direction == "Right" || direction == "Down") {
		for (i = 3; i >= 0; i--) {
			var currentTile = line[i];
			if (currentTile > 0) {
				//then merge
				if ((currentTile == lastTileAdded) && !lastTileMerged) {
					resultLine[resultIndex  - 1] = currentTile * 2;
					lastTileAdded = currentTile * 2;
					lastTileMerged = true; 
				} else {
					//or else don't merge
					resultLine[resultIndex] = currentTile;
					lastTileAdded = currentTile;
					lastTileMerged = false;
					resultIndex ++;
				}
			}
		}
	}
	return resultLine;
}

//moves all tiles in the given direction and adds a new random tile if any tiles are moved.
function move(direction, newTileOnOff) {

	//copy original line to an array.
	if(direction == "Up"){
		for(i = 0; i < 4; i++){
			originalLine1[i] = boardValues[i][0];
		}
		for(i = 0; i < 4; i++){
			originalLine2[i] = boardValues[i][1];
		}
		for(i = 0; i < 4; i++){
			originalLine3[i] = boardValues[i][2];
		}
		for(i = 0; i < 4; i++){
			originalLine4[i] = boardValues[i][3];
		}
	}
	if(direction == "Down"){
		for(i = 0; i < 4; i++){
			originalLine1[i] = boardValues[i][0];
		}
		for(i = 0; i < 4; i++){
			originalLine2[i] = boardValues[i][1];
		}
		for(i = 0; i < 4; i++){
			originalLine3[i] = boardValues[i][2];
		}
		for(i = 0; i < 4; i++){
			originalLine4[i] = boardValues[i][3];
		}
	}
	if(direction == "Right"){
		for(i = 0; i < 4; i++){
			originalLine1[i] = boardValues[0][i];
		}
		for(i = 0; i < 4; i++){
			originalLine2[i] = boardValues[1][i];
		}
		for(i = 0; i < 4; i++){
			originalLine3[i] = boardValues[2][i];
		}
		for(i = 0; i < 4; i++){
			originalLine4[i] = boardValues[3][i];
		}
	}
	if(direction == "Left"){
		for(i = 0; i < 4; i++){
			originalLine1[i] = boardValues[0][i];
		}
		for(i = 0; i < 4; i++){
			originalLine2[i] = boardValues[1][i];
		}
		for(i = 0; i < 4; i++){
			originalLine3[i] = boardValues[2][i];
		}
		for(i = 0; i < 4; i++){
			originalLine4[i] = boardValues[3][i];
		}
	}

	// Create new merged line of original line and put it in an array.
	var mergedLine1 = merge(originalLine1,direction);
	var mergedLine2 = merge(originalLine2,direction);
	var mergedLine3 = merge(originalLine3,direction);
	var mergedLine4 = merge(originalLine4,direction);

	//changed mergedlines for RIGHT or DOWN to their reverse order since they get
	//reversed in the proccess of merging, and in order to compare
	//this merged line to the original line to look for a change
	//it must be changed back to normal.
	if(direction == "Right" || direction == "Down"){
		var end = 3;
		for(i =0; i < 4; i++){
			reversedML1[i]=mergedLine1[end];
			reversedML2[i]=mergedLine2[end];
			reversedML3[i]=mergedLine3[end];
			reversedML4[i]=mergedLine4[end];
			end--;

		}
		//check to see if list changed (when direction was right/down)
		if(compareArrays(originalLine1, reversedML1)
				&& compareArrays(originalLine2, reversedML2)
				&& compareArrays(originalLine3, reversedML3)
				&& compareArrays(originalLine4, reversedML4)){
			tilesChanged = false;
		}
		else {
			tilesChanged = true;
		}
	}

	//check to see if list changed (when direction was left/up)
	if(direction == "Left" || direction == "Up"){
		if (compareArrays(originalLine1, mergedLine1)
				&& compareArrays(originalLine2, mergedLine2)
				&& compareArrays(originalLine3, mergedLine3)
				&& compareArrays(originalLine4, mergedLine4)) {
			tilesChanged = false;
		}
		else {
			tilesChanged = true;
		}
	}

	//modify board line to show new values
	for (i = 0; i < 4; i++) {
		if(direction == "Up"){
			setTile(i,0,mergedLine1[i]);
			setTile(i,1,mergedLine2[i]);
			setTile(i,2,mergedLine3[i]);
			setTile(i,3,mergedLine4[i]);
		}
		if(direction == "Down"){
			setTile(i,0,reversedML1[i]);
			setTile(i,1,reversedML2[i]);
			setTile(i,2,reversedML3[i]);
			setTile(i,3,reversedML4[i]);
		}
		if(direction == "Right"){
			setTile(0,i,reversedML1[i]);
			setTile(1,i,reversedML2[i]);
			setTile(2,i,reversedML3[i]);
			setTile(3,i,reversedML4[i]);
		}
		if(direction == "Left"){
			setTile(0,i,mergedLine1[i]);
			setTile(1,i,mergedLine2[i]);
			setTile(2,i,mergedLine3[i]);
			setTile(3,i,mergedLine4[i]);
		}
	}
	if (tilesChanged == true && newTileOnOff == "On") {
		newTile();
	}
}

//generates a new tile of value 2 at random empty location
function newTile() {
	var emptyTileList = [];
	//Get the index of empty tiles
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			if (getTile(i, j) == 0) {
				var emptyIndex = [i, j];
				emptyTileList.push(emptyIndex);
			}
		}
	}
	//Set one tile from empty list and set value to 2.
	if (emptyTileList.length > 0) {
		var randomIndex = (Math.floor(Math.random() * emptyTileList.length));
		var emptyTileIndex = emptyTileList[randomIndex];
		setTile(emptyTileIndex[0], emptyTileIndex[1],2);
	}
}


//starts the game
function start() {
		reset();
		printBoard();
		window.addEventListener('keydown', function (event) {
		    var swoosh = new Audio("mp3/swoosh.mp3");
		    var restart = new Audio("mp3/restart.mp3");
		    key = event.keyCode;
		    if(key==37){
		    	if(gameWon() == false){
			    	move("Left", "On");
			    	if(gameLost() == false && gameWon() == false){
			    		swoosh.play();
			    	}
			    	printBoard();
		    	}
		    }
		    if(key==38){
		    	if(gameWon() == false){
			    	move("Up", "On");
			    	if(gameLost() == false && gameWon() == false){
			    		swoosh.play();
			    	}
			    	printBoard();
		    	}
		    }
		    if(key==39){
		    	if(gameWon() == false){
			    	move("Right", "On");
			    	if(gameLost() == false && gameWon() == false){
			    		swoosh.play();
			    	}
			    	printBoard();
		    	}
		    }
		    if(key==40){
		    	if(gameWon() == false){
			    	move("Down", "On");
			    	if(gameLost() == false && gameWon() == false){
			    		swoosh.play();
			    	}
			    	printBoard();
		    	}
		    }
		    if(key==82){
		    	restart.play();
		    	reset();
		    	printBoard();
		    }
		});
}

window.onload = start;