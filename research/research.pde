int arrSize = 5;
int wid;

ArrayList<Node> RemoveFromList(ArrayList<Node> list, Node obj){
  for(int i = list.size()-1; i > 0; i--){
     if(list.get(i) == obj){
        list.remove(i); 
     }
  }
  
  return list;
}

class Node {
  int i;
  int j;

  int f;
  int g;
  int h;
  //boolean isWall;
  ArrayList<Node> neighbors = new ArrayList<Node>();

  Node(int newI, int newJ) {
    i = newI;
    j = newJ;
    f = 0;
    g = 0;
    h = 0;

    //if(floor(random(5)) == 1)
    //  isWall = true;
    //else
    //  isWall = false;
  }

  void show(float r, float g, float b) {
    //if(isWall == true)
    //fill(0, 0, 0);
    //else
    fill(r, g, b);

    rect(i * wid, j * wid, wid, wid);
  }
  
  void addNeighbors(Node[][] _nodes){
    
     if(i < arrSize - 1){
      neighbors.add(_nodes[i + 1][j]); 
     }
     if(i > 0){
      neighbors.add(_nodes[i - 1][j]); 
     }
     if(j < arrSize - 1){
      neighbors.add(_nodes[i][j + 1]); 
     }
     if(j > 0){
      neighbors.add(_nodes[i][j - 1]); 
     }
  }
}

Node[][] nodes = new Node[arrSize][arrSize];
ArrayList<Node> openSet = new ArrayList<Node>();
ArrayList<Node> closedSet = new ArrayList<Node>();
Node startNode;
Node targetNode;

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

  openSet.add(startNode);
}

void draw() {

  if (openSet.size() > 0) {
    int winnerInd = 0;
    for (int i = 0; i < openSet.size(); i++) {
      if (openSet.get(i).f < openSet.get(winnerInd).f) {
        winnerInd = i;
      }
    }

    Node current = openSet.get(winnerInd);

    if (current == targetNode) {
      println("DONE!");
    }

    openSet = RemoveFromList(openSet, current);
    closedSet.add(current);
    
  } else {
    //no solution
  }

  for (int i = 0; i < arrSize; i++) {
    for (int j= 0; j< arrSize; j++) {
      nodes[i][j].show(255, 255, 255);
    }
  }

  for (int i = 0; i < openSet.size(); i++) {
    openSet.get(i).show(0, 255, 0);
  }

  for (int i = 0; i < closedSet.size(); i++) {
    closedSet.get(i).show(169, 169, 169);
  }
}