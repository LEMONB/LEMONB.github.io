function removeFromArray(arr, obj) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == obj) {
      arr.splice(i, 1);
    }
  }
}

function Node(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.isWall = false;
  this.previous = null;
  this.neighbors = [];

  this.generateWall = function(wallsProbability) {
    if (this != startNode && this != targetNode) {
      if (random(1) < wallsProbability)
        this.isWall = true;
      else
        this.isWall = false;
    }
  }

  this.show = function(r, g, b) {
    if ( this.isWall == true)
       fill(0, 0, 0);
    else if (this == startNode)
      fill(0, 255, 255);
    else if (this == targetNode)
      fill(255, 0, 255);
    else
      fill(r, g, b);

     rect( this.i * wid,  this.j * wid, wid-1, wid-1);
  }

  this.pushNeighbors = function(_nodes) {
    if ( this.i < arrSize - 1) {
       this.neighbors.push(_nodes[ this.i + 1][ this.j]);
    }
    if ( this .i > 0) {
       this .neighbors.push(_nodes[ this.i - 1][ this.j]);
    }
    if ( this .j < arrSize - 1) {
       this .neighbors.push(_nodes[ this.i][ this.j + 1]);
    }
    if ( this .j > 0) {
       this .neighbors.push(_nodes[ this.i][ this.j - 1]);
    }
  }
}

function Heuristic(from, target) {
  //var dist = abs(from.i - target.i) + abs(from.j - target.j);
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
var current = null;

var isReady =  false;
var isBuilding =  false;

//var button;
document.oncontextmenu = function() {
    return false;
}
function setup() {
  createCanvas(800, 800);
  console.log("START");
  background(51);
  wid = height / arrSize;

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
  //startNode.show(0, 255, 255);
  //targetNode.show(255, 0, 255);

  //button = createButton("click me", button);
  //button.position(19, 19);
  //button.mousePressed(startSearch);
}

function startSearch() {
  isReady = true;
}

function reset() {
  arrSize = 25;
  wid = 0;

  nodes =  new Array(arrSize);
  openSet =  [];
  closedSet =  [];
  path =  [];
  startNode = null;
  targetNode = null;
  current = null;
  
  isReady =  false;
  isBuilding =  false;
  
  setup();
}

function mouseReleased() {
  if (isReady === true)
    return;
  isBuilding = false;
}

function keyPressed() {
  if (keyCode === 82)
    reset();
    
  console.log(isReady);
  
  if (isReady === true)
    return;


  if (keyCode === 66)
    isReady = true;

  if (keyCode === 71) {
    var wallsProbability = 0.3;

    for (var i =  0; i < arrSize; i++) {
      for (var j =  0; j< arrSize; j++) {
        nodes[i][j].generateWall(wallsProbability);
      }
    }
  }
  for (var i =  0; i < arrSize; i++) {
    for (var j =  0; j< arrSize; j++) {
      nodes[i][j].show(255, 255, 255);
    }
  }
}

function draw() {
  background(51);
  for (var i =  0; i < arrSize; i++) {
    for (var j =  0; j< arrSize; j++) {
      nodes[i][j].show(255, 255, 255);
    }
  }

  if (isReady == false) {
    //console.log("BUILDING WALLS");
    if (mouseIsPressed) {
      if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        if (mouseButton === LEFT) {
          nodes[int(mouseX / wid)][int(mouseY / wid)].isWall = true;
        } else if (mouseButton ===  RIGHT) {
          nodes[int(mouseX / wid)][int(mouseY / wid)].isWall = false;
        }
      }
    }
  }

  if (isReady == false)
    return;

  //console.log("SEARCHING FOR TARGET");
  //console.log(openSet.length + " " + closedSet.length);

  if (openSet.length > 0) {
    var winnerInd =  0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winnerInd].f) {
        winnerInd = i;
        //console.log(i);
      }
    }

    current = openSet[winnerInd];

    if (current == targetNode) {
      for (var i =  0; i < path.length; i++) {
        path[i].show(0, 0, 255);
      }
      console.log("DONE!");
      noLoop();
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    for (var i =  0; i < current.neighbors.length; i++) {
      if (!closedSet.includes(current.neighbors[i]) && current.neighbors[i].isWall == false) {
        var tempG =  current.g + Heuristic(current, targetNode);

        if (!openSet.includes(current.neighbors[i])) {
          openSet.push(current.neighbors[i]);
        } else if (tempG >= current.neighbors[i].g) {
          continue;
        }

        current.neighbors[i].g = tempG;
        current.neighbors[i].h = Heuristic(current.neighbors[i], targetNode);
        current.neighbors[i].f = current.neighbors[i].g + current.neighbors[i].h;
        current.neighbors[i].previous = current;
      }
    }
  } else {
     console.log("NO SOLUTION");
     noLoop();
  }

  for (var i =  0; i < closedSet.length; i++) {
    closedSet[i].show(255, 0, 0);
  }

  for (var i =  0; i < openSet.length; i++) {
    openSet[i].show(0, 255, 0);
  }

  var temp =  current;
  path = [];
  path.push(temp);
  while (temp.previous != null) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (var i =  0; i < path.length; i++) {
    path[i].show(0, 0, 255);
  }
}