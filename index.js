document.addEventListener('DOMContentLoaded', function () {
  const board = document.querySelector(".board");

  let boxSize = document.querySelector("#boxSize").value;
  let numOfRows = Math.floor(window.innerHeight / boxSize);
  let numOfCols = Math.floor(window.innerWidth / boxSize);
  let boardEl = [];

  let isMouseDown = false;
  let isRunning = false;

  let currentBoard = [];
  let flips = new Set();
  let stepInterval = null;

  document.querySelector("#apply").addEventListener("click", function () {
    boxSize = document.querySelector("#boxSize").value;
    numOfRows = Math.floor(window.innerHeight / boxSize);
    numOfCols = Math.floor(window.innerWidth / boxSize);
    board.innerHTML = "";
    initBoard(numOfRows, numOfCols);
  });

  function initBoard(numOfRows, numOfCols) {
    board.innerHTML = "";
    boardEl = [];
    currentBoard = [];
    flips = new Set();
    for (let i = 0; i < numOfRows; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      boardEl.push([]);
      currentBoard.push([]);
      for (let j = 0; j < numOfCols; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute('i', i);
        cell.setAttribute('j', j);
        row.appendChild(cell);
        currentBoard[i].push(false);
        boardEl[i].push(cell);
      }
      board.appendChild(row);
    }
    document.querySelectorAll('.cell').forEach(cell => {
      cell.addEventListener('pointerdown', function (e) {
        isMouseDown = true;
        this.classList.toggle('alive');
        currentBoard[this.getAttribute('i')][this.getAttribute('j')] = !currentBoard[this.getAttribute('i')][this.getAttribute('j')];
        e.preventDefault();
      });
      cell.addEventListener('pointerover', function () {
        if (isMouseDown) {
          this.classList.toggle('alive');
          currentBoard[this.getAttribute('i')][this.getAttribute('j')] = !currentBoard[this.getAttribute('i')][this.getAttribute('j')];
        }
      });
    });
    board.onmousedown = function (e) { e.preventDefault(); };
  }

  document.addEventListener('pointerup', function () {
    isMouseDown = false;
  });
  document.addEventListener('pointerleave', function () {
    isMouseDown = false;
  });

  initBoard(numOfRows, numOfCols);

  document.querySelector('#clear').addEventListener('click', function () {
    isRunning = false;
    clearInterval(stepInterval);
    initBoard(numOfRows, numOfCols);
  });

  document.querySelector('#start').addEventListener('click', function () {
    isRunning = true;
    let period = document.querySelector("#period").value;
    stepInterval = setInterval(step, period);
  });

  document.querySelector('#stop').addEventListener('click', function () {
    isRunning = false;
    clearInterval(stepInterval);
  });

  document.querySelector('#next').addEventListener('click', function () {
    clearInterval(stepInterval);
    isRunning = true;
    step();
    isRunning = false;
  });

  function step() {
    if (!isRunning) return;
    flips.clear();

    for (let i = 0; i < numOfRows; i++) {
      for (let j = 0; j < numOfCols; j++) {
        const cell = currentBoard[i][j];
        const aliveNeighbors = countAliveNeighbors(i, j);
        if (cell) {
          // Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
          if (aliveNeighbors < 2) {
            flips.add(`${i},${j}`);
          }
          // Any live cell with more than three live neighbours dies, as if by overpopulation.
          if (aliveNeighbors > 3) {
            flips.add(`${i},${j}`);
          }
        } else {
          // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          if (aliveNeighbors === 3) {
            flips.add(`${i},${j}`);
          }
        }
        // Any live cell with two or three live neighbours lives on to the next generation.
      }
    }

    for (let flip of flips) {
      const [i, j] = flip.split(',').map(Number);
      currentBoard[i][j] = !currentBoard[i][j];
      boardEl[i][j].classList.toggle('alive');
    }
  }

  function countAliveNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const nI = row + i, nJ = col + j;
        if (nI < 0 || nJ < 0 || nI >= numOfRows || nJ >= numOfCols || (nI == row && nJ == col)) continue;
        if (currentBoard[nI][nJ] === true) count++;
      }
    }
    return count;
  }
});
