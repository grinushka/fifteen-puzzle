'use strict';

// Variables
let currentCell;
let emptyCell;

let arr = [];
let arrOrderText = [];

let size = 4;
let move = 0;
// Control the difficulty of the game
let difficulty = 50;

let totalSeconds = 0;
let isPaused = false;

const clickAudio = new Audio();
clickAudio.src = 'assets/mouse-click.mp3';


// Create UI
const playground = document.createElement('div');
playground.setAttribute('class', 'playground');

const body = document.querySelector('body');
body.append(playground);

const buttons = document.createElement('div');
buttons.setAttribute('class', 'buttons');
playground.append(buttons);

const restart = document.createElement('div');
restart.setAttribute('class', 'restart');
restart.textContent = 'Restart';
buttons.append(restart);

const pause = document.createElement('div');
pause.setAttribute('class', 'pause');
pause.textContent = 'Pause';
buttons.append(pause);

const display = document.createElement('div');
display.setAttribute('class', 'display');
playground.append(display);

const moves = document.createElement('div');
moves.setAttribute('class', 'moves');
moves.textContent = 'Moves: 0';
display.append(moves);

const time = document.createElement('div');
time.setAttribute('class', 'time');
time.textContent = `Time:`;
display.append(time);

const minutes = document.createElement('div');
minutes.setAttribute('class', 'minutes');
minutes.textContent = '00';
time.append(minutes);

const colon = document.createElement('div');
colon.setAttribute('class', 'colon');
colon.textContent = ':';
time.append(colon);

const seconds = document.createElement('div');
seconds.setAttribute('class', 'seconds');
seconds.textContent = '00';
time.append(seconds);

const field = document.createElement('div');
field.setAttribute('class', 'field');
playground.append(field);

const frame = document.createElement('div');
frame.setAttribute('class', 'frame');
frame.textContent = 'Frame: 4X4';
playground.append(frame);

const sizes = document.createElement('div');
sizes.setAttribute('class', 'sizes');
playground.append(sizes);

const three = document.createElement('div');
three.setAttribute('class', 'three');
three.textContent = '3x3';
sizes.append(three);

const four = document.createElement('div');
four.setAttribute('class', 'four');
four.textContent = '4x4';
sizes.append(four);

const five = document.createElement('div');
five.setAttribute('class', 'five');
five.textContent = '5x5';
sizes.append(five);

const label = document.createElement('div');
label.setAttribute('class', 'label');
body.append(label);

const winMessage = document.createElement('span');
label.append(winMessage);

const labelRestart = document.createElement('button');
label.append(labelRestart);
labelRestart.innerHTML = 'Restart the game';


// Event Listeners for buttons
restart.addEventListener('click', () => {
  startTheGame();
});

pause.addEventListener('click', () => {
  if (isPaused) {
    pause.textContent = 'Pause';
    isPaused = false;
    field.style.pointerEvents = 'auto';
  } else {
    pause.textContent = 'Resume';
    isPaused = true;
    field.style.pointerEvents = 'none';
  }
});

labelRestart.addEventListener('click', () => {
  startTheGame();
  playground.style.opacity = '1';
})

three.addEventListener('click', () => {
  size = 3;
  frame.textContent = 'Frame: 3X3';
  startTheGame();
});

four.addEventListener('click', () => {
  size = 4;
  frame.textContent = 'Frame: 4X4';
  startTheGame();
});

five.addEventListener('click', () => {
  size = 5;
  frame.textContent = 'Frame: 5X5';
  startTheGame();
});

// Init the game
function initGame() {
  // create a matrix for the game (arr)
  let num = 1;
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      let firstCell = [];
      let cell = document.createElement('div');
      cell.setAttribute('class', 'cell');
      cell.setAttribute('id', `${i}-${j}`);
      cell.style.order = `${num}`;
      cell.style.width = `${92 / size}%`;

      // Change the styling for an empty box, whihc will be the size**2
      if (num === size ** 2) {
        cell.textContent = '';
        cell.style.backgroundColor = '#342e55';
        cell.style.boxShadow = 'none';
      } else {
        // Other cells will be with the number
        cell.textContent = `${num}`;
      }

      firstCell.push(cell.getAttribute('id'));
      firstCell.push(cell.textContent);

      arrOrderText.push(firstCell);

      row.push(num);
      num++;

      // Add listeners to each cell
      cell.addEventListener('click', moveCell);

      field.append(cell);
    }
    arr.push(row);
  }
  arr[size - 1][size - 1] = 0;

  return arr;
}

// Move cell on Click
function moveCell(e) {
  e.preventDefault();
  let id = e.target.id.split('-');

  let coordinates = [
    [Number(id[0]), Number(id[1]) - 1],
    [Number(id[0]), Number(id[1]) + 1],
    [Number(id[0]) - 1, Number(id[1])],
    [Number(id[0]) + 1, Number(id[1])],
  ];

  let emptyBox;

  coordinates.filter(function (el) {
    if (el[0] >= 0 && el[1] >= 0 && el[0] < size && el[1] < size) {
      let id = el.join('-');
      if (document.getElementById(`${id}`).textContent === '') {
        emptyBox = id;

        return el;
      }
    }
  });

  // Quit if an empty box was not found
  if (!emptyBox) {
    return;
  }

  let emptyCell = document.getElementById(`${emptyBox}`);
  let currentCell = document.getElementById(`${e.target.id}`);

  let currentID = currentCell.getAttribute('id');
  let emptyID = emptyCell.getAttribute('id');
  let middleID = currentID;

  let currentOrder = getComputedStyle(currentCell).order;
  let emptyOrder = getComputedStyle(emptyCell).order;
  let middleOrder = currentOrder;

  currentCell.style.order = emptyOrder;
  emptyCell.style.order = middleOrder;

  // Get ids of an empty cell and a clicked cell
  currentCell.setAttribute('id', `${emptyID}`);
  emptyCell.setAttribute('id', `${middleID}`);

  move++;
  moves.textContent = `Moves: ${move}`;
  clickAudio.play();

  checkGame();
}

// Check if the player has won the game
function checkGame() {
  let arrCheck = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let cellCheck = [];
      let id = `${i}-${j}`;
      let cell = document.getElementById(`${id}`);

      cellCheck.push(`${i}-${j}`);
      cellCheck.push(cell.textContent);
      arrCheck.push(cellCheck);
    }
  }

  if (JSON.stringify(arrOrderText.flat()) === JSON.stringify(arrCheck.flat())) {
    clearInterval(myInterval);

    winMessage.textContent = `You won the game in ${minutes.textContent}:${seconds.textContent} and ${move} moves!`;
    label.style.top = '20%';
    label.style.display = 'block';

    playground.style.opacity = '0.4';
    field.style.pointerEvents = 'none';

    arrOrderText = [];
  }
}

// Get neigbours of our empty cell
class Box {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getTopBox() {
    if (this.y === 0) return null;
    return new Box(this.x, this.y - 1);
  }
  getRightBox() {
    if (this.x === size - 1) return null;
    return new Box(this.x + 1, this.y);
  }
  getBottomBox() {
    if (this.y === size - 1) return null;
    return new Box(this.x, this.y + 1);
  }
  getLeftBox() {
    if (this.x === 0) return null;
    return new Box(this.x - 1, this.y);
  }

  getNextdoorBoxes() {
    return [
      this.getTopBox(),
      this.getRightBox(),
      this.getBottomBox(),
      this.getLeftBox(),
    ].filter((box) => box !== null);
  }

  getRandomNextdoorBox() {
    const nextdoorBoxes = this.getNextdoorBoxes();
    return nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)];
  }
}

// box1 = empty, box2 = the target
function swapBoxes(box1, box2) {
  let id1 = `${box1.x}` + '-' + `${box1.y}`;
  let id2 = `${box2.x}` + '-' + `${box2.y}`;

  let emptyCell = document.getElementById(`${id1}`);
  let currentCell = document.getElementById(`${id2}`);

  let currentID = currentCell.getAttribute('id');
  let emptyID = emptyCell.getAttribute('id');
  let middleID = currentID;

  let currentOrder = getComputedStyle(currentCell).order;
  let emptyOrder = getComputedStyle(emptyCell).order;
  let middleOrder = currentOrder;

  currentCell.style.order = emptyOrder;
  emptyCell.style.order = middleOrder;

  // swop IDs
  currentCell.setAttribute('id', `${emptyID}`);
  emptyCell.setAttribute('id', `${middleID}`);
}

// Shuffle the boxes to get the random order
function shuffle() {
  let blankBox = new Box(size - 1, size - 1);

  // the place where the games complexity may be changed, the less random moves the easier the game is
  for (let i = 0; i < difficulty; i++) {
    let randomNextdoorBox = blankBox.getRandomNextdoorBox();
    swapBoxes(blankBox, randomNextdoorBox);
    blankBox = randomNextdoorBox;
  }
}

// Timer
let myInterval;

function setTime() {
  if (!isPaused) {
    ++totalSeconds;
    seconds.textContent = pad(totalSeconds % 60);
    minutes.textContent = pad(parseInt(totalSeconds / 60));
  }
}

function pad(val) {
  var valString = val + '';
  if (valString.length < 2) {
    return '0' + valString;
  } else {
    return valString;
  }
}

// Funtion to clear the field
function clearTheField() {
  field.innerHTML = '';
}

// Start the game
function startTheGame() {
  isPaused = false;
  pause.textContent = 'Pause';
  
  clearInterval(myInterval);
  minutes.textContent = '00';
  seconds.textContent = '00';
  totalSeconds = 0;
  
  field.style.pointerEvents = 'auto';
  label.style.display = 'none';
  move = 0;
  moves.textContent = `Moves: ${move}`;
  
  arrOrderText = [];
  clearTheField();
  initGame();
  shuffle();

  myInterval = setInterval(setTime, 1000);
}

// What happens when the pages is loaded
window.onload = startTheGame();
