export type Board = (number | null)[][];

export function generateSudoku(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): {
  puzzle: Board;
  solution: Board;
} {
  const solution = generateSolvedBoard();
  const puzzle = createPuzzle(solution, difficulty);
  return { puzzle, solution };
}

function generateSolvedBoard(): Board {
  const board: Board = Array(9).fill(null).map(() => Array(9).fill(null));
  fillBoard(board);
  return board;
}

function fillBoard(board: Board): boolean {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true;

  const [row, col] = emptyCell;
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const num of numbers) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num;
      if (fillBoard(board)) return true;
      board[row][col] = null;
    }
  }
  return false;
}

function findEmptyCell(board: Board): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) return [row, col];
    }
  }
  return null;
}

export function isValidPlacement(
  board: Board,
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }

  return true;
}

function createPuzzle(solution: Board, difficulty: 'easy' | 'medium' | 'hard'): Board {
  const puzzle: Board = solution.map(row => [...row]);
  const cellsToRemove = difficulty === 'easy' ? 35 : difficulty === 'medium' ? 45 : 55;

  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number])
  );

  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = null;
  }

  return puzzle;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function checkWin(board: Board, solution: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== solution[row][col]) return false;
    }
  }
  return true;
}

export function deepCopyBoard(board: Board): Board {
  return board.map(row => [...row]);
}
