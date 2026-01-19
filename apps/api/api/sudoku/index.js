import { sudoku } from './generator.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const difficulty = req.query.difficulty || 'medium';
    const validDifficulties = ['easy', 'medium', 'hard'];

    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        error: 'Invalid difficulty',
        message: 'Difficulty must be one of: easy, medium, hard'
      });
    }

    const result = sudoku.generate(difficulty.toLowerCase());

    res.json({
      success: true,
      data: {
        puzzle: result.puzzle,
        solution: result.solution,
        difficulty: result.difficulty,
        givenCells: result.givenCells,
        puzzleString: sudoku.boardToString(result.puzzle),
        solutionString: sudoku.boardToString(result.solution)
      }
    });
  } catch (error) {
    console.error('Error generating Sudoku:', error);
    res.status(500).json({
      error: 'Generation failed',
      message: 'Failed to generate Sudoku puzzle'
    });
  }
}
