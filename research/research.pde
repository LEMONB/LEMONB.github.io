
ArrayList<Node> RemoveFromList(ArrayList<Node> list, Node obj) {
  //println("removing " + obj);
  for (int i = list.size()-1; i >= 0; i--) {
    //println("IN LOOP " + i);
    if (list.get(i) == obj) {
      list.remove(i);
      //println("removed " + i);
    }
  }
  return list;
}

boolean Includes(Node obj, ArrayList<Node> list) {
  for (int i = 0; i < list.size(); i++) {
    if (obj == list.get(i)) {
      return true;
    }
  }
  return false;
}

float Heuristic(Node from, Node target) {
  float dist = 0;
  dist = dist(from.i, from.j, target.i, target.j);
  //dist = abs(target.i - from.i) + abs(target.j - from.j);
  return dist;
}



int arrSize = 40;
int wid;

class Node {
  int i;
  int j;

  float f;
  float g;
  float h;
  boolean isWall;
  Node previous;
  ArrayList<Node> neighbors = new ArrayList<Node>();

  Node(int newI, int newJ) {
    i = newI;
    j = newJ;
    f = 0;
    g = 0;
    h = 0;
    previous = null;
    if (random(1) < 0.00)
      isWall = true;
    else
      isWall = false;
  }

  void show(float r, float g, float b) {
    if (isWall == true)
      fill(0, 0, 0);
    else
      fill(r, g, b);

    rect(i * wid, j * wid, wid-1, wid-1);
  }

  void addNeighbors(Node[][] _nodes) {

    if (i < arrSize - 1) {
      neighbors.add(_nodes[i + 1][j]);
    }
    if (i > 0) {
      neighbors.add(_nodes[i - 1][j]);
    }
    if (j < arrSize - 1) {
      neighbors.add(_nodes[i][j + 1]);
    }
    if (j > 0) {
      neighbors.add(_nodes[i][j - 1]);
    }
  }
}

Node[][] nodes = new Node[arrSize][arrSize];
ArrayList<Node> openSet = new ArrayList<Node>();
ArrayList<Node> closedSet = new ArrayList<Node>();
ArrayList<Node> path = new ArrayList<Node>();
Node startNode;
Node targetNode;
Node current;

boolean isReady = false;
boolean isBuilding = false;

void setup() {
  size(800, 800);
  background(51);
  wid = height / arrSize;

  for (int i = 0; i < arrSize; i++) {
    for (int j= 0; j < arrSize; j++) {
      nodes[i][j] = new Node(i, j);
    }
  }
  for (int i = 0; i < arrSize; i++) {
    for (int j= 0; j < arrSize; j++) {
      nodes[i][j].addNeighbors(nodes);
    }
  }

  startNode = nodes[0][0];
  targetNode = nodes[arrSize - 1][arrSize - 1];
  startNode.isWall = false;
  targetNode.isWall = false;
  openSet.add(startNode);


  for (int i = 0; i < arrSize; i++) {
    for (int j= 0; j< arrSize; j++) {
      nodes[i][j].show(255, 255, 255);
    }
  }
}

//void draw() {
//}

void mouseReleased() {
  isBuilding = false;
}

void draw() {
  
  //if (isReady == false) {

  //  if (mousePressed) {
  //    isBuilding = true;
  //  }

  //  if (isBuilding == true) {
  //    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
  //      if (mouseButton == LEFT) {
  //        nodes[mouseX / wid][mouseY / wid].isWall = true;
  //      } else if (mouseButton == RIGHT) {
  //        nodes[mouseX / wid][mouseY / wid].isWall = false;
  //      }
  //    }
  //  }

  //  for (int i = 0; i < arrSize; i++) {
  //    for (int j= 0; j< arrSize; j++) {
  //      nodes[i][j].show(255, 255, 255);
  //    }
  //  }

  //  if (keyPressed) {
  //    if (key == 'b')
  //      isReady = true;
  //  }
  //}

  //if (isReady == false)
  //  return;

  if (openSet.size() > 0) {
    int winnerInd = 0;
    for (int i = 0; i < openSet.size(); i++) {
      if (openSet.get(i).f < openSet.get(winnerInd).f) {
        winnerInd = i;
      }
    }

    current = openSet.get(winnerInd);

    if (current == targetNode) {
      for (int i = 0; i < path.size(); i++) {
        path.get(i).show(0, 0, 255);
      }

      //reconstructPath(path);
      println("DONE!");
      noLoop();
    }

    openSet = RemoveFromList(openSet, current);
    closedSet.add(current);

    for (int i = 0; i < current.neighbors.size(); i++) {

      if (Includes(current.neighbors.get(i), closedSet) == false && current.neighbors.get(i).isWall == false) {

        float tempG = current.g + Heuristic(current, targetNode);

        if (Includes(current.neighbors.get(i), openSet) == false) {
          openSet.add(current.neighbors.get(i));
        } else if (tempG >= current.neighbors.get(i).g) {
          continue;
        }

        current.neighbors.get(i).g = tempG;
        current.neighbors.get(i).h = Heuristic(current.neighbors.get(i), targetNode);
        current.neighbors.get(i).f = current.neighbors.get(i).g + current.neighbors.get(i).h;
        current.neighbors.get(i).previous = current;
      }
    }
  } else {
    println("NO SOLUTION");
    noLoop();
    //no solution
  }


  //for (int i = 0; i < arrSize; i++) {
  //  for (int j= 0; j< arrSize; j++) {
  //    nodes[i][j].show(255, 255, 255);
  //  }
  //}

  for (int i = 0; i < closedSet.size(); i++) {
    closedSet.get(i).show(255, 0, 0);
  }

  for (int i = 0; i < openSet.size(); i++) {
    openSet.get(i).show(0, 255, 0);
    //println(i);
  }

  Node temp = current;
  path.clear();
  path.add(temp);
  while (temp.previous != null) {
    path.add(temp.previous);
    temp = temp.previous;
  }

  for (int i = 0; i < path.size(); i++) {
    path.get(i).show(0, 0, 255);
  }
}