

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

  this.show = function(r, g, b) {
    if ( this.isWall == true) {
      fill(0, 0, 0);
      rect( this.i * wid + wid/6, this.j * wid + wid/6, wid-1 - wid/6, wid-1 - wid/6);
      return;
    } else if (this == startNode)
      fill(0, 255, 255);
    else if (this == targetNode)
      fill(255, 0, 255);
    else if (r == 0 && g == 255 && b == 0)
      fill(r, g, b, 150);
    else if (r == 255 && g == 0 && b == 0)
      fill(r, g, b, 150);
    else
      return;
    //fill(r, g, b);

    ellipse(this.i * wid + wid/2, this.j * wid + wid/2, wid/2, wid/2);
    //rect( this.i * wid,  this.j * wid, wid-1, wid-1);
  }

  this.pushNeighbors = function(_nodes) {
    this.neighbors = [];

    //LRUD
    if ( this.i < arrSize - 1 && _nodes[ this.i + 1][ this.j].isWall == false) {
      this.neighbors.push(_nodes[ this.i + 1][ this.j]);
    }
    if ( this.i > 0 && _nodes[ this.i - 1][ this.j].isWall == false) {
      this.neighbors.push(_nodes[ this.i - 1][ this.j]);
    }
    if ( this.j < arrSize - 1 && _nodes[ this.i][ this.j + 1].isWall == false) {
      this.neighbors.push(_nodes[ this.i][ this.j + 1]);
    }
    if ( this.j > 0 && _nodes[ this.i][ this.j - 1].isWall == false) {
      this.neighbors.push(_nodes[ this.i][ this.j - 1]);
    }

    //DIAG
    if ( this.i < arrSize - 1) {
      if ( this.j < arrSize - 1
        && _nodes[this.i + 1][this.j].isWall == false
        && _nodes[this.i][this.j + 1].isWall == false)
      {
        this.neighbors.push(_nodes[ this.i + 1][ this.j + 1]);
      }

      if (this.j > 0
        && _nodes[this.i + 1][this.j].isWall == false
        && _nodes[this.i][this.j - 1].isWall == false)
      {
        this.neighbors.push(_nodes[ this.i + 1][ this.j - 1]);
      }
    }

    if ( this.i > 0) {
      if ( this.j < arrSize - 1
        && _nodes[this.i - 1][this.j].isWall == false
        && _nodes[this.i][this.j + 1].isWall == false)
      {
        this.neighbors.push(_nodes[ this.i - 1][ this.j + 1]);
      }

      if (this.j > 0
        && _nodes[this.i - 1][this.j].isWall == false
        && _nodes[this.i][this.j - 1].isWall == false)
      {
        this.neighbors.push(_nodes[ this.i - 1][ this.j - 1]);
      }
    }
  }
}