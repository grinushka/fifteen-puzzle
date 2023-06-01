"use strict";

// Variables

let currentCell;
let emptyCell;

let arr = [];
let arrOrderText = [];

let size = 4;
let move = 0;
let totalSeconds = 0;

let clickAudio = new Audio();
clickAudio.src = "assets/mouse-click.mp3";

let swopAudio = new Audio();
swopAudio.src = "assets/swop.mp3";

// Create UI

let playground = document.createElement("div");
playground.setAttribute("class", "playground");
let body = document.querySelector("body");
body.append(playground);

let buttons = document.createElement("div");
buttons.setAttribute("class", "buttons");
playground.append(buttons);

let restart = document.createElement("div");
restart.setAttribute("class", "restart");
restart.textContent = "Restart";
buttons.append(restart);

let pause = document.createElement("div");
pause.setAttribute("class", "pause");
pause.textContent = "Pause";
buttons.append(pause);

let display = document.createElement("div");
display.setAttribute("class", "display");
playground.append(display);

let moves = document.createElement("div");
moves.setAttribute("class", "moves");
moves.textContent = "Moves: 0";
display.append(moves);

let time = document.createElement("div");
time.setAttribute("class", "time");
time.textContent = `Time:`;
display.append(time);

let minutes = document.createElement("div");
minutes.setAttribute("class", "minutes");
minutes.textContent = "00";
time.append(minutes);

let colon = document.createElement("div");
colon.setAttribute("class", "colon");
colon.textContent = ":";
time.append(colon);

let seconds = document.createElement("div");
seconds.setAttribute("class", "seconds");
seconds.textContent = "00";
time.append(seconds);

let field = document.createElement("div");
field.setAttribute("class", "field");
playground.append(field);

let frame = document.createElement("div");
frame.setAttribute("class", "frame");
frame.textContent = "Frame: 4X4";
playground.append(frame);

let sizes = document.createElement("div");
sizes.setAttribute("class", "sizes");
playground.append(sizes);

let three = document.createElement("div");
three.setAttribute("class", "three");
three.textContent = "3x3";
sizes.append(three);

let four = document.createElement("div");
four.setAttribute("class", "four");
four.textContent = "4x4";
sizes.append(four);

let five = document.createElement("div");
five.setAttribute("class", "five");
five.textContent = "5x5";
sizes.append(five);

let label = document.createElement("div");
label.setAttribute("class", "label");
body.append(label);


// Event Listeners for buttons
restart.addEventListener("click", function () {
  startTheGame();
});

three.addEventListener("click", function () {
  size = 3;
  frame.textContent = "Frame: 3X3";
  startTheGame();
});

four.addEventListener("click", function () {
  size = 4;
  frame.textContent = "Frame: 4X4";
  startTheGame();
});

five.addEventListener("click", function () {
  size = 5;
  frame.textContent = "Frame: 5X5";
  startTheGame();
});


// Init the game
function init() {
  // create a matrix for the game (arr)
  let num = 1;
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      let firstCell = [];
      let cell = document.createElement("div");
      cell.setAttribute("class", "cell");
      cell.setAttribute("id", `${i}-${j}`);
      cell.style.order = `${num}`;
      cell.style.width = `${92 / size}%`;

      if (num === size ** 2) {
        cell.textContent = "";
        cell.style.backgroundColor = "#442b6bb2";
        cell.style.boxShadow = 'none';
      } else {
        cell.textContent = `${num}`;
      }

      firstCell.push(cell.getAttribute("id"));
      firstCell.push(cell.textContent);

      arrOrderText.push(firstCell);

      row.push(num);
      num++;

      // Add listeners to each cell
      cell.addEventListener("click", moveCell);

      field.append(cell);
    }
    arr.push(row);
  }
  arr[size - 1][size - 1] = 0;

  return arr;
}

// Move cell on click functionality

function moveCell(e) {
  e.preventDefault();
  let id = e.target.id.split("-");

  let coordinates = [
    [Number(id[0]), Number(id[1]) - 1],
    [Number(id[0]), Number(id[1]) + 1],
    [Number(id[0]) - 1, Number(id[1])],
    [Number(id[0]) + 1, Number(id[1])],
  ];

  let empty;

  let emptyBox = coordinates.filter(function (el) {
    if (el[0] >= 0 && el[1] >= 0 && el[0] < size && el[1] < size) {
      let id = el.join("-");
      if (document.getElementById(`${id}`).textContent === "") {
        empty = id;

        return el;
      }
    }
  });

  let emptyCell = document.getElementById(`${empty}`);
  let currentCell = document.getElementById(`${e.target.id}`);

  let currentID = currentCell.getAttribute("id");
  let emptyID = emptyCell.getAttribute("id");
  let middleID = currentID;

  let currentOrder = getComputedStyle(currentCell).order;
  let emptyOrder = getComputedStyle(emptyCell).order;
  let middleOrder = currentOrder;

  currentCell.style.order = emptyOrder;
  emptyCell.style.order = middleOrder;

  // swop IDs
  currentCell.setAttribute("id", `${emptyID}`);
  emptyCell.setAttribute("id", `${middleID}`);

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
    console.log("true");
    clearInterval(myInterval);
    label.textContent = `You won the Game in ${minutes.textContent}:${seconds.textContent} and ${move} moves!`;
    label.style.display = "block";
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
  let id1 = `${box1.x}` + "-" + `${box1.y}`;
  let id2 = `${box2.x}` + "-" + `${box2.y}`;

  let emptyCell = document.getElementById(`${id1}`);
  let currentCell = document.getElementById(`${id2}`);

  let currentID = currentCell.getAttribute("id");
  let emptyID = emptyCell.getAttribute("id");
  let middleID = currentID;

  let currentOrder = getComputedStyle(currentCell).order;
  let emptyOrder = getComputedStyle(emptyCell).order;
  let middleOrder = currentOrder;

  currentCell.style.order = emptyOrder;
  emptyCell.style.order = middleOrder;

  // swop IDs
  currentCell.setAttribute("id", `${emptyID}`);
  emptyCell.setAttribute("id", `${middleID}`);
}

// Shuffle the boxes to get the random order

function shuffle() {
  let blankBox = new Box(size - 1, size - 1);

  // the place where the games complexity may be changed, the less random moves the easier the game is
  for (let i = 0; i < 500; i++) {
    let randomNextdoorBox = blankBox.getRandomNextdoorBox();
    swapBoxes(blankBox, randomNextdoorBox);
    blankBox = randomNextdoorBox;
  }
}

// Timer
let myInterval;

function setTime() {
  ++totalSeconds;
  seconds.textContent = pad(totalSeconds % 60);
  minutes.textContent = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

// Funtion to clear the field
function clearTheField() {
  field.innerHTML = "";
}

// Start the game
function startTheGame() {
  clearInterval(myInterval);
  minutes.textContent = "00";
  seconds.textContent = "00";
  totalSeconds = 0;
  arrOrderText = [];
  label.style.display = "none";
  move = 0;
  moves.textContent = `Moves: ${move}`;
  clearTheField();
  init();
  shuffle();
  myInterval = setInterval(setTime, 1000);
}

// What happens when the pages is loaded
window.onload = startTheGame();