const AStar = {
  arrSize: 25,
  wid: 0,
  nodes: [],
  openSet: [],
  path: [],
  startNode: null,
  targetNode: null,
  current: null,
  isReady: false,
  isNoLoop: false,
  isMovingStart: false,
  isMovingTarget: false,
  isControlsExist: false,
  currentHeur: 2,
  timer: 0,
  intervalId: null,
  isLightTheme: false,
  colors: {
    bg: [15, 15, 26],
    grid: [40, 40, 60],
    wall: [61, 61, 92],
    path: [96, 165, 250],
    pathGlow: [96, 165, 250, 80]
  }
};

function updateThemeColors() {
  if (AStar.isLightTheme) {
    AStar.colors = {
      bg: [248, 250, 252],
      grid: [226, 232, 240],
      wall: [148, 163, 184],
      path: [37, 99, 235],
      pathGlow: [37, 99, 235, 60]
    };
  } else {
    AStar.colors = {
      bg: [15, 15, 26],
      grid: [40, 40, 60],
      wall: [61, 61, 92],
      path: [96, 165, 250],
      pathGlow: [96, 165, 250, 80]
    };
  }
}

function removeFromArray(arr, obj) {
  const index = arr.indexOf(obj);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

function Heuristic(a, b) {
  switch (AStar.currentHeur) {
    case 1:
      return abs(a.i - b.i) + abs(a.j - b.j);
    case 2:
      return dist(a.i, a.j, b.i, b.j);
    default:
      return sq(b.i - a.i) + sq(b.j - a.j);
  }
}

function createGrid() {
  AStar.nodes = [];
  for (let i = 0; i < AStar.arrSize; i++) {
    AStar.nodes[i] = [];
    for (let j = 0; j < AStar.arrSize; j++) {
      AStar.nodes[i][j] = new Node(i, j);
    }
  }
  for (let i = 0; i < AStar.arrSize; i++) {
    for (let j = 0; j < AStar.arrSize; j++) {
      AStar.nodes[i][j].pushNeighbors(AStar.nodes);
    }
  }
}

function initNodes() {
  createGrid();
  AStar.startNode = AStar.nodes[0][0];
  AStar.targetNode = AStar.nodes[AStar.arrSize - 1][AStar.arrSize - 1];
  AStar.startNode.isWall = false;
  AStar.targetNode.isWall = false;
  AStar.openSet = [AStar.startNode];
  AStar.startNode.isOpened = true;
  AStar.path = [];
  AStar.current = null;
}

function reset() {
  AStar.wid = height / AStar.arrSize;
  initNodes();
  AStar.isReady = false;
  AStar.isMovingStart = false;
  AStar.isMovingTarget = false;
  AStar.isNoLoop = false;
  AStar.timer = 0;
  updateStats();
  loop();
}

function startSearch() {
  AStar.isReady = true;
  AStar.timer = 0;
  startTimer();
}

function restartLevel() {
  for (let i = 0; i < AStar.arrSize; i++) {
    for (let j = 0; j < AStar.arrSize; j++) {
      AStar.nodes[i][j].isOpened = false;
      AStar.nodes[i][j].isClosed = false;
    }
  }
  AStar.openSet = [];
  AStar.path = [];
  AStar.startNode.isWall = false;
  AStar.targetNode.isWall = false;
  AStar.openSet.push(AStar.startNode);
  AStar.startNode.isOpened = true;
  AStar.current = null;
  AStar.isReady = false;
  AStar.isMovingStart = false;
  AStar.isMovingTarget = false;
  AStar.isNoLoop = false;
  AStar.timer = 0;
  updateStats();
  loop();
}

function generateWalls() {
  const wallsProbability = document.getElementById('wallDensity').value / 100;
  for (let i = 0; i < AStar.arrSize; i++) {
    for (let j = 0; j < AStar.arrSize; j++) {
      AStar.nodes[i][j].generateWall(wallsProbability);
    }
  }
}

function setSizeOfGrid() {
  AStar.arrSize = parseInt(document.getElementById('gridSize').value);
  reset();
}

function startTimer() {
  AStar.timer = 0;
  if (AStar.intervalId) clearInterval(AStar.intervalId);
  AStar.intervalId = setInterval(() => {
    if (AStar.isReady) {
      AStar.timer++;
      updateStats();
    }
  }, 1000);
}

function updateStats() {
  const infoEl = document.getElementById('runInfo');
  if (infoEl) {
    const steps = AStar.path.length - 1;
    infoEl.textContent = `Steps: ${steps > 0 ? steps : 0} | Time: ${AStar.timer}s`;
  }
}

function reconstructPath(from) {
  AStar.path = [];
  let temp = from;
  AStar.path.push(temp);
  while (temp.previous) {
    AStar.path.push(temp.previous);
    temp = temp.previous;
  }

  const c = AStar.colors.path;
  const cg = AStar.colors.pathGlow;
  
  noFill();
  stroke(c[0], c[1], c[2]);
  strokeWeight(4);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  beginShape();
  for (let i = 0; i < AStar.path.length; i++) {
    const node = AStar.path[i];
    vertex(node.i * AStar.wid + AStar.wid / 2, node.j * AStar.wid + AStar.wid / 2);
  }
  endShape();
  
  stroke(cg[0], cg[1], cg[2], cg[3]);
  strokeWeight(10);
  beginShape();
  for (let i = 0; i < AStar.path.length; i++) {
    const node = AStar.path[i];
    vertex(node.i * AStar.wid + AStar.wid / 2, node.j * AStar.wid + AStar.wid / 2);
  }
  endShape();
  
  noStroke();
}

function handleMouseInteraction() {
  if (AStar.isReady) return;
  if (!mouseIsPressed) return;
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  const x = floor(mouseX / AStar.wid);
  const y = floor(mouseY / AStar.wid);

  if (x < 0 || x >= AStar.arrSize || y < 0 || y >= AStar.arrSize) return;

  const node = AStar.nodes[x][y];

  if (mouseButton === LEFT) {
    if (node === AStar.startNode) {
      AStar.isMovingStart = true;
    } else if (node === AStar.targetNode) {
      AStar.isMovingTarget = true;
    } else {
      node.isWall = true;
    }
  } else if (mouseButton === RIGHT) {
    node.isWall = false;
  }

  for (let i = 0; i < AStar.arrSize; i++) {
    for (let j = 0; j < AStar.arrSize; j++) {
      AStar.nodes[i][j].pushNeighbors(AStar.nodes);
    }
  }
}

function moveNodes() {
  if (AStar.isReady) return;
  if (!mouseIsPressed) return;
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  const x = floor(mouseX / AStar.wid);
  const y = floor(mouseY / AStar.wid);

  if (x < 0 || x >= AStar.arrSize || y < 0 || y >= AStar.arrSize) return;

  if (AStar.isMovingStart) {
    AStar.startNode.isOpened = false;
    AStar.startNode = AStar.nodes[x][y];
    AStar.startNode.isWall = false;
    AStar.openSet = [AStar.startNode];
    AStar.startNode.isOpened = true;
  } else if (AStar.isMovingTarget) {
    AStar.targetNode = AStar.nodes[x][y];
    AStar.targetNode.isWall = false;
  }
}

function runAStarStep() {
  if (AStar.openSet.length === 0) {
    console.log('NO SOLUTION');
    AStar.isNoLoop = true;
    noLoop();
    return;
  }

  let winnerIdx = 0;
  for (let i = 0; i < AStar.openSet.length; i++) {
    if (AStar.openSet[i].f < AStar.openSet[winnerIdx].f) {
      winnerIdx = i;
    }
  }

  AStar.current = AStar.openSet[winnerIdx];

  if (AStar.current === AStar.targetNode) {
    console.log('DONE!');
    AStar.isNoLoop = true;
    reconstructPath(AStar.current);
    const steps = AStar.path.length - 1;
    document.getElementById('runInfo').textContent = `Steps: ${steps} | Time: ${AStar.timer}s`;
    clearInterval(AStar.intervalId);
    noLoop();
    return;
  }

  removeFromArray(AStar.openSet, AStar.current);
  AStar.current.isOpened = false;
  AStar.current.isClosed = true;

  for (let i = 0; i < AStar.current.neighbors.length; i++) {
    const neighbor = AStar.current.neighbors[i];
    if (neighbor.isClosed || neighbor.isWall) continue;

    const tempG = AStar.current.g + Heuristic(neighbor, AStar.current);
    let newPath = false;

    if (neighbor.isOpened) {
      if (tempG < neighbor.g) {
        neighbor.g = tempG;
        newPath = true;
      }
    } else {
      neighbor.g = tempG;
      newPath = true;
      AStar.openSet.push(neighbor);
      neighbor.isOpened = true;
    }

    if (newPath) {
      neighbor.h = Heuristic(neighbor, AStar.targetNode);
      neighbor.f = neighbor.g + neighbor.h;
      neighbor.previous = AStar.current;
    }
  }

  reconstructPath(AStar.current);
}

function setup() {
  createCanvas(750, 750).parent('canvas-container');
  AStar.wid = height / AStar.arrSize;
  initNodes();
  AStar.timer = 0;
  updateStats();
  loop();
}

function draw() {
  background(...AStar.colors.bg);
  drawGrid();

  for (let i = 0; i < AStar.arrSize; i++) {
    for (let j = 0; j < AStar.arrSize; j++) {
      AStar.nodes[i][j].show();
    }
  }

  if (!AStar.isReady) {
    moveNodes();
    handleMouseInteraction();
    return;
  }

  runAStarStep();
}

function drawGrid() {
  const c = AStar.colors.grid;
  stroke(c[0], c[1], c[2]);
  strokeWeight(1);
  
  for (let i = 0; i <= AStar.arrSize; i++) {
    const x = i * AStar.wid;
    line(x, 0, x, height);
  }
  
  for (let j = 0; j <= AStar.arrSize; j++) {
    const y = j * AStar.wid;
    line(0, y, width, y);
  }
  
  noStroke();
}

function mousePressed() {
  if (AStar.isReady) return;
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  const x = floor(mouseX / AStar.wid);
  const y = floor(mouseY / AStar.wid);

  if (x < 0 || x >= AStar.arrSize || y < 0 || y >= AStar.arrSize) return;

  const node = AStar.nodes[x][y];

  if (mouseButton === LEFT) {
    if (node === AStar.startNode) {
      AStar.isMovingStart = true;
    } else if (node === AStar.targetNode) {
      AStar.isMovingTarget = true;
    }
  }
}

function mouseReleased() {
  AStar.isMovingStart = false;
  AStar.isMovingTarget = false;
}

function keyPressed() {
  if (keyCode === 82) {
    reset();
    return;
  }

  if (AStar.isReady) return;

  if (keyCode === 66) {
    startSearch();
  }

  if (keyCode === 71) {
    generateWalls();
  }
}

function setHeuristic(type) {
  AStar.currentHeur = type;
  document.getElementById('manh').checked = type === 1;
  document.getElementById('pyth').checked = type === 2;
  document.getElementById('squares').checked = type === 3;
}

document.oncontextmenu = () => false;
