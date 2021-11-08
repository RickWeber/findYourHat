const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const directionMap = {
    'N': [-1,  0],
    'S': [ 1,  0],
    'E': [ 0,  1],
    'W': [ 0, -1],
    'NE': [-1, 1], // secret moves!
    'NW': [-1,-1],
    'SE': [ 1, 1],
    'SW': [ 1,-1]
};

class Field {
  constructor(fieldArr, hatLoc, usrLoc){
    this.field = fieldArr;
    this.hatLoc = hatLoc;
    this.usrLoc = usrLoc;
  }

  print(){
    for(let row of this.field){
      console.log(row.join(''));
    }
  }

  checkWin(){
    return this.usrLoc[0] === this.hatLoc[0] && this.usrLoc[1] === this.hatLoc[1];
  }

  checkHole(){
    return this.field[this.usrLoc[0]][this.usrLoc[1]] === hole;
  }

  checkPath(){
    return this.field[this.usrLoc[0]][this.usrLoc[1]] === pathCharacter;
  }

  checkEdge(direction){
    let cols = this.field[0].length;
    let rows = this.field.length;
    let rowInd = this.usrLoc[0] + directionMap[direction][0];
    let colInd = this.usrLoc[1] + directionMap[direction][1];
    return (rowInd >= 0   && colInd >= 0 &&
            rowInd < rows && colInd < cols);
  }

  makeMove(direction){
    if(this.checkEdge(direction)){ 
      this.usrLoc[0] += directionMap[direction][0];
      this.usrLoc[1] += directionMap[direction][1];
      if(this.checkWin()){
        console.log("You found your hat!");
        process.exit();
      } else if (this.checkHole()){
        console.log("You fell in a hole!");
        process.exit();
      } else if (this.checkPath()){
        this.field[this.usrLoc[0]][this.usrLoc[1]] = fieldCharacter;
      } else {
        this.field[this.usrLoc[0]][this.usrLoc[1]] = pathCharacter;
      }
      F.print();
    } else {
      console.log("You fell off the face of the earth!")
      process.exit();
    }
  }


  static randomLoc(fieldArr){
    let rows = fieldArr.length;
    let cols = fieldArr[0].length;
    return [Math.floor(Math.random() * rows), 
            Math.floor(Math.random() * cols)];
  }

  static newField(rows, cols){
    function makeRows() {
      return " "
        .repeat(rows)
        .split('')
        .map(x => { 
          return Math.random() < 0.15 ? hole : fieldCharacter
        })
    }
    let field = [];
    for(let r = 0; r < rows; r ++ ){
      field.push(makeRows()); 
    }
//    return field
    let hatLoc = Field.randomLoc(field);
    let usrLoc = hatLoc;
    while(usrLoc === hatLoc){ 
      usrLoc = Field.randomLoc(field);
    }
    field[hatLoc[0]][hatLoc[1]] = hat;
    field[usrLoc[0]][usrLoc[1]] = pathCharacter;
    return [field, hatLoc, usrLoc];
  }
}

let field = Field.newField(5,5)
let F = new Field(field[0], field[1], field[2]);
do{
  console.clear(); // clear the console for proper display
  console.log(F.usrLoc);
  console.log(F.hatLoc);
  console.log("which way youd you like to go? (n, s, e, w, or quit)");
  F.print()
  console.log(direction = prompt());
  direction = direction.toUpperCase();
  if(direction === 'QUIT' || direction === 'Q'){ process.exit();}
  F.makeMove(direction);
} while(!F.checkWin())
