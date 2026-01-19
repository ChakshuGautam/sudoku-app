const express = require('express');
const cors = require('cors');
const sudoku = require('./sudoku');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API info endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Sudoku API',
    version: '1.0.0',
    endpoints: {
      'GET /': 'API information',
      'GET /health': 'Health check',
      'GET /sudoku': 'Generate a new Sudoku puzzle',
      'GET /sudoku?difficulty=easy|medium|hard': 'Generate puzzle with specific difficulty',
      'POST /sudoku/validate': 'Validate a Sudoku solution'
    }
  });
});

// Generate a new Sudoku puzzle
app.get('/sudoku', (req, res) => {
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
});

// Validate a Sudoku solution
app.post('/sudoku/validate', (req, res) => {
  try {
    const { board } = req.body;

    if (!board || !Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Board must be a 9x9 array of numbers'
      });
    }

    // Validate board structure
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
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Endpoint ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sudoku API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
