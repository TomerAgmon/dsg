import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

const GRID_ROWS = 3;
const GRID_COLS = 3;

function App() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [backup, setBackup] = useState<number[][]>([]);
  const [emptyCellPos, setEmptyCellPos] = useState([
    GRID_COLS - 1,
    GRID_ROWS - 1,
  ]);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    shuffleGrid();
  }, []);

  useEffect(() => {
    if (getIsGameOver(grid)) {
      setIsGameOver(true);
    }
  }, [grid]);

  const onCellClick = (cell: number, pos: number[]) => {
    if (isGameOver) {
      return;
    }

    if (!getIsClickPosValid(pos, emptyCellPos)) {
      alert("Please click an adjecent cell to the empty cell");
      return;
    }

    setGrid((oldGrid) =>
      oldGrid.map((line, i) =>
        line.map((oldCell, j) => {
          if (i === pos[0] && j === pos[1]) {
            return -1;
          }

          if (i === emptyCellPos[0] && j === emptyCellPos[1]) {
            return cell;
          }

          return oldCell;
        })
      )
    );

    setEmptyCellPos(pos);
  };

  const onShuffleClick = () => {
    setIsGameOver(false);
    shuffleGrid();
  };

  const onResetClick = () => {
    setIsGameOver(false);

    setGrid(backup);

    setEmptyCellPos([GRID_COLS - 1, GRID_ROWS - 1]);
  };

  const shuffleGrid = () => {
    const { grid, backup } = getNumbersGrid(GRID_ROWS, GRID_COLS);

    setGrid(grid);
    setBackup(backup);

    setEmptyCellPos([GRID_COLS - 1, GRID_ROWS - 1]);
  };

  return (
    <div className="App">
      <div className="Grid">
        {grid.map((line, i) => (
          <div className="Line" key={`line-${i}`}>
            {line.map((cell, j) => (
              <span
                key={cell}
                className="Cell"
                onClick={() => onCellClick(cell, [i, j])}
              >
                {cell !== -1 ? cell : null}
              </span>
            ))}
          </div>
        ))}
      </div>
      <button onClick={onResetClick}>Reset</button>
      <button onClick={onShuffleClick}>Shuffle</button>
      {isGameOver ? "You won! click reset to play again" : null}
    </div>
  );
}

export default App;

function getNumbersGrid(rows: number, cols: number) {
  const grid = Array.from({ length: rows }, (e) =>
    Array.from({ length: cols }, (e) => -1)
  );

  const backup = Array.from({ length: rows }, (e) =>
    Array.from({ length: cols }, (e) => -1)
  );

  let numbersToFill = Array.from(
    { length: cols * rows - 1 },
    (item, index) => index + 1
  );

  // Shuffeling
  for (let i = numbersToFill.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = numbersToFill[i];
    numbersToFill[i] = numbersToFill[j];
    numbersToFill[j] = temp;
  }

  let counter = 0;

  // Filling the grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols && counter < numbersToFill.length; j++) {
      grid[i][j] = numbersToFill[counter];
      backup[i][j] = numbersToFill[counter];
      counter++;
    }
  }

  return { grid, backup };
}

// A click position is valid if its adjecent to the empty cell position
function getIsClickPosValid(clickPos: number[], emptyCellPos: number[]) {
  if (clickPos[0] === emptyCellPos[0] && clickPos[1] === emptyCellPos[1]) {
    return false;
  }

  if (
    Math.abs(clickPos[0] - emptyCellPos[0]) > 1 ||
    Math.abs(clickPos[1] - emptyCellPos[1]) > 1 ||
    (clickPos[0] !== emptyCellPos[0] && clickPos[1] !== emptyCellPos[1])
  ) {
    return false;
  }

  return true;
}

function getIsGameOver(grid: number[][]) {
  if (grid.length === 0) {
    return false;
  }

  let counter = 1;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length - 1; j++) {
      if (grid[i][j] !== counter) {
        return false;
      }
      counter++;
    }
    counter++;
  }

  return true;
}
