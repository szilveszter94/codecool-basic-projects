/*
    ********************************
    *PLEASE DO NOT MODIFY THIS FILE*
    ********************************
*/

import { toExport as preData } from '/levels.js';
import { postError, pImp } from '/public/jet.js';



const tickTime = 60;
const commandQueue = []
const gameStats = {
  playerLocationX: 0,
  playerLocationY: 0,
  playerHealth: 1,
  isGameRunning: true
}
let map = [];
const mapCallbacks = {
  "player": { code: 10, callback: () => true, icon: "prince" },
  "free-space": { code: 11, callback: () => true, icon: "" },
  "wall": { code: 12, callback: () => { 
    const msg = "Can not go through wall!";
    postError(msg)
    showMessage(msg);

    return false; 
  }, icon: "wall" },
  "princess": { code: 99, callback: (game) => {
    document.querySelector("body").classList.add("win");

    const msg = "YOU WON !!! Refresh the Page to play it Again!";
    postError(msg)
    showMessage(msg);
    
    game.isGameRunning = 0; return 0; }, icon: "princess"
  
  },
};
const directionCoordinates = {
  "down": { x: +1, y: 0 },
  "up": { x: -1, y: 0 },
  "left": { x: 0, y: -1 },
  "right": { x: 0, y: +1 }
}

function potionCallback(configuration) {
  let allowMove = false;
  let input = configuration.randomInputCallback();
  let question = configuration.question;
  input.forEach((item, iterator) => {
    question = question.replaceAll(`{{${iterator + 1}}}`, `|${item}|`);
  })
  console.log(question);
  showMessage(question);
  postError(question);
  try {
    const answerFromStudentImplementation = configuration.studentImplementationCallback(...input);
    const correctAnswer = configuration.answerCallback(...input);
    if (answerFromStudentImplementation === correctAnswer) {
      const msg = `|${answerFromStudentImplementation}| is correct, here is your vitality potion !`
      console.log(msg);
      postError(msg);
      allowMove = true;
      gameStats.playerHealth += configuration.rewardPoints;
      showMessage(`Player health: ${gameStats.playerHealth}`);
    } else {
      const msg = `Function |${configuration.studentImplementationCallback.name}| returned |${answerFromStudentImplementation}|, but |${correctAnswer}| was expected :(`
      console.log(msg);
      postError(msg);
    }
  } catch (e) {
    const msg = `You have an error in the implementation of the function |${configuration.studentImplementationCallback.name}|`;
    console.log(msg);
    postError(msg);
    console.log(e.message);
  }
  return allowMove;
}

function initMap(map) {
  const htmlMap = document.getElementById("container");
  htmlMap.style.gridTemplateColumns = `${"1fr ".repeat(map[0].length)}`;
  htmlMap.style.gridTemplateRows = `${"1fr ".repeat(map.length)}`;
  htmlMap.style.width = `${(map[0].length * 70)}px`;
  htmlMap.style.height = `${(map.length * 70)}px`;
  htmlMap.innerHTML = "<div></div>".repeat(map.length * map[0].length);
}

function getMapIconFor(label) {
  const found = Object.values(mapCallbacks).find(c => c.code === label);
  return found ? found.icon : "empty";
}

function render(map) {
  const cells = document.querySelectorAll("#container > div");
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      //cells[i * map[0].length + j].innerHTML = getMapIconFor(map[i][j]);
      cells[i * map[0].length + j].className = getMapIconFor(map[i][j]);
    }
  }
}

function movePlayer(direction, message) {
  if (!gameStats.isGameRunning) {
    return;
  }
  message && console.log(message);

  try {
    const proposedLocationX = directionCoordinates[direction].x + gameStats.playerLocationX;
    const proposedLocationY = directionCoordinates[direction].y + gameStats.playerLocationY;
    if (!map[proposedLocationX] || !map[proposedLocationX][proposedLocationY]) {
      const msg = "Can't go outside edges";
      console.log(msg);
      showMessage(msg);
      postError(msg);
      return;
    }

    const proposedDestinationAction = Object.values(mapCallbacks).find(c => c.code === map[proposedLocationX][proposedLocationY]);
    if (!proposedDestinationAction) {
      const msg = `You haven't loaded the right level, can not find action for map code: ${map[proposedLocationX][proposedLocationY]}`;
      console.log(msg);
      showMessage(msg);
      postError(msg);
      gameStats.isGameRunning = false;
      return;
    }
    const allowMove = proposedDestinationAction.callback(gameStats);

    if (gameStats.playerHealth < 1) {
      const msg = "You died, refresh the Page to play it again.";
      postError(msg);
      showMessage(msg);
      console.log(msg);
      gameStats.isGameRunning = false;
      return;
    }

    if (allowMove) {
      map[gameStats.playerLocationX][gameStats.playerLocationY] = mapCallbacks["free-space"].code;
      gameStats.playerLocationX = proposedLocationX;
      gameStats.playerLocationY = proposedLocationY;
      map[gameStats.playerLocationX][gameStats.playerLocationY] = mapCallbacks["player"].code;
      render(map);
    }
  }
  catch (e) {

  }
}

function executeDelayedCommandQueue() {
  setInterval(() => {
    if (commandQueue.length > 0) {
      commandQueue[0]();
      commandQueue.shift()
    }
  }, tickTime)
}

function showMessage(message) {
  document.getElementById("messageBox").innerHTML = message;
}

function startGame() {
  initMap(map);
  render(map);
  executeDelayedCommandQueue();
}

function moveDirection(direction, message) {
  commandQueue.push(() => movePlayer(direction, message))
}

function setPlayerCoordinates(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === mapCallbacks["player"].code) {
        gameStats.playerLocationX = i;
        gameStats.playerLocationY = j;
      }
    }
  }
}

function loadLevel(number) {
  const loaderFunction = window[`loadLevel${number}`];
  //console.log(loaderFunction);
  if (!loaderFunction) {
    const msg = `That level does not exist: ${number}`
    console.log(msg);
    showMessage(msg);
    postError(`\n\n${msg}\n\n`);
  }
  loaderFunction(map, {
    moveDirection,
    showMessage,
    potionCallback,
  });
  setPlayerCoordinates(map);
  startGame();
}



window.loadLevel = loadLevel;
window.mapCallbacks = mapCallbacks;

mapCallbacks["door1"] = {
  code: 20,
  icon: "computer",
  callback: () => potionCallback({
    question: 'What is {{1}} to the power of 4 divided by the sum of {{2}} with {{1}} and finally rounded down ?',
    rewardPoints: 10,
    randomInputCallback: () => {
      const random1 = Math.floor(Math.random() * 100)
      const random2 = Math.floor(Math.random() * 100);
      return [random1, random2]; // always return a list with the values that are required
    },
    studentImplementationCallback: window.giveComputerAnswer,
    answerCallback: (a, b) => Math.floor(Math.pow(a,4) / (a+b))
  })
};


window.loadLevel1 = function (existingMap, engineFunctions) {
  const map = [
    [12, 12, 12, 12, 12, 12],
    [12, 11, 11, 11, 11, 12],
    [12, 11, 11, 11, 11, 12],
    [12, 11, 12, 11, 11, 12],
    [12, 10, 12, 11, 11, 12],
    [12, 12, 12, 12, 11, 12],
    [12, 99, 12, 12, 11, 12],
    [12, 11, 11, 11, 11, 12],
    [12, 12, 12, 12, 12, 12]
  ];
  existingMap.push(...map);
  window.moveUp = () => engineFunctions.moveDirection("up");
  window.moveDown = () => engineFunctions.moveDirection("down");
  window.moveLeft = () => engineFunctions.moveDirection("left");
  window.moveRight = () => engineFunctions.moveDirection("right");
}
window.loadLevel2 = function (existingMap, engineFunctions) {
  const map = [
    [12, 12, 12, 12, 12, 12, 12],
    [12, 11, 11, 11, 12, 12, 12],
    [12, 11, 12, 11, 12, 12, 12],
    [12, 10, 12, 11, 11, 11, 12],
    [12, 12, 12, 12, 12, 11, 12],
    [12, 11, 11, 11, 12, 11, 12],
    [12, 99, 12, 11, 12, 11, 12],
    [12, 12, 12, 11, 11, 11, 12],
    [12, 12, 12, 12, 12, 12, 12],
  ];

  existingMap.push(...map);
  window.moveDirection = engineFunctions.moveDirection;
}
window.loadLevel3 = function (existingMap, engineFunctions) {
  const map = [
      [12, 12, 12, 12, 12, 12, 12],
      [12, 12, 12, 10, 12, 12, 12],
      [12, 12, 12, 11, 12, 12, 12],
      [12, 12, 12, 11, 12, 12, 12],
      [12, 12, 12, 11, 12, 12, 12],
      [12, 12, 12, 11, 12, 12, 12],
      [12, 12, 12, 11, 12, 12, 12],
      [12, 12, 12, 11, 12, 12, 12],
      [12, 12, 12, 11, 12, 12, 12],
      [12, 12, 12, 99, 12, 12, 12],
      [12, 12, 12, 12, 12, 12, 12]
  ];
  existingMap.push(...map);
  window.moveDirection = engineFunctions.moveDirection;
}
window.loadLevel4 = function (existingMap, engineFunctions) {
  const map = [
    [12, 12, 12, 12, 12, 12, 12, 12, 12],
    [12, 10, 12, 12, 12, 12, 12, 12, 12],
    [12, 11, 11, 12, 12, 12, 12, 12, 12],
    [12, 12, 11, 11, 12, 12, 12, 12, 12],
    [12, 12, 12, 11, 11, 12, 12, 12, 12],
    [12, 12, 12, 12, 11, 11, 12, 12, 12],
    [12, 12, 12, 12, 12, 11, 11, 12, 12],
    [12, 12, 12, 12, 12, 12, 11, 99, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 12],
  ];
  existingMap.push(...map);
  window.moveDirection = engineFunctions.moveDirection;
}
window.loadLevel5 = function (existingMap, engineFunctions) {
  const map = [
    [12, 12, 12, 12, 12],
    [12, 12, 10, 12, 12],
    [12, 12, 11, 12, 12],
    [12, 12, 11, 12, 12],
    [12, 12, 20, 12, 12],
    [12, 12, 11, 12, 12],
    [12, 12, 99, 12, 12],
    [12, 12, 12, 12, 12]
  ];

  existingMap.push(...map);
  window.moveDirection = engineFunctions.moveDirection;
  window.potionCallback = engineFunctions.potionCallback;
}

const loadEvent = () => {

  const lightsE = document.getElementById("lights");

  for (let i = 0; i < 15; i++) {
    lightsE.insertAdjacentHTML("beforeend", `<div class="light"></div>`)    
  }

  try {
    const data = pImp(preData);

    const paramLevel = parseInt(location.search.split("=")[1]);

    if(paramLevel) {

      if(paramLevel === 5){
        window.giveComputerAnswer = data.giveComputerAnswer;        
      }

      document.getElementById("prestyle").innerHTML = `
      #container > div.princess{
        background-image: url("/public/images/princess${paramLevel}.gif");
      }
      #container > div.prince{
        background-image: url("/public/images/prince${paramLevel}.gif");
      }
      `;

      loadLevel(paramLevel);
      data[`level${paramLevel}`]();

    }else{

      const msg = `The link you opened in the browser is incomplete.`;
      console.log(msg);
      showMessage(msg);
      postError(`\n\n${msg}\n\n`);

    }

  } catch (error) {
    console.log(error.message);
    const msg = `Something is not good with your functions, please try to fix it then refresh the page in the browser.`
    console.log(msg);
    showMessage(msg);
    postError(`\n\n${msg}\n\n`)
  }
};

window.addEventListener("load", loadEvent);
