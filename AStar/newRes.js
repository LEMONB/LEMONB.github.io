function removeFromArray(arr, obj) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == obj) {
      arr.splice(i, 1);
    }
  }
}

function Heuristic(from, target) {
  //var d = abs(from.i - target.i) + abs(from.j - target.j);
  var d = dist(from.i, from.j, target.i, target.j);
  return d;
}

var arrSize = 25;
var wid = 0;

var nodes =  new Array(arrSize);
var openSet =  [];
var closedSet =  [];
var path =  [];
var startNode = null;
var targetNode = null;
//var current = null;

var isReady =  false;
var isBuilding =  false;
var isSolved = false;

var isControlsExist = false;
var genWallsButton;
var startButton;
var resetButton;
var wallDens;
var gridSize;
var gridSizeButton;
document.oncontextmenu = function() {
  return false;
}

function setup() {
  createCanvas(800, 800);
  console.log("START");
  background(51);
  wid = height / arrSize;

  if (isControlsExist == false) {
    startButton = createButton("Start");
    startButton.position(500, 15);
    startButton.mousePressed(startSearch);

    resetButton = createButton("Reset");
    resetButton.position(startButton.x + startButton.width + 10, startButton.y);
    resetButton.mousePressed(reset);

    wallDens = createSlider(0, 100, 25);
    wallDens.position(startButton.x, startButton.y + startButton.height + 10);

    genWallsButton = createButton("Generate Walls");
    genWallsButton.position(wallDens.x + wallDens.width + 20, wallDens.y);
    genWallsButton.mousePressed(generateWalls);


    gridSize = createSlider(5, 100, 25);
    gridSize.position(wallDens.x, wallDens.y + wallDens.height + 10);

    gridSizeButton = createButton("Set Size");
    gridSizeButton.position(gridSize.x + gridSize.width + 20, gridSize.y);
    gridSizeButton.mousePressed(setSizeOfGrid);

    isControlsExist = true;
  }

  //Creating 2D array
  for (var i =  0; i < arrSize; i++) {
    nodes[i] = new Array(arrSize);
  }

  for (var i =  0; i < arrSize; i++) {
    for (var j =  0; j < arrSize; j++) {
      nodes[i][j] = new Node(i, j);
    }
  }
  for (var i =  0; i < arrSize; i++) {
    for (var j =  0; j < arrSize; j++) {
      nodes[i][j].pushNeighbors(nodes);
    }
  }

  //startNode = nodes[int(random(arrSize-1))][int(random(arrSize-1))];
  //targetNode = nodes[int(random(arrSize-1))][int(random(arrSize-1))];
  startNode = nodes[0][0];
  targetNode = nodes[arrSize-1][arrSize-1];
  startNode.isWall = false;
  targetNode.isWall = false;
  openSet.push(startNode);

  for (var i =  0; i < arrSize; i++) {
    for (var j =  0; j< arrSize; j++) {
      nodes[i][j].show(255, 255, 255);
    }
  }
  loop();
}

function setSizeOfGrid() {
  arrSize = gridSize.value();
  wid = height / arrSize;
  reset();
}

function generateWalls() {
  var wallsProbability = wallDens.value() / 100;

  //console.log(wallDens.value() + "%");
  for (var i =  0; i < arrSize; i++) {
    for (var j =  0; j< arrSize; j++) {
      nodes[i][j].generateWall(wallsProbability);
    }
  }
}

function startSearch() {
  isReady = true;
}

function reset() {
  nodes =  new Array(arrSize);
  openSet = [];
  closedSet = [];
  path = [];
  startNode = null;
  targetNode = null;
  //current = null;

  isReady =  false;
  isBuilding =  false;
  isSolved = false;
  setup();
}

function mouseReleased() {
  if (isReady === true)
    return;
  isBuilding = false;
}

function keyPressed() {
  if (keyCode === 82) {
    reset();
  }
  //console.log(isReady);

  if (isReady === true) {
    return;
  }

  if (keyCode === 66) {
    isReady = true;
  }

  if (keyCode === 71) {
    generateWalls();
  }
  for (var i =  0; i < arrSize; i++) {
    for (var j =  0; j< arrSize; j++) {
      nodes[i][j].show(255, 255, 255);
    }
  }
}

function draw() {
  if (isSolved == false) {
    background(220);
    stroke(0);
    strokeWeight(1);
    for (var i =  0; i < arrSize; i++) {
      for (var j =  0; j< arrSize; j++) {
        nodes[i][j].show(255, 255, 255);
      }
    }
  }

  //MOUSE CONTROLS FOR BUILDING WALLS
  if (isReady == false) {
    //console.log("BUILDING WALLS");
    if (mouseIsPressed) {
      if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        //console.log("CLICKED " + int(mouseX / wid) + " " + int(mouseY / wid));
        if (mouseButton === LEFT) {
          nodes[int(mouseX / wid)][int(mouseY / wid)].isWall = true;
        } else if (mouseButton ===  RIGHT) {
          nodes[int(mouseX / wid)][int(mouseY / wid)].isWall = false;
        }
      }
    }

    for (var i =  0; i < arrSize; i++) {
      for (var j =  0; j < arrSize; j++) {
        nodes[i][j].pushNeighbors(nodes);
      }
    }
  }

  if (isReady == false)
    return;
  //console.log("SEARCHING FOR TARGET");
  //console.log(openSet.length + " " + closedSet.length);

  if (isSolved == true)
    return;

  //ASTAR ALGORITHM
  if (openSet.length > 0) {
    var winnerInd =  0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winnerInd].f) {
        winnerInd = i;
        //console.log(i);
      }
    }

    var current = openSet[winnerInd];

    if (current == targetNode) {
      console.log("DONE!");
      isSolved = true;
      noLoop();
      //return;
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    for (var i =  0; i < current.neighbors.length; i++) {
      if (!closedSet.includes(current.neighbors[i]) && current.neighbors[i].isWall == false) {

        var tempG =  current.g + Heuristic(current.neighbors[i], current);

        // Is this a better path than before?
        var newPath = false;
        if (openSet.includes(current.neighbors[i])) {
          if (tempG < current.neighbors[i].g) {
            current.neighbors[i].g = tempG;
            newPath = true;
          }
        } else {
          current.neighbors[i].g = tempG;
          newPath = true;
          openSet.push(current.neighbors[i]);
        }

        // Yes, it's a better path
        if (newPath) {
          current.neighbors[i].h = Heuristic(current.neighbors[i], targetNode);
          current.neighbors[i].f = current.neighbors[i].g + current.neighbors[i].h;
          current.neighbors[i].previous = current;
        }
      }
    }
  } else {
     console.log("NO SOLUTION");
    isSolved = true;
     noLoop();
    return;
  }
  for (var i =  0; i < closedSet.length; i++) {
    closedSet[i].show(255, 0, 0);
  }

  for (var i =  0; i < openSet.length; i++) {
    openSet[i].show(0, 255, 0);
  }

  path = [];
  var temp =  current;
  path.push(temp);
  while (temp.previous != null) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  noFill();
  stroke(0,0,255);
  strokeWeight(4);
  beginShape();
  for (var i =  0; i < path.length; i++) {
    vertex(path[i].i * wid + wid/2, path[i].j * wid + wid/2);
  }
  endShape();

  //for (var i =  0; i < path.length; i++) {
  //  path[i].show(0, 0, 255);
  //}
  //console.log(current);
  //console.log(path);
}