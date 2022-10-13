var INITIAL_PLAYER_BADGE = "X";
var grid = document.getElementById("grid");
var message = document.querySelector(".message");
var badge = INITIAL_PLAYER_BADGE;
var cells;


function playerMove() {
  if (message.textContent) return;
  if (this.textContent == "") {
    this.textContent = badge;
    checkWinnerDiagonales();
    switchMark();
    if (!message.textContent) {
      computerMove();
    }
  }
}

function computerMove() {
  var emptyCells = [];
  var random;

  cells.forEach(function (cell) {
    if (cell.textContent == "") {
      emptyCells.push(cell);
    }
  });

  random = Math.ceil(Math.random() * emptyCells.length) - 1;
  emptyCells[random].textContent = badge;
  checkWinnerDiagonales();
  switchMark();
}

function switchMark() {
  if (badge == "X") {
    badge = "O";
  } else {
    badge = "X";
  }
}

function checkDiagonal(diagonal) {
  const hasSameMarks = diagonal.every((c) => c.textContent === badge);
  if (hasSameMarks) {
    message.textContent = `Отримав перемогу ${badge}`;
    diagonal.forEach((c) => c.classList.add("green-cell"));
    return true;
  } else {
    return false;
  }
}

function checkWinnerDiagonales() {
  const winnerCombinations = [
    ["c1", "c2", "c3"],
    ["c4", "c5", "c6"],
    ["c7", "c8", "c9"],
    ["c1", "c4", "c7"],
    ["c2", "c5", "c8"],
    ["c3", "c6", "c9"],
    ["c1", "c5", "c9"],
    ["c3", "c5", "c7"],
  ];

  winnerCombinations.forEach(([c1Id, c2Id, c3Id]) => {
    const diagonal = [
      document.getElementById(c1Id),
      document.getElementById(c2Id),
      document.getElementById(c3Id),
    ];
    checkDiagonal(diagonal);
  });
}

function resetFields() {
  badge = INITIAL_PLAYER_BADGE;
  cells.forEach(function (cell) {
    cell.textContent = "";
    cell.classList.remove("green-cell");
  });
  message.textContent = "";
}

function createFields() {
  for (let i = 1; i <= 9; i++) {
    var cell = document.createElement("li");
    cell.id = "c" + i;
    cell.addEventListener("click", playerMove, false);
    grid.appendChild(cell);
  }

  cells = Array.prototype.slice.call(grid.getElementsByTagName("li"));
}

var resetButton = document.querySelector("button");

resetButton.addEventListener("click", function (e) {
  e.preventDefault();
  resetFields();
});

createFields();