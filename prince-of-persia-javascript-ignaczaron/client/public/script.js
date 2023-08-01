/*
    ********************************
    *PLEASE DO NOT MODIFY THIS FILE*
    ********************************
*/

import { toExport as preData } from '/levels.js';
import { postError, pImp } from '/public/jet.js';



const tickTime = 600;
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
    const msg = "YOU WON !!! Refresh the Page to play it Again!";
    document.querySelector("body").classList.add("win");
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
    const correctAnswer = configuration.answerCallback(...input);
    const answerFromStudentImplementation = configuration.studentImplementationCallback(...input);
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
  htmlMap.style.width = `${(map[0].length * 30)}px`;
  htmlMap.style.height = `${(map.length * 30)}px`;
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
  message && showMessage(message);
  message && postError(message);

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
    gameStats,
    tickTime
  });
  setPlayerCoordinates(map);
  startGame();
}



window.loadLevel = loadLevel;
window.mapCallbacks = mapCallbacks;


mapCallbacks["fire"] = { code: 13, callback: potion1Callback, icon: "fire" };

function potion1Callback(gameStats) {
    const msg = "You entered in the fire and died a terrible death :( ";
    console.log(msg);
    showMessage(msg);
    postError(msg);

    gameStats.playerHealth = 0;
    gameStats.isGameRunning = 0;
    return false;
}

mapCallbacks["gate1"] = { code: 90, callback: gate1Callback, icon: "cane" };

function gate1Callback(gameStats) {
  if (gameStats.playerHealth > 99) {
    const msg = "You are fit enough to carry the grand prize !";
    console.log(msg);
    showMessage(msg);
    postError(msg);

    return true;
  }else{

    const msg = `Player health: ${gameStats.playerHealth} You shall not pass !!!\n(until you have 100 health)\nBests Gandalf`;
    console.log(msg);
    showMessage(msg);
    postError(msg);

    return false;
  }
}

mapCallbacks["manualControlOn"] = { code: 41, callback: manualControlOnCallback, icon: "keyboard" };

function manualControlOnCallback(gameStats) {

  const msg = "You can now manually control the player through the keyboard.";
  console.log(msg);
  showMessage(msg);
  postError(msg);

  document.body.addEventListener("keydown", (event) => {
    if (gameStats.isGameRunning)
    {
        try {
            manuallyControl(event.code);
        } catch (e) {
            console.log(`You haven't implemented the function for moving!`);
            console.log(e);
        }
    }
  });

  return true;
}

mapCallbacks["potion2"] = {
  code: 22,
  icon: "potion",
  callback: () => potionCallback({
          question: 'What is the sum of all the even numbers in the list {{1}} ?',
          rewardPoints: 10,
          randomInputCallback: () => {
              const amount = Math.floor(Math.random() * 6) + 2;
              const list = [];
              for (let index = 0; index < amount; index++) {
                  list.push(Math.floor(Math.random() * 20))
              }
              return [list]; // always return a list with the values that are required
          },
          studentImplementationCallback: givePotion2Answer,
          answerCallback: (b)=>{let c=0;for(let a=0;a<b.length;a++)b[a]%2==0&&(c+=b[a]);return c}
      }
  )
};

mapCallbacks["potion3"] = {
  code: 23,
  icon: "potion",
  callback: () => potionCallback({
          question: 'Find the highest number in the list {{1}}',
          rewardPoints: 10,
          randomInputCallback: () => {
              Math.max = () => {
                  const msg = "Magic door does not allow to use Math.max function, find another way !";
                  console.log(msg);
                  postError(msg)
                  showMessage(msg)
              }
              const amount = Math.floor(Math.random() * 6) + 2;
              const list = [];
              for (let index = 0; index < amount; index++) {
                  list.push(Math.floor(Math.random() * 20))
              }
              return [list]; // always return a list with the values that are required
          },
          studentImplementationCallback: givePotion3Answer,
          answerCallback: (a)=>{let c=a[0];for(let b=0;b<a.length;b++)a[b]>c&&(c=a[b]);return c},
      }
  )
};

mapCallbacks["potion4"] = {
  code: 24,
  icon: "dollar",
  callback: () => potionCallback({
          question: 'Capitalize in the string {{1}} the letters: {{2}}',
          rewardPoints: 30,
          randomInputCallback: () => {
              const letters = ['c', 'o', 'd', 'e', 'l', 'r', 'c'];
              let input = "";
              let toCapitalize = [];

              for (let i = 0; i < Math.floor(Math.random() * 8); i++) {
                  input += letters[Math.floor(Math.random() * letters.length)];
              }
              toCapitalize.push(letters[Math.floor(Math.random() * letters.length)]);
              toCapitalize.push(letters[Math.floor(Math.random() * letters.length)]);

              return [input, toCapitalize]; // always return a list with the values that are required
          },
          studentImplementationCallback: givePotion4Answer,
          answerCallback: (a,b)=>{
            let result;
            return (result="",a.split("").forEach(a=>{result+=b.includes(a)?a.toUpperCase():a}),result)
          }
      }
  )
};

mapCallbacks["potion5"] = {
  code: 25,
  icon: "dollar",
  callback: () => potionCallback({
          question: 'if you add {{4}} seconds to {{1}}:{{2}}:{{3}} what time will it be ?',
          rewardPoints: 30,
          randomInputCallback: () => {
              const hours = Math.floor(Math.random() * 24);
              const minutes = Math.floor(Math.random() * 2 )+58;
              const seconds = Math.floor(Math.random() * 10)+50;
              const secondsToAdd = Math.floor(Math.random() * 50);

              return [hours, minutes, seconds, secondsToAdd]; // always return a list with the values that are required
          },
          studentImplementationCallback: givePotion5Answer,
          answerCallback: (a,b,c,d)=>((c+=d)>59&&(c-=60,(b+=1)>59&&(b-=60,(a+=1)>23&&(a=0))),`${a}:${b}:${c}`)
      }
  )
};

mapCallbacks["potion6"] = {
  code: 26,
  icon: "potion",
  callback: () => potionCallback({
          question: 'Sum all the numbers from the following input: {{1}}',
          rewardPoints: 15,
          randomInputCallback: () => {
              const amount = Math.floor(Math.random() * 5)+3;
              let input = "";
              for (let i=0; i<amount; i++) {
                  input += "*" + Math.floor(Math.random() * 10);
              }
              return [input]; // always return a list with the values that are required
          },
          studentImplementationCallback: givePotion6Answer,
          answerCallback: a=>{let numbers=a.split("*");let b=0;return numbers.forEach(a=>{let converted; isNaN(converted=parseInt(a))||(b+=converted)}),b},
      }
  )
};

mapCallbacks["potion7"] = {
  code: 27,
  icon: "dollar",
  callback: () => potionCallback({
          question: 'Make a sum of all the numbers in the input: {{1}}',
          rewardPoints: 30,
          randomInputCallback: () => {
              const allowedCharacters = "a3w9*8(6%0";
              let input = "";
              const amount = Math.floor(Math.random() * 4)+4;
              for (let i=0; i<amount; i++) {
                  input += allowedCharacters[Math.floor(Math.random() * 10)];
              }
              return [input]; // always return a list with the values that are required
          },
          studentImplementationCallback: givePotion7Answer,
          answerCallback: e=>{let b=e.split(""),c=0;for(let a=0;a<b.length;a++){let d=parseInt(b[a]);isNaN(d)||(c+=d)}return c}        }
  )
};

mapCallbacks["potion8"] = {
  code: 28,
  icon: "dollar",
  callback: () => potionCallback({
          question: 'Is the number {{1}} prime or not ?',
          rewardPoints: 30,
          randomInputCallback: () => {
              const numbers = [4, 3, 8, 7, 20, 13, 17, 19, 23, 12, 24, 29]
              return [numbers[Math.floor(Math.random() * numbers.length)]]; // always return a list with the values that are required
          },
          studentImplementationCallback: givePotion8Answer,
          answerCallback: b=>{for(let a=2;a<b-1;a++)if(b%a==0)return!1;return!0}    }
  )
};

mapCallbacks["potion9"] = {
  code: 29,
  icon: "dollar",
  callback: () => potionCallback({
          question: 'Make the sum of the 2 smallest numbers in the list {{1}}',
          rewardPoints: 30,
          randomInputCallback: () => {
              const list = [];
              for (let i=0; i<5; i++) {
                  list.push(Math.floor(Math.random() * 20))
              }
              return [list]; // always return a list with the values that are required
          },
          studentImplementationCallback: givePotion9Answer,
          answerCallback: a=>(a.sort((a,b)=>a-b),a[0]+a[1])    })
};

mapCallbacks["potion10"] = {
  code: 30,
  icon: "potion",
  callback: () => potionCallback({
          question: 'Find the first position where the letter {{1}} first appears in the string {{2}} and -1 if not found.',
          rewardPoints: 10,
          randomInputCallback: () => {
              String.prototype.indexOf = () => {
                const msg = "Magic door does not allow the use of the function indexOf.";
                console.log(msg);
                showMessage(msg);
                postError(msg);
              };
              String.prototype.search = () => {
                const msg = "Magic door does not allow the use of the function search."
                console.log(msg);
                showMessage(msg);
                postError(msg);
              }
              const letters = "sadeqroiu";
              const letterToFind = letters[Math.floor(Math.random() * letters.length)];
              let input = "";
              for (let i=0; i<9; i++) {
                  input = input + (letters[Math.floor(Math.random() * letters.length)]);
              }
              return [letterToFind, input]; // always return a list with the values that are required
          },
          studentImplementationCallback: givePotion10Answer,
          answerCallback: (c,b)=>{for(let a=0;a<b.length;a++)if(b[a]===c)return a;return -1}
  })
};

mapCallbacks["potion11"] = {
  code: 31,
  icon: "potion",
  callback: () => potionCallback({
      question: 'In the text {{1}} replace all occurences of the letter {{2}} with the letter {{3}}. Do not use the replace function !',
      rewardPoints: 15,
      randomInputCallback: () => {
          String.prototype.indexOf = () => {
            const msg ="Magic door does not allow the use of the function indexOf.";
            console.log(msg);
            showMessage(msg);
            postError(msg);

          }

          String.prototype.search = () => {
            const msg = "Magic door does not allow the use of the function search.";
            console.log(msg);
            showMessage(msg);
            postError(msg);

          }
          const letters = "sadeqroiu";
          let input = "";
          for (let i = 0; i < 9; i++) {
              input = input + (letters[Math.floor(Math.random() * letters.length)]);
          }
          const letterToReplace = input[Math.floor(Math.random() * letters.length)];
          const letterToPutInstead = input[Math.floor(Math.random() * letters.length)];
          return [input, letterToReplace, letterToPutInstead]; // always return a list with the values that are required
      },
      studentImplementationCallback: givePotion11Answer,
      answerCallback: (b, d, e) => { let c = ""; for (let a = 0; a < b.length; a++)b[a] === d ? c += e : c += b[a]; return c }
  })
};
mapCallbacks["potion12"] = {
  code: 32,
  icon: "potion",
  callback: () => potionCallback({
          question: 'Make the sum of all the numbers in the list {{1}}. If a number is negative make it positive before addition [-1,2] => [1, 2] => 3',
          rewardPoints: 15,
          randomInputCallback: () => {
              const amount = Math.floor(Math.random() * 6) + 2;
              const list = [];
              for (let index = 0; index < amount; index++) {
                  list.push((Math.floor(Math.random() * 10)) * ((index % 2) === 0 ? -1 : 1))
              }
              return [list]; // always return a list with the values that are required
          },
          studentImplementationCallback: givePotion12Answer,
          answerCallback: b=>{let c=0;for(let a=0;a<b.length;a++)b[a]<0?c+=-1*b[a]:c+=b[a];return c}    })
};


window.loadLevel6 = function (existingMap, engineFunctions) {
  map = [
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 12, 12, 12, 12],
    [13, 13, 13, 12, 12, 12, 12, 12, 13, 11, 11, 11, 13, 11, 11, 11, 12, 12, 12, 12],
    [13, 10, 13, 13, 12, 13, 13, 13, 11, 11, 13, 11, 11, 11, 13, 41, 11, 11, 23, 12],
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
    [12, 12, 12, 12, 12, 12, 11, 32, 12, 12, 12, 12, 12, 12, 12, 90, 11, 12, 12, 12],
    [12, 12, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12, 12, 12, 12, 99, 12, 12, 12, 12],
    [12, 29, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 11, 11, 11, 12, 12, 12, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
  ];

  existingMap.length = 0;
  existingMap.push(...map);
  window.moveDirection = engineFunctions.moveDirection;
  window.showMessage = engineFunctions.showMessage;
  window.potionCallback = engineFunctions.potionCallback;
}

function startLevel6() {
    for (let i = 0; i < 8; i++) {
        let directionToGo = getStairsMovementDirection(i, false);
        moveDirection(directionToGo, `[getStairsMovementDirection(${i}, false)] says to go: ${directionToGo}`);
    }

    for (let i = 0; i < 8; i++) {
        let directionToGo = getStairsMovementDirection(i, true);
        moveDirection(directionToGo, `[getStairsMovementDirection(${i}, true)] says to go: ${directionToGo}`);
    }

    for (let i = 0; i < 10; i++) {
        let directionToGo = getZigZagMovementDirection(i);
        moveDirection(directionToGo, `[getZigZagMovementDirection(${i})] says to go: ${directionToGo}`);
    }
}

window.loadLevel7 = function (existingMap, engineFunctions) {
  const map = getRandomMap();
  engineFunctions.gameStats.playerLocationX = 1;
  engineFunctions.gameStats.playerLocationY = 1;

  existingMap.length = 0;
  existingMap.push(...map);
  window.moveDirection = engineFunctions.moveDirection;
  window.showMessage = engineFunctions.showMessage;
  window.gameMap = JSON.parse(JSON.stringify(map));

  logMap();
  let tick = engineFunctions.tickTime+1;
  setTimeout(() => autoAdvancePrince(map, engineFunctions.gameStats, tick), 500);
}

window.loadLevel8 = function (existingMap, engineFunctions) {
  const map = getRandomMap();
  engineFunctions.gameStats.playerLocationX = 1;
  engineFunctions.gameStats.playerLocationY = 1;

  existingMap.length = 0;
  existingMap.push(...map);
  window.showMessage = engineFunctions.showMessage;
  window.gameMap = JSON.parse(JSON.stringify(map));

  logMap();
  setTimeout(() => {
      const movements = window['level8Move'](window.gameMap);
      for (let movement of movements) {
          engineFunctions.moveDirection(movement);
      }
  }, 1000);
}

function autoAdvancePrince(map, gameStats, tick) {
  if (gameStats.isGameRunning) {
      const left = map[gameStats.playerLocationX][gameStats.playerLocationY-1];
      const right = map[gameStats.playerLocationX][gameStats.playerLocationY+1];
      const up = map[gameStats.playerLocationX-1][gameStats.playerLocationY];
      const down = map[gameStats.playerLocationX+1][gameStats.playerLocationY];
      if (window['level7Move'].toString().includes('moveDirection')) {
          console.log('\n\n\nIn this level you can not use the "moveDirection" function directly\n\n\nBut nothing stops you from creating another function that calls "moveDirection" and then calling that function.');
          return;
      }

      window['level7Move'](left, right, up, down);
      setTimeout(
          () => autoAdvancePrince(map, gameStats, tick)
          ,tick
      )
  }
}

function getRandomMap() {
  let map = [
      [13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
      [13, 10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11, 13],
      [13, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11, 13],
      [13, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 13],
      [13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
  ];
  const insert = (what, where, index) => ([...where.slice(0, index), what , ...where.slice(index, where.length)]);
  const generateRandomNumber = (min, max) => Math.floor(min + Math.random()*(max - min + 1));

  const randomZigZagToAdd = generateRandomNumber(2,4);
  for (let i = 0; i<randomZigZagToAdd; i++) {
      map[4][map[0].length -2 -i*4] = 11;
      map[4][map[0].length -3 -i*4] = 11;
      map[4][map[0].length -4 -i*4] = 11;
      map[4][map[0].length -5 -i*4] = 13;

      map[3][map[0].length -4 -i*4] = 11;
      map[3][map[0].length -5 -i*4] = 11;
      map[3][map[0].length -6 -i*4] = 11;
      map[3][map[0].length -7 -i*4] = 13;
  }

  const randomPathToPrincess = generateRandomNumber(4,9);
  for (let i = 0; i<randomPathToPrincess; i++) {
      map[i+3][map[0].length - 2 - randomZigZagToAdd * 4] = 11;
      map[i+3][map[0].length - 3 - randomZigZagToAdd * 4] = 11;
  }

  const randomPrincessLocationX = generateRandomNumber(0,1);
  const randomPrincessLocationY = generateRandomNumber(0,1);
  map[randomPathToPrincess+1+randomPrincessLocationX][map[0].length - 2 - randomPrincessLocationY - randomZigZagToAdd * 4] = 99;

  const randomHeightToAdd = generateRandomNumber(1,7);
  for (let i=0; i<randomHeightToAdd; i++) {
      map = insert(map[2], map, 2);
  }

  const randomWidthToAdd = generateRandomNumber(1,7);
  for (let i=0; i<randomWidthToAdd; i++) {
      for (let j = 0; j<map.length; j++) {
          map[j] = insert(map[j][3], map[j], 3);
      }
  }

  return map;
}

const getMapCodes = () => {
  const codes = [];
  for (let i=0; i<gameMap.length; i++) {
      for (let j=0; j<gameMap[i].length; j++) {
          if (!codes.includes(gameMap[i][j])) {
              codes.push(gameMap[i][j]);
          }
      }
  }
  return codes;
}

function logMap() {
  const spaces = 3;
  const formatPrint = (toPrint, pattern=' ') => ' '.repeat(spaces - toPrint.toString().length) + toPrint + pattern;
  let toPrint = '\n\n' + ' '.repeat(spaces+1);
  for (let i = 0; i < gameMap[0].length; i++) {
      toPrint += formatPrint(i);
  }
  toPrint += '\n';
  toPrint += ' '.repeat(spaces) + `-`.repeat((spaces+1)*gameMap[0].length);
  for (let i = 0; i < gameMap.length; i++) {
      toPrint += `\n`;
      toPrint += formatPrint(i, '|');
      for (let j = 0; j < gameMap[i].length; j++) {
          toPrint += formatPrint(gameMap[i][j]);
      }
  }

  toPrint += `\n\n\n${' '.repeat(spaces*Math.ceil(gameMap[0].length/2)+spaces)}Legend\n`
  const keys = Object.keys(mapCallbacks);
  const codes = getMapCodes();

  for (let i=0; i<keys.length; i++) {
      if (codes.includes(mapCallbacks[keys[i]].code)) {
          toPrint += `\n${mapCallbacks[keys[i]].code} - ${keys[i]}\n`
      }
  }
  console.log(toPrint);
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
      if (paramLevel > 5) {
        for (const key in data) {
          window[`${key}`] = data[`${key}`];
        }
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

      if(paramLevel === 6){
        setTimeout(() => startLevel6(), 2000);

      }

      if(paramLevel > 0 && paramLevel < 6){
        data[`level${paramLevel}`]();
      }

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
