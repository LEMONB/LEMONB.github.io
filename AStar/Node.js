class Node {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.isWall = false;
    this.isClosed = false;
    this.isOpened = false;
    this.previous = null;
    this.neighbors = [];
  }

  generateWall(wallsProbability) {
    if (this !== AStar.startNode && this !== AStar.targetNode) {
      this.isWall = random(1) < wallsProbability;
    }
  }

  show() {
    const x = this.i * AStar.wid;
    const y = this.j * AStar.wid;
    const w = AStar.wid;
    const wallColor = AStar.colors.wall;

    if (this.isWall) {
      fill(wallColor[0], wallColor[1], wallColor[2]);
      noStroke();
      rect(x + 1, y + 1, w - 2, w - 2, 3);
      return;
    }

    if (this === AStar.startNode) {
      fill(34, 197, 94);
      noStroke();
      ellipse(x + w / 2, y + w / 2, w * 0.6, w * 0.6);
      fill(255);
      textSize(w * 0.3);
      textAlign(CENTER, CENTER);
      text('S', x + w / 2, y + w / 2);
      return;
    }

    if (this === AStar.targetNode) {
      fill(239, 68, 68);
      noStroke();
      ellipse(x + w / 2, y + w / 2, w * 0.6, w * 0.6);
      fill(255);
      textSize(w * 0.3);
      textAlign(CENTER, CENTER);
      text('T', x + w / 2, y + w / 2);
      return;
    }

    if (this.isOpened) {
      fill(52, 211, 153, 120);
      noStroke();
      rect(x + 1, y + 1, w - 2, w - 2, 2);
    } else if (this.isClosed) {
      fill(244, 114, 182, 120);
      noStroke();
      rect(x + 1, y + 1, w - 2, w - 2, 2);
    }
  }

  pushNeighbors(_nodes) {
    this.neighbors = [];
    const i = this.i;
    const j = this.j;
    const arrSize = AStar.arrSize;

    if (i < arrSize - 1 && !_nodes[i + 1][j].isWall) {
      this.neighbors.push(_nodes[i + 1][j]);
    }
    if (i > 0 && !_nodes[i - 1][j].isWall) {
      this.neighbors.push(_nodes[i - 1][j]);
    }
    if (j < arrSize - 1 && !_nodes[i][j + 1].isWall) {
      this.neighbors.push(_nodes[i][j + 1]);
    }
    if (j > 0 && !_nodes[i][j - 1].isWall) {
      this.neighbors.push(_nodes[i][j - 1]);
    }

    if (i < arrSize - 1) {
      if (j < arrSize - 1 && !_nodes[i + 1][j].isWall && !_nodes[i][j + 1].isWall) {
        this.neighbors.push(_nodes[i + 1][j + 1]);
      }
      if (j > 0 && !_nodes[i + 1][j].isWall && !_nodes[i][j - 1].isWall) {
        this.neighbors.push(_nodes[i + 1][j - 1]);
      }
    }

    if (i > 0) {
      if (j < arrSize - 1 && !_nodes[i - 1][j].isWall && !_nodes[i][j + 1].isWall) {
        this.neighbors.push(_nodes[i - 1][j + 1]);
      }
      if (j > 0 && !_nodes[i - 1][j].isWall && !_nodes[i][j - 1].isWall) {
        this.neighbors.push(_nodes[i - 1][j - 1]);
      }
    }
  }
}
