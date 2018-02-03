function removeFromArray( arr, obj ) {
	for ( var i = arr.length - 1; i >= 0; i-- ) {
		if ( arr[ i ] == obj ) {
			arr.splice( i, 1 );
		}
	}
}

function Heuristic( from, target ) {
	if ( currentHeur == 1 )
		var d = abs( from.i - target.i ) + abs( from.j - target.j );
	else if ( currentHeur == 2 )
		var d = dist( from.i, from.j, target.i, target.j );
	else if ( currentHeur == 3 )
		var d = sq( target.i - from.i ) + sq( target.j - from.j );
	return d;
}

var arrSize = 25;
var wid = 0;

var nodes = new Array( arrSize );
var savedNodes;
var openSet = [];
// var closedSet = [];
var path = [];
var startNode = null;
var targetNode = null;
var current = null;

var isReady = false;
// var isBuilding = false;
var isNoLoop = false;
var isMovingStart = false;
var isMovingTarget = false;

var isControlsExist = false;
var genWallsButton;
var startButton;
var restartButton;
var resetButton;
var wallDens;
var gridSize;
var gridSizeButton;

var manhCheckbox;
var pythagorCheckbox;
var squaresCheckbox;
var currentHeur = 3;

document.oncontextmenu = function() {
	return false;
}

function setSizeOfGrid() {
	arrSize = gridSize.value();
	wid = height / arrSize;
	reset();
}

function generateWalls() {
	var wallsProbability = wallDens.value() / 100;

	//console.log(wallDens.value() + "%");
	for ( var i = 0; i < arrSize; i++ ) {
		for ( var j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ].generateWall( wallsProbability );
		}
	}
}

function startSearch() {
	isReady = true;
}

function restartLevel() {
	for ( var i = 0; i < arrSize; i++ ) {
		for ( var j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ].isOpened = false;
			nodes[ i ][ j ].isClosed = false;
		}
	}
	// nodes = new Array( arrSize );
	openSet = [];
	path = [];
	startNode.isWall = false;
	targetNode.isWall = false;
	openSet.push( startNode );
	startNode.isOpened = true;
	// startNode = null;
	// targetNode = null;
	current = null;

	isReady = false;
	isMovingStart = false;
	isMovingTarget = false;
	isNoLoop = false;
	loop();
}

function reset() {
	wid = height / arrSize;

	nodes = new Array( arrSize );
	//Creating 2D array
	for ( var i = 0; i < arrSize; i++ ) {
		nodes[ i ] = new Array( arrSize );
	}
	for ( var i = 0; i < arrSize; i++ ) {
		for ( var j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ] = new Node( i, j );
		}
	}
	for ( var i = 0; i < arrSize; i++ ) {
		for ( var j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ].pushNeighbors( nodes );
		}
	}

	openSet = [];
	path = [];
	current = null;

	startNode = nodes[ 0 ][ 0 ];
	targetNode = nodes[ arrSize - 1 ][ arrSize - 1 ];
	startNode.isWall = false;
	targetNode.isWall = false;
	openSet.push( startNode );
	startNode.isOpened = true;

	isReady = false;
	isMovingStart = false;
	isMovingTarget = false;
	isNoLoop = false;
	loop();
	// setup();
}

function mousePressed() {
	if ( isReady === true )
		return;

	if ( mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height ) {
		var x = int( mouseX / wid );
		var y = int( mouseY / wid );

		if ( mouseButton === LEFT ) {
			if ( nodes[ x ][ y ] == startNode ) {
				isMovingStart = true;
			} else if ( nodes[ x ][ y ] == targetNode ) {
				isMovingTarget = true;
			}
		}
	}
}

function mouseReleased() {
	if ( isReady === true )
		return;

	isMovingStart = false;
	isMovingTarget = false;
}

function keyPressed() {
	if ( keyCode === 82 ) {
		reset();
	}
	//console.log(isReady);

	if ( isReady === true ) {
		return;
	}

	if ( keyCode === 66 ) {
		isReady = true;
	}

	if ( keyCode === 71 ) {
		generateWalls();
	}
	for ( var i = 0; i < arrSize; i++ ) {
		for ( var j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ].show();
		}
	}
}

function changeToManh() {
	currentHeur = 1;
	pythagorCheckbox.checked( false );
	squaresCheckbox.checked( false );
}

function changeToPyth() {
	currentHeur = 2;
	manhCheckbox.checked( false );
	squaresCheckbox.checked( false );
}

function changeToSquares() {
	currentHeur = 3;
	pythagorCheckbox.checked( false );
	manhCheckbox.checked( false );
}

function setup() {
	createCanvas( 750, 750 );
	console.log( "START" );
	wid = height / arrSize;

	if ( isControlsExist == false ) {
		startButton = createButton( "Start" );
		startButton.position( 800, 350 );
		startButton.mousePressed( startSearch );

		restartButton = createButton( "Restart With Same Maze" );
		restartButton.position( startButton.x + startButton.width + 10, startButton.y );
		restartButton.mousePressed( restartLevel );

		resetButton = createButton( "Reset" );
		resetButton.position( restartButton.x + restartButton.width + 10, startButton.y );
		resetButton.mousePressed( reset );

		wallDens = createSlider( 0, 100, 25 );
		wallDens.position( startButton.x, startButton.y + startButton.height + 10 );

		genWallsButton = createButton( "Generate Walls" );
		genWallsButton.position( wallDens.x + wallDens.width + 20, wallDens.y );
		genWallsButton.mousePressed( generateWalls );


		gridSize = createSlider( 5, 100, 25 );
		gridSize.position( wallDens.x, wallDens.y + wallDens.height + 10 );

		gridSizeButton = createButton( "Set Size" );
		gridSizeButton.position( gridSize.x + gridSize.width + 20, gridSize.y );
		gridSizeButton.mousePressed( setSizeOfGrid );


		manhCheckbox = createCheckbox( "Manhattan distance" );
		manhCheckbox.position( gridSize.x, gridSize.y + gridSize.height + 20 );
		manhCheckbox.changed( changeToManh );

		pythagorCheckbox = createCheckbox( "Pythagorean distance" );
		pythagorCheckbox.position( manhCheckbox.x, manhCheckbox.y + manhCheckbox.height + 10 );
		pythagorCheckbox.changed( changeToPyth );

		squaresCheckbox = createCheckbox( "Square distance", true );
		squaresCheckbox.position( pythagorCheckbox.x, pythagorCheckbox.y + pythagorCheckbox.height + 10 );
		squaresCheckbox.changed( changeToSquares );

		isControlsExist = true;
	}

	//Creating 2D array
	for ( var i = 0; i < arrSize; i++ ) {
		nodes[ i ] = new Array( arrSize );
	}

	for ( var i = 0; i < arrSize; i++ ) {
		for ( var j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ] = new Node( i, j );
		}
	}
	for ( var i = 0; i < arrSize; i++ ) {
		for ( var j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ].pushNeighbors( nodes );
		}
	}

	//startNode = nodes[int(random(arrSize-1))][int(random(arrSize-1))];
	//targetNode = nodes[int(random(arrSize-1))][int(random(arrSize-1))];
	startNode = nodes[ 0 ][ 0 ];
	targetNode = nodes[ arrSize - 1 ][ arrSize - 1 ];
	startNode.isWall = false;
	targetNode.isWall = false;
	openSet.push( startNode );
	startNode.isOpened = true;
	loop();
}

function draw() {
	// console.log(openSet.length + " " + closedSet.length);
	if ( isNoLoop == true ) {
		return;
	}

	background( 220 );
	for ( var i = 0; i < arrSize; i++ ) {
		for ( var j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ].show();
		}
	}

	//MOUSE CONTROLS FOR BUILDING WALLS
	if ( isReady == false ) {
		//console.log("BUILDING WALLS");
		if ( mouseIsPressed ) {
			if ( mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height ) {
				var x = int( mouseX / wid );
				var y = int( mouseY / wid );

				if ( mouseButton === LEFT ) {
					if ( nodes[ x ][ y ].isWall == false ) {
						if ( isMovingStart ) {
							startNode.isOpened = false;
							startNode = nodes[ x ][ y ];
							startNode.isWall = false;
							openSet = [];
							openSet.push( startNode );
							startNode.isOpened = true;
						} else if ( isMovingTarget ) {
							targetNode = nodes[ x ][ y ];
							targetNode.isWall = false;
						} else {
							nodes[ x ][ y ].isWall = true;
						}
					}
				} else if ( mouseButton ===  RIGHT ) {
					nodes[ x ][ y ].isWall = false;
				}
			}
			for ( var i = 0; i < arrSize; i++ ) {
				for ( var j = 0; j < arrSize; j++ ) {
					nodes[ i ][ j ].pushNeighbors( nodes );
				}
			}
		}

	}

	if ( isReady == false )
		return;
	//console.log("SEARCHING FOR TARGET");

	//ASTAR ALGORITHM
	if ( openSet.length > 0 ) {
		var winnerInd = 0;
		for ( var i = 0; i < openSet.length; i++ ) {
			if ( openSet[ i ].f < openSet[ winnerInd ].f ) {
				winnerInd = i;
				//console.log(i);
			}
		}

		current = openSet[ winnerInd ];

		if ( current == targetNode ) {
			console.log( "DONE!" );
			isNoLoop = true;

			reconstructPath( current );
			noLoop();
			// return;
		}

		removeFromArray( openSet, current );
		// closedSet.push( current );
		current.isOpened = false;
		current.isClosed = true;


		for ( var i = 0; i < current.neighbors.length; i++ ) {
			var neighbor = current.neighbors[ i ];
			// if ( !closedSet.includes( neighbor ) && neighbor.isWall == false ) {
			if ( neighbor.isClosed == false && neighbor.isWall == false ) {

				var tempG = current.g + Heuristic( neighbor, current );

				// Is this a better path than before?
				var newPath = false;
				// if ( openSet.includes( neighbor ) ) {
				if ( neighbor.isOpened ) {
					if ( tempG < neighbor.g ) {
						neighbor.g = tempG;
						newPath = true;
					}
				} else {
					neighbor.g = tempG;
					newPath = true;
					openSet.push( neighbor );
					neighbor.isOpened = true;
				}

				// Yes, it's a better path
				if ( newPath ) {
					neighbor.h = Heuristic( neighbor, targetNode );
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previous = current;
				}
			}
		}
	} else {
		console.log( "NO SOLUTION" );
		isNoLoop = true;
		noLoop();
		// return;
	}
	reconstructPath( current );

	//for (var i =  0; i < path.length; i++) {
	//  path[i].show(0, 0, 255);
	//}
	//console.log(current);
	//console.log(path);
}

function reconstructPath( from ) {
	path = [];
	var temp = from;
	path.push( temp );
	while ( temp.previous != null ) {
		path.push( temp.previous );
		temp = temp.previous;
	}

	noFill();
	stroke( 0, 0, 255 );
	strokeWeight( 4 );
	beginShape();
	for ( var i = 0; i < path.length; i++ ) {
		vertex( path[ i ].i * wid + wid / 2, path[ i ].j * wid + wid / 2 );
	}
	endShape();
	noStroke();
}
