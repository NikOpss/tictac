// Nodes
var grid = document.getElementById("grid");
var historyButton = document.getElementById("fill-button");
var message = document.querySelector(".message");
var resetButton = document.querySelector("button");
var timeWrapper = document.querySelector(".time-wrapper");
var roundsTimeMessage = document.querySelector(".rounds-start-time");
var select = document.querySelector("select");
var selectWrapper = document.querySelector(".select-wrapper");
var historyTable = document.querySelector(".history-table");
var historyTableWrapper = document.querySelector(".history-table-wrapper");
var cells;

var CROSS = "X";
var ZERO = "O";

const INITIAL_SELECTED_VALUE = "hint";
const RESTART_TIME_MS = 3000;

var INITIAL_PLAYER_BADGE = CROSS;

var currentBage = INITIAL_PLAYER_BADGE;
var playerBage = INITIAL_PLAYER_BADGE;

const WIN_CONMBINATIONS = [
  ["c1", "c2", "c3"],
  ["c4", "c5", "c6"],
  ["c7", "c8", "c9"],
  ["c1", "c4", "c7"],
  ["c2", "c5", "c8"],
  ["c3", "c6", "c9"],
  ["c1", "c5", "c9"],
  ["c3", "c5", "c7"],
];

var GAME_HISTORY = [];

const BLOCKS = {
  select: selectWrapper,
  historyTable: historyTableWrapper,
  timeWrapper,
};

// show/hide helpers blocks
function blockControl({ target, action }) {
  if (action === "hide") {
    BLOCKS[target].classList.add("hide");
  } else if (action === "show") {
    BLOCKS[target].classList.remove("hide");
  }
}

function switchCurrentBage() {
  currentBage = currentBage === CROSS ? ZERO : CROSS;
}

function playerMove() {
  if (message.textContent) return;

  if (this.textContent == "") {
    this.textContent = currentBage;
    const { haveWinner, isDrow } = checkWinnerDiagonales();

    if (!haveWinner && !isDrow) {
      switchCurrentBage();
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
  emptyCells[random].textContent = currentBage;

  const { haveWinner, isDrow } = checkWinnerDiagonales();
  if (!haveWinner || !isDrow) {
    switchCurrentBage();
  }
}

function checkDiagonal(diagonal) {
  const hasSameMarks = diagonal.every((c) => c.textContent === currentBage);
  if (hasSameMarks) {
    message.textContent = `Отримав перемогу ${currentBage}`;
    diagonal.forEach((c) => c.classList.add("green-cell"));
    return true;
  } else {
    return false;
  }
}

function checkWinnerDiagonales() {
  let result = {
    haveWinner: false,
    isDrow: false,
  };

  WIN_CONMBINATIONS.forEach(([c1Id, c2Id, c3Id]) => {
    const diagonal = [
      document.getElementById(c1Id),
      document.getElementById(c2Id),
      document.getElementById(c3Id),
    ];

    const hasWinnerCombo = checkDiagonal(diagonal);
    if (hasWinnerCombo) {
      result.haveWinner = true;
      addRoundToHistoryTable();
    }
  });

  const isDrow =
    cells.every((cell) => cell.textContent) && !message.textContent;

  if (isDrow) {
    result.isDrow = true;
    message.textContent = "Нічия";
    addRoundToHistoryTable("drow");
  }

  return result;
}

function deleteFields() {
  select.value = INITIAL_SELECTED_VALUE;
  cells.forEach(function (cell) {
    cell.textContent = "";
    cell.remove();
    cell.classList.remove("green-cell");
  });

  message.textContent = "";

  blockControl({ target: "select", action: "show" });
  blockControl({ target: "historyTable", action: "hide" });

  const rows = document.querySelectorAll("td");
  rows.forEach((r) => r.remove());
  GAME_HISTORY = [];
}

function clearFields() {
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

function createRoundRow({ roundNumber, roundWinner }) {
  const roundRow = document.createElement("tr");
  roundRow.innerHTML = `<td>${roundNumber}</td><td>${roundWinner}</td>`;
  return roundRow;
}

function addRoundToHistoryTable(drow) {
  if (GAME_HISTORY.length === 0) {
    blockControl({ target: "historyTable", action: "show" });
  }
  const roundNumber = GAME_HISTORY.length + 1;
  const roundWinner = drow ? "Нічия" : currentBage;

  const round = { roundNumber, roundWinner };

  GAME_HISTORY.push(round);
  const roundRow = createRoundRow(round);
  historyTable.appendChild(roundRow);

  let timeToNextRound = RESTART_TIME_MS;

  blockControl({ target: "timeWrapper", action: "show" });
  const timeInterval = setInterval(() => {
    roundsTimeMessage.textContent = `Нова гра почнеться через ${
      timeToNextRound / 1000
    }`;
    timeToNextRound -= 1000;
  }, 1000);

  setTimeout(() => {
    clearInterval(timeInterval);
    clearFields();
    blockControl({ target: "timeWrapper", action: "hide" });
    roundsTimeMessage.textContent = "";

    if (playerBage === ZERO) {
      switchCurrentBage();
      computerMove();
    }
  }, RESTART_TIME_MS + 1000);
}

const selectPlayerBage = (e) => {
  const selectedBage = e.target.value;
  playerBage = selectedBage;

  createFields();
  blockControl({ target: "select", action: "hide" });
  if (selectedBage === CROSS) {
    currentBage = selectedBage;
  } else {
    currentBage = CROSS;
    computerMove();
  }
};

// Listeners
select.addEventListener("change", selectPlayerBage);
resetButton.addEventListener("click", deleteFields);
