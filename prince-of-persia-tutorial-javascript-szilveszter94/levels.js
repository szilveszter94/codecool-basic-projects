
// solve level 1

function level1(){
  moveUp();
  moveUp();
  moveRight();
  moveRight();
  moveRight();
  moveDown();
  moveDown();
  moveDown();
  moveDown();
  moveDown();
  moveLeft();
  moveLeft();
  moveLeft();
  moveUp();
}

// solve level 2

function level2(){
  moveDirection("up");
  moveDirection("up");
  moveDirection("right");
  moveDirection("right");
  moveDirection("down");
  moveDirection("down");
  moveDirection("right");
  moveDirection("right");
  moveDirection("down");
  moveDirection("down");
  moveDirection("down");
  moveDirection("down");
  moveDirection("left");
  moveDirection("left");
  moveDirection("up");
  moveDirection("up");
  moveDirection("left");
  moveDirection("left");
  moveDirection("down");
}

// solve level 3

function level3(){
  for (let i=0; i<8; i++) {
    moveDirection("down");
  }
}

// solve level 4

function level4(turn=12){
  for (let i=0; i<turn; i++){
    if (i%2===0){
      moveDirection("down");
    } else {
      moveDirection("right");
    }
  }
}

// solve level 5

function level5(){
  for (let i = 0; i<5; i++){
    moveDirection("down");
  }
}

function giveComputerAnswer(num1,num2){
  return Math.floor(Math.pow(num1, 4) / (num1 + num2));
}

// DON'T MODIFY THE CODE BELOW THIS LINE

let toExport;

try {
  toExport = [
    { name: "level1", content: level1, type: "function" },
    { name: "level2", content: level2, type: "function" },
    { name: "level3", content: level3, type: "function" },
    { name: "level4", content: level4, type: "function" },
    { name: "level5", content: level5, type: "function" },
    { name: "giveComputerAnswer", content: giveComputerAnswer, type: "function" }
  ]

} catch (error) {
  toExport = { error: error.message }
}

export { toExport };