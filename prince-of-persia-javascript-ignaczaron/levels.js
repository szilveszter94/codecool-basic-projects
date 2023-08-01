
/*
____       _   _     _____ _           _           
|  _ \ __ _| |_| |__ |  ___(_)_ __   __| | ___ _ __ 
| |_) / _` | __| '_ \| |_  | | '_ \ / _` |/ _ \ '__|
|  __/ (_| | |_| | | |  _| | | | | | (_| |  __/ |   
|_|   \__,_|\__|_| |_|_|   |_|_| |_|\__,_|\___|_|   
                                                   
*/

///// ------------------------------------------------- LEVEL 6 EXTRA PATH FINDER FEATURE ------------------------------------------- ////

const level6MapWithPotions = [
  [12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 12, 12, 12, 12],
  [13, 13, 13, 12, 12, 12, 12, 12, 13, 11, 11, 11, 13, 11, 11, 11, 12, 12, 12, 12],
  [13, 10, 13, 13, 12, 13, 13, 13, 11, 11, 13, 11, 11, 11, 13, 11, 11, 11, 23, 12],
  [13, 11, 11, 13, 12, 13, 13, 11, 11, 13, 13, 13, 13, 13, 13, 12, 11, 12, 12, 12],
  [12, 13, 11, 11, 13, 13, 11, 11, 13, 13, 12, 12, 12, 12, 12, 12, 22, 12, 12, 12],
  [12, 12, 13, 11, 11, 11, 11, 13, 13, 13, 12, 25, 11, 12, 12, 11, 11, 11, 12, 12],
  [12, 12, 12, 13, 11, 11, 13, 13, 13, 12, 12, 11, 11, 11, 11, 11, 11, 26, 12, 12],
  [12, 12, 12, 13, 13, 13, 13, 13, 12, 12, 12, 11, 11, 12, 12, 12, 12, 11, 12, 12],
  [12, 28, 11, 12, 12, 12, 12, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12, 11, 12, 12],
  [12, 12, 11, 12, 12, 12, 31, 11, 12, 12, 12, 11, 12, 12, 12, 12, 12, 11, 12, 12],
  [12, 12, 11, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 30, 12, 12, 12, 11, 12, 12],
  [12, 27, 11, 12, 12, 12, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 12, 12],
  [12, 12, 11, 12, 12, 12, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 12, 12],
  [12, 12, 11, 12, 12, 12, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 11, 12, 12],
  [12, 24, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 12, 12, 12],
  [12, 12, 12, 12, 12, 12, 11, 32, 12, 12, 12, 12, 12, 12, 12, 11, 11, 12, 12, 12],
  [12, 12, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12, 12, 12, 12, 99, 12, 12, 12, 12],
  [12, 29, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 11, 11, 11, 12, 12, 12, 12],
  [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
];


// create the potions, the 99 is the final position
// if the position is greater than 14, that is a potion
function createPotionsArray() {
  let finalPosition = []
  const coordinates = []
  for (let row = 0; row < level6MapWithPotions.length; row++) {
    for (let col = 0; col < level6MapWithPotions[0].length; col++) {
      if (level6MapWithPotions[row][col] === 99) {
        finalPosition = [row, col]
      } else if (level6MapWithPotions[row][col] > 14) {
        coordinates.push([row, col])
      }
    }
  }
  return [coordinates, finalPosition];
}

// create level 6, but for path find the 0 is possible, the 2 is the wall
// excluded all potions

function createLevel6MapForPathFind() {
  const wall = 12
  const fire = 13
  const pathArr = []
  for (let row = 0; row < level6MapWithPotions.length; row++) {
    const accumulatorArr = []
    for (let col = 0; col < level6MapWithPotions[0].length; col++) {
      if (level6MapWithPotions[row][col] === wall || level6MapWithPotions[row][col] === fire) {
        accumulatorArr.push(2)
      } else {
        accumulatorArr.push(0)
      }
    }
    pathArr.push(accumulatorArr)
  }
  return pathArr
}

// GLOBAL VARIABLES FOR LEVEL 6 

/// set variables for position
let playerPositionY = 2
let playerPositionX = 15
//set directions for searching directions
const directionsArray = [[-1, 0], [0, 1], [1, 0], [0, -1]]
const level6Map = createLevel6MapForPathFind()
const allPotions = createPotionsArray()
const potionsCoord = allPotions[0]
let finalPosition = allPotions[1]


// the backtracing algorythm
function searchFinalArray(arr, row, col, target) {
  // create new seen array
  const seen = new Array(arr.length).fill(0).map(() => new Array(arr[0].length).fill(0))
  // create new path array for the final path
  const path = [];
  // create the initial position, the source position
  const queue = [[target[0], target[1]]]
  // run when have possible positions
  while (queue.length) {
    // extract the current position
    const currentPos = queue.shift()
    const currRow = currentPos[0]
    const currCol = currentPos[1]
    // return the path if the destination found
    if (currRow === row && currCol === col) {
      return path
    }
    // extract the possible steps from all directions (this case up, down, left, right)
    let possibleStep;
    let minStep = Infinity
    let movement = 0
    for (let i = 0; i < directionsArray.length; i++) {
      const [dRow, dCol] = directionsArray[i]
      const newRow = currRow + dRow
      const newCol = currCol + dCol
      // check if the position is correct
      if (newCol >= 0 && newCol < arr[0].length && arr[newRow][newCol] !== "s" &&
      newRow >= 0 && newRow < arr.length && seen[newRow][newCol] !== 1) {
        // fill the seen array for prevent double check the same position
        seen[newRow][newCol] = 1
        // filter the positions, and select the position with the minimum cost
        if (arr[newRow][newCol] < minStep) {
          possibleStep = [newRow, newCol]
          minStep = arr[newRow][newCol]
          movement = i
        }
      }
    }
    // add the step to the array, if not undefined
    if (possibleStep !== undefined) {
      queue.push(possibleStep)
    }
    // add the direction to the path
    path.push(movement)
  }
  return path
}

// the traversal function for the first step of the path find
function traversalWithBfs(arr, row, col, target) {
  // create seen array, and a cost array
  const seen = new Array(arr.length).fill(0).map(() => new Array(arr[0].length).fill(0))
  const costArray = new Array(arr.length).fill(0).map(() => new Array(arr[0].length).fill("s"))
  // the step == cost of the position from the initial position
  let step = 0
  // initial position
  const queue = [[row, col]]
  while (queue.length) {
    // extract the initial position
    const currentPos = queue.shift()
    const currRow = currentPos[0]
    const currCol = currentPos[1]
    // if the target is reached, stop the loop
    if (currRow === target[0] && currCol === target[1]) {
      break;
    }
    // check every direction
    for (let i = 0; i < directionsArray.length; i++) {
      const [dRow, dCol] = directionsArray[i];
      const newRow = currRow + dRow;
      const newCol = currCol + dCol;
      // filter the possible directions
      if (newRow >= 0 && newRow < arr.length && newCol >= 0 && newCol < arr[0].length && arr[newRow][newCol] === 0 && seen[newRow][newCol] !== 1) {
        // mark the position to not track twice
        seen[newRow][newCol] = 1
        // add the position to the queue
        queue.push([newRow, newCol])
        // fill the cost array
        costArray[newRow][newCol] = step
      }
    }
    // increase the cost
    step++
  }
  // the initial position of the cost array is 0
  costArray[row][col] = 0
  // call the searchFinalArray function, insert the cost array
  const finalPath = searchFinalArray(costArray, row, col, target)
  return finalPath
}



// find the nearest potion by calling the traversal function
function findNearestPotion() {
  let movementsArray = []
  let rowPos = 0
  let colPos = 0
  for (let i = 0; i < 11; i++) {
    // create an empty array for the shortest path
    let shortestPath = []
    // create index for the index of the path in the potionscoord array
    let pathindex = 0
    for (let y = 0; y < potionsCoord.length; y++) {
      // the result of the shortest path for the actual potion
      let result = traversalWithBfs(level6Map, playerPositionY, playerPositionX, potionsCoord[y])
      // the initial shortest path is the first potion path
      if (y === 0) {
        shortestPath = result
      }
      // set the shortest path, by checking the actual path and the shortest path
      else {
        if (result.length < shortestPath.length) {
          shortestPath = result
          pathindex = y
        }
      }
    }
    // set the coordinates if there are more potions
    if (potionsCoord.length) {
      rowPos = potionsCoord[pathindex][0]
      colPos = potionsCoord[pathindex][1]
    }
    // set the player position to the actual potion position
    playerPositionY = rowPos
    playerPositionX = colPos
    // delete the actual potion from the potions array
    potionsCoord.splice(pathindex, 1)
    // populate the movements array with the reverse the path, because of the backtracing
    movementsArray = movementsArray.concat(shortestPath.reverse())
  }
  // find the finish path from the player position
  let finishPath = traversalWithBfs(level6Map, playerPositionY, playerPositionX, finalPosition)
  // populate the movements array with the final path reverse array
  movementsArray = movementsArray.concat(finishPath.reverse())
  return movementsArray;
}

// function for automatic complete level 6
// this movements are reversed, compared with the directions
// because of the backtracing
function moveManager(movementsArray) {
  for (let i = 0; i < movementsArray.length; i++) {
    if (movementsArray[i] === 0) {
      moveDirection("down")
    } else if (movementsArray[i] === 1) {
      moveDirection("left")
    } else if (movementsArray[i] === 2) {
      moveDirection("up")
    } else if (movementsArray[i] === 3) {
      moveDirection("right")
    }
  }
}

// ------------------------------------------------------------------------------------------------------------------------------  //

/*
_        _______           _______  _           ______ 
( \      (  ____ \|\     /|(  ____ \( \         / ____ \
| (      | (    \/| )   ( || (    \/| (        ( (    \/
| |      | (__    | |   | || (__    | |        | (____  
| |      |  __)   ( (   ) )|  __)   | |        |  ___ \ 
| |      | (       \ \_/ / | (      | |        | (   ) )
| (____/\| (____/\  \   /  | (____/\| (____/\  ( (___) )
(_______/(_______/   \_/   (_______/(_______/   \_____/ 
                                                        
*/

/// ----------------------------------------------------- LEVEL 6 FUNCTIONS ---------------------------------------------- ///

// set variables for tracking keypresses
let toggleKey = false



// function for complete the stairs section
function getStairsMovementDirection(stairNumber, isClimbingStairs) {
  if (stairNumber % 2 === 0 && !isClimbingStairs) {
    return "down"
  } else if (stairNumber % 2 === 0 && isClimbingStairs) {
    return "up"
  }
  else {
    return "right"
  }
}

// function for complete the zig-zag section
function getZigZagMovementDirection(step) {
  if (step % 6 === 0) {
    return "up"
  } else if (step % 3 === 0) {
    return "down"
  } else {
    return "right"
  }
}

function collectPotion(row, col) {
  for (let i = 0; i < potionsCoord.length; i++) {
    if (potionsCoord[i][0] === row && potionsCoord[i][1] === col) {
      potionsCoord.splice(i, 1)
    }
  }
}


// manual control function
function manuallyControl(key) {
  // on the beginning, if not pressed any key, by pressing t, complete automatically
  if (key === "KeyT") {
    // create the shortest path automatically and call the move manager
    const movementsArray = findNearestPotion()
    moveManager(movementsArray)
  }
  // toggle key when q is pressed
  if (key === "KeyQ") {
    toggleKey = !toggleKey
  }
  // wasd and arrow config
  if ((key === "KeyA" && !toggleKey) || (key === "ArrowLeft" && toggleKey)) {
    const leftValue = level6Map[playerPositionY][playerPositionX - 1]
    if (leftValue !== 2) {
      moveDirection("left")
      playerPositionX--
      collectPotion(playerPositionY, playerPositionX)
    }
  }
  if ((key === "KeyS" && !toggleKey) || (key === "ArrowDown" && toggleKey)) {
    const downValue = level6Map[playerPositionY + 1][playerPositionX]
    if (downValue !== 2) {
      moveDirection("down")
      playerPositionY++
      collectPotion(playerPositionY, playerPositionX)
    }
  }
  if ((key === "KeyD" && !toggleKey) || (key === "ArrowRight" && toggleKey)) {
    const rightValue = level6Map[playerPositionY][playerPositionX + 1]
    if (rightValue !== 2) {
      moveDirection("right")
      playerPositionX++
      collectPotion(playerPositionY, playerPositionX)
    }
  }
  if ((key === "KeyW" && !toggleKey) || (key === "ArrowUp" && toggleKey)) {
    const upValue = level6Map[playerPositionY - 1][playerPositionX]
    if (upValue !== 2) {
      moveDirection("up")
      playerPositionY--
      collectPotion(playerPositionY, playerPositionX)
    }
  }
}

// potion 2 function
function givePotion2Answer(arr) {
  return arr.reduce((acc, item) => item % 2 === 0 ? acc + item : acc + 0, 0)
}

// potion 3 function
function givePotion3Answer(arr) {
  let maxNum = arr[0]
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > maxNum) {
      maxNum = arr[i]
    }
  }
  return maxNum;
}

// potion 4 answer
function givePotion4Answer(letter, lettersToCapitalize) {
  letter = letter.split("")
  for (let i = 0; i < letter.length; i++) {
    if (lettersToCapitalize.includes(letter[i])) {
      letter[i] = letter[i].toUpperCase();
    }
  }
  return letter.join("")
}

// potion 5 answer
function givePotion5Answer(hour, minute, second, additionalSecond) {
  const totalSeconds = (hour * 3600 + minute * 60 + second + additionalSecond)
  hour = Math.floor(totalSeconds / 3600);
  minute = Math.floor((totalSeconds / 60) % 60);
  second = totalSeconds % 60;
  return `${hour}:${minute}:${second}`
}


// potion 6 answer
function givePotion6Answer(arr) {
  arr.split("*");
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    const stringToNum = Number(arr[i])
    if (stringToNum) {
      sum += stringToNum
    }
  }
  return sum;
}

// potion 7 answer
function givePotion7Answer(string) {
  string = string.split("")
  return string.reduce((acc, num) => Number(num) ? acc + Number(num) : acc + 0, 0)
}

// potion 8 answer
function givePotion8Answer(number) {
  let isPrime = true;
  if (number > 1) {
    for (let i = 2; i < number; i++) {
      if (number % i == 0) {
        isPrime = false;
        break;
      }
    }
  }
  return isPrime;
}

// potion 9 answer
function givePotion9Answer(arr) {
  arr.sort((a, b) => a - b)
  return arr[0] + arr[1]
}

// potion 10 answer
function givePotion10Answer(letter, string) {
  for (let i = 0; i < string.length; i++) {
    if (string[i] === letter) {
      return i
    }
  }
  return -1
}

// potion 11 answer
function givePotion11Answer(string, letter, replacement) {
  const splitted = string.split("")
  for (let i = 0; i < splitted.length; i++) {
    if (splitted[i] === letter) {
      splitted[i] = replacement
    }
  }
  return splitted.join("")
}

// potion 12 answer
function givePotion12Answer(arr) {
  return arr.reduce((acc, num) => acc + Math.abs(num), 0)
}

// ------------------------------------------------------------------------------------------------------------------------------- //

/*
 _        _______           _______  _          ______  
( \      (  ____ \|\     /|(  ____ \( \        / ___  \ 
| (      | (    \/| )   ( || (    \/| (        \/   )  )
| |      | (__    | |   | || (__    | |            /  / 
| |      |  __)   ( (   ) )|  __)   | |           /  /  
| |      | (       \ \_/ / | (      | |          /  /   
| (____/\| (____/\  \   /  | (____/\| (____/\   /  /    
(_______/(_______/   \_/   (_______/(_______/   \_/     
                                                        
*/

/// --------------------------------------------------------- LEVEL 7 FUNCTIONS ---------------------------------------------- ///

// move function with turn parameter
function hasMovedToTile(turn) {
  moveDirection(turn)
}

// set variables for tracking available movements
let moveUp = true;
let moveDown = true;
let moveRight = true;
let moveLeft = true;

// level 7 function
function level7Move(left, right, up, down) {
  // move down and set available movements after the movement
  if ((down === 11 || down === 99) && moveDown) {
    hasMovedToTile("down")
    moveUp = false
    moveRight = true
    moveLeft = true
  }
  // move right and set available movements after the movement
  else if ((right === 11 || right === 99) && moveRight) {
    hasMovedToTile("right")
    moveLeft = false
    moveUp = true
    moveDown = true
  }
  // move up and set available movements after the movement
  else if ((up === 11 || up === 99) && moveUp) {
    hasMovedToTile("up")
    moveDown = false
    moveRight = true
    moveLeft = true
  }
  // move left and set available movements after the movement
  else if ((left === 11 || left === 99) && moveLeft) {
    hasMovedToTile("left")
    moveRight = false
    moveDown = true
    moveUp = true
  }
}

// --------------------------------------------------------------------------------------------------------------------------------- //

/*
 _        _______           _______  _           _____  
( \      (  ____ \|\     /|(  ____ \( \         / ___ \ 
| (      | (    \/| )   ( || (    \/| (        ( (___) )
| |      | (__    | |   | || (__    | |         \     / 
| |      |  __)   ( (   ) )|  __)   | |         / ___ \ 
| |      | (       \ \_/ / | (      | |        ( (   ) )
| (____/\| (____/\  \   /  | (____/\| (____/\  ( (___) )
(_______/(_______/   \_/   (_______/(_______/   \_____/ 
                                                        
*/


/// ------------------------------------------------------------------- LEVEL 8 FUNCTIONS ------------------------------------------ ///


// function for checking if the player reached the princess
function checkGameOver(up, down, right, left) {
  if (up === 99) {
    return "up"
  } else if (down === 99) {
    return "down"
  } else if (right === 99) {
    return "right"
  } else if (left === 99) {
    return "left"
  }
}

// level 8 function
function level8Move(gameMap) {
  // store gameMap in the array
  const arr = gameMap
  // create empty array for movements
  const movements = []
  // set variables for x and y position
  let xPos = 0
  let yPos = 0
  // set variable for tracking the game over
  let game = true
  // search the initial position of the player
  for (let y = 0; y < arr.length; y++) {
    for (let i = 0; i < arr[y].length; i++) {
      if (arr[y][i] === 10) {
        xPos = i
        yPos = y
        break
      }
    }
  }
  while (game) {
    // store the squares around the player
    const up = arr[yPos - 1][xPos]
    const down = arr[yPos + 1][xPos]
    const right = arr[yPos][xPos + 1]
    const left = arr[yPos][xPos - 1]
    // check if the princess is near the player
    if (up === 99 || down === 99 || right === 99 || left === 99) {
      const dir = checkGameOver(up, down, right, left)
      movements.push(dir)
      return movements
    }
    // check if the top square is available and change the current position then move
    if (up === 11) {
      movements.push("up")
      arr[yPos][xPos] = 13
      yPos--
    }
    // check if the bottom square is available and change the current position then move 
    else if (down === 11) {
      movements.push("down")
      arr[yPos][xPos] = 13
      yPos++
    }
    // check if the right square is available and change the current position then move 
    else if (right === 11) {
      movements.push("right")
      arr[yPos][xPos] = 13
      xPos++
    }
    // check if the left square is available and change the current position then move  
    else if (left === 11) {
      movements.push("left")
      arr[yPos][xPos] = 13
      xPos--
    }
  }
}

let toExport;

try {
  toExport = [
    { name: "getStairsMovementDirection", content: getStairsMovementDirection, type: "function" },
    { name: "getZigZagMovementDirection", content: getZigZagMovementDirection, type: "function" },
    { name: "manuallyControl", content: manuallyControl, type: "function" },
    { name: "givePotion2Answer", content: givePotion2Answer, type: "function" },
    { name: "givePotion3Answer", content: givePotion3Answer, type: "function" },
    { name: "givePotion4Answer", content: givePotion4Answer, type: "function" },
    { name: "givePotion5Answer", content: givePotion5Answer, type: "function" },
    { name: "givePotion6Answer", content: givePotion6Answer, type: "function" },
    { name: "givePotion7Answer", content: givePotion7Answer, type: "function" },
    { name: "givePotion8Answer", content: givePotion8Answer, type: "function" },
    { name: "givePotion9Answer", content: givePotion9Answer, type: "function" },
    { name: "givePotion10Answer", content: givePotion10Answer, type: "function" },
    { name: "givePotion11Answer", content: givePotion11Answer, type: "function" },
    { name: "givePotion12Answer", content: givePotion12Answer, type: "function" },
    { name: "level7Move", content: level7Move, type: "function" },
    { name: "level8Move", content: level8Move, type: "function" },
  ]

} catch (error) {
  toExport = { error: error.message }
}

export { toExport };