import { sudoku } from './generator.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { board } = req.body;

    if (!board || !Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Board must be a 9x9 array of numbers'
      });
    }

    for (const row of board) {
      if (!Array.isArray(row) || row.length !== 9) {
        return res.status(400).json({
          error: 'Invalid input',
          message: 'Each row must contain exactly 9 numbers'
        });
      }
    }

    const isValid = sudoku.validateSolution(board);

    res.json({
      success: true,
      data: {
        valid: isValid,
        message: isValid ? 'Valid Sudoku solution!' : 'Invalid Sudoku solution'
      }
    });
  } catch (error) {
    console.error('Error validating Sudoku:', error);
    res.status(500).json({
      error: 'Validation failed',
      message: 'Failed to validate Sudoku solution'
    });
  }
}
