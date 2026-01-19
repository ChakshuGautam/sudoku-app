export default function handler(req, res) {
  res.json({
    name: 'Sudoku API',
    version: '2.0.0',
    endpoints: {
      'GET /api': 'API information',
      'GET /api/health': 'Health check',
      'GET /api/sudoku': 'Generate a new Sudoku puzzle',
      'GET /api/sudoku?difficulty=easy|medium|hard': 'Generate puzzle with specific difficulty',
      'POST /api/sudoku/validate': 'Validate a Sudoku solution'
    }
  });
}
