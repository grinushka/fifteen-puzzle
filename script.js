"use strict";

// To anyone who is reading it right now:
// Thank you for the time you spend on this!
// I am sorry for the messy code, but I had to make it work
// being short of time
// that is why it is not kind of optimized.

// SOME VARIABLES THAT WILL BE USED

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

// CREATE UI

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

let stop = document.createElement("div");
stop.setAttribute("class", "stop");
stop.textContent = "Stop";
buttons.append(stop);

let save = document.createElement("div");
save.setAttribute("class", "save");
save.textContent = "Save";
buttons.append(save);

let results = document.createElement("div");
results.setAttribute("class", "results");
results.textContent = "Results";
buttons.append(results);

let display = document.createElement("div");
display.setAttribute("class", "display");
playground.append(display);

let moves = document.createElement("div");
moves.setAttribute("class", "moves");
moves.textContent = "Moves: 0";
display.append(moves);

let time = document.createElement("div");
time.setAttribute("class", "time");
time.textContent = `Time:  `;
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

let six = document.createElement("div");
six.setAttribute("class", "six");
six.textContent = "6x6";
sizes.append(six);

let seven = document.createElement("div");
seven.setAttribute("class", "seven");
seven.textContent = "7x7";
sizes.append(seven);

let eight = document.createElement("div");
eight.setAttribute("class", "eight");
eight.textContent = "8x8";
sizes.append(eight);

let label = document.createElement("div");
label.setAttribute("class", "label");
// label.textContent = ``;
body.append(label);

// INITIALIZE the game
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
        cell.style.backgroundColor = "white";
        cell.style.boxShadow = 'none';
      } else {
        cell.textContent = `${num}`;
      }

      firstCell.push(cell.getAttribute("id"));
      firstCell.push(cell.textContent);

      arrOrderText.push(firstCell);

      row.push(num);
      num++;

      // add listeners to each cell
      cell.addEventListener("click", moveCell);

      cell.addEventListener("dragstart", dragStart);
      cell.addEventListener("dragover", dragOver);

      cell.addEventListener("dragenter", dragEnter);
      cell.addEventListener("dragleave", dragLeave);

      cell.addEventListener("drop", dragDrop);
      cell.addEventListener("dragend", dragEnd);

      field.append(cell);
    }
    arr.push(row);
  }
  arr[size - 1][size - 1] = 0;

  return arr;
}

// CLICK functionality //not implemented yet

function moveCell(e) {
  e.preventDefault();
  let id = e.target.id.split("-");
  console.log(id);

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

  console.log(emptyCell, currentCell);

  let currentID = currentCell.getAttribute("id");
  let emptyID = emptyCell.getAttribute("id");
  let middleID = currentID;

  let currentOrder = getComputedStyle(currentCell).order;
  let emptyOrder = getComputedStyle(emptyCell).order;
  let middleOrder = currentOrder;

  currentCell.style.order = emptyOrder;
  emptyCell.style.order = middleOrder;

  // change IDs
  currentCell.setAttribute("id", `${emptyID}`);
  emptyCell.setAttribute("id", `${middleID}`);

  move++;
  moves.textContent = `Moves: ${move}`;
  clickAudio.play();

  checkGame();
}

// DRAG FUNCTIONS
function dragStart(e) {
  currentCell = this;
  e.target.classList.add('hold');
}


function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  e.target.style.backgroundColor = 'lightblue';
}

function dragLeave(e) {
  e.target.style.backgroundColor = 'rgb(252, 237, 33)';
}

function dragDrop(e) {
  emptyCell = this;
  e.style.backgroundColor = 'rgb(252, 237, 33)';
}

function dragEnd(e) {
  // e.target.style.backgroundColor = 'rgb(252, 237, 33)';
  e.target.classList.remove('hold', 'hide')
  // if the TD we are swoping in is not empty one, we do nothing
  if (!(Boolean(emptyCell.textContent) === false)) {
    return;
  }

  let currentCoords = currentCell.id.split("-");
  let row = parseInt(currentCoords[0]);
  let column = parseInt(currentCoords[1]);

  let emptyCoords = emptyCell.id.split("-");
  let row2 = parseInt(emptyCoords[0]);
  let column2 = parseInt(emptyCoords[1]);

  let moveLeft = row == row2 && column2 == column - 1;
  let moveRight = row == row2 && column2 == column + 1;

  let moveUp = column == column2 && row2 == row - 1;
  let moveDown = column == column2 && row2 == row + 1;

  let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

  if (isAdjacent) {
    // swop order
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

    emptyCell.style.backgroundColor = 'white';
    emptyCell.style.boxShadow = 'none';

    swopAudio.play();
    //check if the player won
    checkGame();
  }
}

// check if the player won

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
  } else {
    console.log("false");
    console.log(JSON.stringify(arrOrderText.flat()));
    console.log(JSON.stringify(arrCheck.flat()));
  }
}

// get neigbours of our empty cell

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

// Start the game over
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

// What happens when the pages id loaded
window.onload = startTheGame();

// EVENT LISTENERS
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

six.addEventListener("click", function () {
  size = 6;
  frame.textContent = "Frame: 6X6";
  startTheGame();
});

seven.addEventListener("click", function () {
  size = 7;
  frame.textContent = "Frame: 7X7";
  startTheGame();
});

eight.addEventListener("click", function () {
  size = 8;
  frame.textContent = "Frame: 8X8";
  startTheGame();
});
