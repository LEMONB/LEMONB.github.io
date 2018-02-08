function removeFromArray( arr, obj ) {
	for ( let i = arr.length - 1; i >= 0; i-- ) {
		if ( arr[ i ] == obj ) {
			arr.splice( i, 1 );
		}
	}
}

function Heuristic( from, target ) {
	let d = 0.0;
	if ( currentHeur == 1 ) {
		d = abs( from.i - target.i ) + abs( from.j - target.j );
		// d += 1;
	} else if ( currentHeur == 2 )
		d = dist( from.i, from.j, target.i, target.j );
	else {
		d = sq( target.i - from.i ) + sq( target.j - from.j );
		// d += 10;
	}
	// console.log( currentHeur + ", " + from.i + " " + from.j + " -> " + target.i + " " + target.j + ", dist: " + d );
	return d;
}

let arrSize = 25;
let wid = 0;

let nodes = new Array( arrSize );
let savedNodes;
let openSet = [];
// let closedSet = [];
let path = [];
let startNode = null;
let targetNode = null;
let current = null;

let isReady = false;
// let isBuilding = false;
let isNoLoop = false;
let isMovingStart = false;
let isMovingTarget = false;

let isControlsExist = false;
let wallDens;
let gridSize;

let manhCheckbox;
let pythagorCheckbox;
let squaresCheckbox;
let currentHeur = 2;

let lastRunInfo;
let timer = 0.0;

document.oncontextmenu = function() {
	return false;
}

function setSizeOfGrid() {
	arrSize = gridSize.value();
	wid = height / arrSize;
	reset();
}

function generateWalls() {
	let wallsProbability = wallDens.value() / 100;

	//console.log(wallDens.value() + "%");
	for ( let i = 0; i < arrSize; i++ ) {
		for ( let j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ].generateWall( wallsProbability );
		}
	}
}

function startSearch() {
	isReady = true;
	timer = 0.0;
}

function restartLevel() {
	for ( let i = 0; i < arrSize; i++ ) {
		for ( let j = 0; j < arrSize; j++ ) {
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
	for ( let i = 0; i < arrSize; i++ ) {
		nodes[ i ] = new Array( arrSize );
	}
	for ( let i = 0; i < arrSize; i++ ) {
		for ( let j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ] = new Node( i, j );
		}
	}
	for ( let i = 0; i < arrSize; i++ ) {
		for ( let j = 0; j < arrSize; j++ ) {
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
		let x = int( mouseX / wid );
		let y = int( mouseY / wid );

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
	for ( let i = 0; i < arrSize; i++ ) {
		for ( let j = 0; j < arrSize; j++ ) {
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
		let startButton = createButton( "Start" );
		startButton.position( 800, 350 );
		startButton.mousePressed( startSearch );

		let restartButton = createButton( "Restart With Same Maze" );
		restartButton.position( startButton.x + startButton.width + 10, startButton.y );
		restartButton.mousePressed( restartLevel );

		let resetButton = createButton( "Reset" );
		resetButton.position( restartButton.x + restartButton.width + 10, startButton.y );
		resetButton.mousePressed( reset );

		wallDens = createSlider( 0, 100, 25 );
		wallDens.position( startButton.x, startButton.y + startButton.height + 10 );

		let genWallsButton = createButton( "Generate Walls" );
		genWallsButton.position( wallDens.x + wallDens.width + 20, wallDens.y );
		genWallsButton.mousePressed( generateWalls );


		gridSize = createSlider( 5, 100, 25 );
		gridSize.position( wallDens.x, wallDens.y + wallDens.height + 10 );

		let gridSizeButton = createButton( "Set Size" );
		gridSizeButton.position( gridSize.x + gridSize.width + 20, gridSize.y );
		gridSizeButton.mousePressed( setSizeOfGrid );


		manhCheckbox = createCheckbox( "Manhattan distance" );
		manhCheckbox.position( gridSize.x, gridSize.y + gridSize.height + 20 );
		manhCheckbox.changed( changeToManh );

		pythagorCheckbox = createCheckbox( "Pythagorean distance", true );
		pythagorCheckbox.position( manhCheckbox.x, manhCheckbox.y + manhCheckbox.height + 10 );
		pythagorCheckbox.changed( changeToPyth );

		squaresCheckbox = createCheckbox( "Square distance" );
		squaresCheckbox.position( pythagorCheckbox.x, pythagorCheckbox.y + pythagorCheckbox.height + 10 );
		squaresCheckbox.changed( changeToSquares );

		lastRunInfo = createP( "" );

		function timeIt() {
			// console.log( timer );
			timer++;
		}
		setInterval( timeIt, 1000 );

		isControlsExist = true;
	}

	//Creating 2D array
	for ( let i = 0; i < arrSize; i++ ) {
		nodes[ i ] = new Array( arrSize );
	}

	for ( let i = 0; i < arrSize; i++ ) {
		for ( let j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ] = new Node( i, j );
		}
	}
	for ( let i = 0; i < arrSize; i++ ) {
		for ( let j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ].pushNeighbors( nodes );
		}
	}

	startNode = nodes[ 0 ][ 0 ];
	targetNode = nodes[ arrSize - 1 ][ arrSize - 1 ];
	startNode.isWall = false;
	targetNode.isWall = false;
	openSet.push( startNode );
	startNode.isOpened = true;
	loop();
}

function draw() {
	if ( isNoLoop == true ) {
		return;
	}

	background( 220 );
	for ( let i = 0; i < arrSize; i++ ) {
		for ( let j = 0; j < arrSize; j++ ) {
			nodes[ i ][ j ].show();
		}
	}

	//MOUSE CONTROLS FOR BUILDING WALLS
	if ( isReady == false ) {
		//console.log("BUILDING WALLS");
		if ( mouseIsPressed ) {
			if ( mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height ) {
				let x = int( mouseX / wid );
				let y = int( mouseY / wid );

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
			for ( let i = 0; i < arrSize; i++ ) {
				for ( let j = 0; j < arrSize; j++ ) {
					nodes[ i ][ j ].pushNeighbors( nodes );
				}
			}
		}

	}

	if ( isReady == false )
		return;
	//console.log("SEARCHING FOR TARGET");

	//ASTAR ALGORITHM
	// while ( openSet.length > 0 ) {

	if ( openSet.length > 0 ) {
		let winnerInd = 0;
		for ( let i = 0; i < openSet.length; i++ ) {
			if ( openSet[ i ].f < openSet[ winnerInd ].f ) {
				winnerInd = i;
				//console.log(i);
			}
		}

		current = openSet[ winnerInd ];

		if ( current == targetNode ) {
			console.log( "DONE!" );
			isNoLoop = true;

			// background( 220 );
			// for ( let i = 0; i < arrSize; i++ ) {
			// 	for ( let j = 0; j < arrSize; j++ ) {
			// 		nodes[ i ][ j ].show();
			// 	}
			// }
			reconstructPath( current );
			let steps = path.length - 1;
			lastRunInfo.html( "Steps: " + steps + "      Time: " + timer + " seconds" );
			noLoop();
			// return;
		}

		removeFromArray( openSet, current );
		// closedSet.push( current );
		current.isOpened = false;
		current.isClosed = true;


		for ( let i = 0; i < current.neighbors.length; i++ ) {
			let neighbor = current.neighbors[ i ];
			// if ( !closedSet.includes( neighbor ) && neighbor.isWall == false ) {
			if ( neighbor.isClosed == false && neighbor.isWall == false ) {

				let tempG = current.g + Heuristic( neighbor, current );

				// Is this a better path than before?
				let newPath = false;
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
	// }
	//for (let i =  0; i < path.length; i++) {
	//  path[i].show(0, 0, 255);
	//}
	//console.log(current);
	//console.log(path);
}

function reconstructPath( from ) {
	path = [];
	let temp = from;
	path.push( temp );
	while ( temp.previous != null ) {
		path.push( temp.previous );
		temp = temp.previous;
	}

	noFill();
	stroke( 0, 0, 255 );
	strokeWeight( 4 );
	beginShape();
	for ( let i = 0; i < path.length; i++ ) {
		vertex( path[ i ].i * wid + wid / 2, path[ i ].j * wid + wid / 2 );
	}
	endShape();
	noStroke();
}
