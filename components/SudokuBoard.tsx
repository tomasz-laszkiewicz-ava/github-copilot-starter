import React, { useEffect, useState } from 'react';

const SIZE = 9;
const EMPTY = 0;

function deepCopy(arr: number[][]): number[][] {
  return arr.map(row => row.slice());
}

function createEmptyBoard(): number[][] {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
}

function isSafe(board: number[][], row: number, col: number, num: number): boolean {
  for (let x = 0; x < SIZE; x++) {
    if (board[row][x] === num || board[x][col] === num) return false;
  }
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
}

function shuffleArray(arr: number[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function fillBoard(board: number[][]): boolean {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === EMPTY) {
        const possible = Array.from({ length: SIZE }, (_, i) => i + 1);
        shuffleArray(possible);
        for (let n = 0; n < possible.length; n++) {
          const candidate = possible[n];
          if (isSafe(board, row, col, candidate)) {
            board[row][col] = candidate;
            if (fillBoard(board)) return true;
            board[row][col] = EMPTY;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function removeCells(board: number[][], clues: number): void {
  let attempts = SIZE * SIZE - clues;
  while (attempts > 0) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);
    if (board[row][col] !== EMPTY) {
      board[row][col] = EMPTY;
      attempts--;
    }
  }
}

function isRemovableCell(_solved: number[][], _row: number, _col: number): boolean {
  // In this refactor we don't track removed cells explicitly; treat all non-empty in solved as prefilled
  return false;
}

export default function SudokuBoard() {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard());
  const [solution, setSolution] = useState<number[][]>(createEmptyBoard());
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    newGame();
  }, []);

  function newGame() {
    const clues = 35;
    const newBoard = createEmptyBoard();
    fillBoard(newBoard);
    const solved = deepCopy(newBoard);
    removeCells(newBoard, clues);
    setSolution(solved);
    setBoard(deepCopy(newBoard));
    setMessage('');
  }

  function handleInput(r: number, c: number, val: string) {
    const v = val.replace(/[^1-9]/g, '');
    const copy = deepCopy(board);
    copy[r][c] = v ? parseInt(v, 10) : EMPTY;
    setBoard(copy);
  }

  function checkSolution() {
    let correct = true;
    const copy = deepCopy(board);
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (copy[i][j] !== solution[i][j]) {
          correct = false;
        }
      }
    }
    if (correct) {
      setMessage('Congratulations! You solved it!');
    } else {
      setMessage('Some cells are incorrect.');
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Sudoku</h2>
      <div className="grid gap-1" style={{ gridTemplateRows: `repeat(${SIZE}, auto)` }}>
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => {
              const prefilled = solution[i][j] === cell && cell !== EMPTY && !isRemovableCell(solution, i, j);
              return (
                <input
                  key={j}
                  value={cell === EMPTY ? '' : cell}
                  onChange={(e) => handleInput(i, j, e.target.value)}
                  className={`sudoku-cell m-0 ${prefilled ? 'prefilled' : ''}`}
                  maxLength={1}
                  disabled={prefilled}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={newGame}>New Game</button>
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={checkSolution}>Check Solution</button>
        <span className="ml-3 text-sm text-gray-700">{message}</span>
      </div>
    </div>
  );
}
