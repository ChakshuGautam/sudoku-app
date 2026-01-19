/**
 * Sudoku Generator Module
 * Generates valid Sudoku puzzles with Easy, Medium, and Hard difficulty levels
 */

class SudokuGenerator {
  constructor() {
    this.size = 9;
    this.boxSize = 3;
  }

  /**
   * Generate a complete valid Sudoku solution
   */
  generateSolution() {
    const board = Array(9).fill(null).map(() => Array(9).fill(0));
    this.fillBoard(board);
    return board;
  }

  /**
   * Fill the board using backtracking
   */
  fillBoard(board) {
    const emptyCell = this.findEmptyCell(board);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of numbers) {
      if (this.isValidPlacement(board, row, col, num)) {
        board[row][col] = num;
        if (this.fillBoard(board)) return true;
        board[row][col] = 0;
      }
    }
    return false;
  }

  /**
   * Find an empty cell (value 0)
   */
  findEmptyCell(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) return [row, col];
      }
    }
    return null;
  }

  /**
   * Check if placing a number is valid
   */
  isValidPlacement(board, row, col, num) {
    // Check row
    if (board[row].includes(num)) return false;

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

  /**
   * Shuffle an array (Fisher-Yates)
   */
  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Count the number of solutions for a puzzle
   */
  countSolutions(board, limit = 2) {
    const copy = board.map(row => [...row]);
    let count = 0;

    const solve = () => {
      if (count >= limit) return;

      const emptyCell = this.findEmptyCell(copy);
      if (!emptyCell) {
        count++;
        return;
      }

      const [row, col] = emptyCell;
      for (let num = 1; num <= 9; num++) {
        if (this.isValidPlacement(copy, row, col, num)) {
          copy[row][col] = num;
          solve();
          copy[row][col] = 0;
        }
      }
    };

    solve();
    return count;
  }

  /**
   * Remove cells from a complete solution to create a puzzle
   */
  createPuzzle(solution, cellsToRemove) {
    const puzzle = solution.map(row => [...row]);
    const positions = [];

    // Get all positions
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        positions.push([row, col]);
      }
    }

    // Shuffle positions
    const shuffled = this.shuffleArray(positions);
    let removed = 0;

    for (const [row, col] of shuffled) {
      if (removed >= cellsToRemove) break;

      const backup = puzzle[row][col];
      puzzle[row][col] = 0;

      // Ensure unique solution
      if (this.countSolutions(puzzle) === 1) {
        removed++;
      } else {
        puzzle[row][col] = backup;
      }
    }

    return puzzle;
  }

  /**
   * Generate a Sudoku puzzle with specified difficulty
   * @param {string} difficulty - 'easy', 'medium', or 'hard'
   */
  generate(difficulty = 'medium') {
    const cellsToRemove = {
      easy: 35,    // ~46 given cells
      medium: 45,  // ~36 given cells
      hard: 55     // ~26 given cells
    };

    const removeCount = cellsToRemove[difficulty] || cellsToRemove.medium;
    const solution = this.generateSolution();
    const puzzle = this.createPuzzle(solution, removeCount);

    return {
      puzzle: puzzle,
      solution: solution,
      difficulty: difficulty,
      givenCells: 81 - removeCount
    };
  }

  /**
   * Convert board to string format
   */
  boardToString(board) {
    return board.map(row => row.join('')).join('');
  }

  /**
   * Validate if a board is a valid Sudoku solution
   */
  validateSolution(board) {
    // Check all rows
    for (let row = 0; row < 9; row++) {
      const seen = new Set();
      for (let col = 0; col < 9; col++) {
        const val = board[row][col];
        if (val < 1 || val > 9 || seen.has(val)) return false;
        seen.add(val);
      }
    }

    // Check all columns
    for (let col = 0; col < 9; col++) {
      const seen = new Set();
      for (let row = 0; row < 9; row++) {
        const val = board[row][col];
        if (seen.has(val)) return false;
        seen.add(val);
      }
    }

    // Check all 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set();
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const val = board[boxRow * 3 + r][boxCol * 3 + c];
            if (seen.has(val)) return false;
            seen.add(val);
          }
        }
      }
    }

    return true;
  }
}

module.exports = new SudokuGenerator();
