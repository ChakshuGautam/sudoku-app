import type { Board } from '../utils/sudoku';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.sudoku.theflywheel.in';

type Difficulty = 'easy' | 'medium' | 'hard';

interface ApiPuzzleResponse {
  success: boolean;
  data: {
    puzzle: number[][];
    solution: number[][];
    difficulty: string;
    givenCells: number;
    puzzleString: string;
    solutionString: string;
  };
}

interface ApiValidateResponse {
  success: boolean;
  data: {
    isValid: boolean;
    isComplete: boolean;
    errors?: { row: number; col: number; message: string }[];
  };
}

// Convert API format (0 for empty) to app format (null for empty)
function convertApiBoard(apiBoard: number[][]): Board {
  return apiBoard.map(row =>
    row.map(cell => cell === 0 ? null : cell)
  );
}

export async function fetchSudokuPuzzle(difficulty: Difficulty): Promise<{
  puzzle: Board;
  solution: Board;
}> {
  const response = await fetch(`${API_BASE_URL}/sudoku?difficulty=${difficulty}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch puzzle: ${response.statusText}`);
  }

  const data: ApiPuzzleResponse = await response.json();

  if (!data.success) {
    throw new Error('API returned unsuccessful response');
  }

  return {
    puzzle: convertApiBoard(data.data.puzzle),
    solution: convertApiBoard(data.data.solution),
  };
}

export async function validateSudokuBoard(board: Board): Promise<{
  isValid: boolean;
  isComplete: boolean;
  errors?: { row: number; col: number; message: string }[];
}> {
  // Convert null back to 0 for API
  const apiBoard = board.map(row =>
    row.map(cell => cell === null ? 0 : cell)
  );

  const response = await fetch(`${API_BASE_URL}/sudoku/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ board: apiBoard }),
  });

  if (!response.ok) {
    throw new Error(`Failed to validate: ${response.statusText}`);
  }

  const data: ApiValidateResponse = await response.json();

  if (!data.success) {
    throw new Error('API returned unsuccessful response');
  }

  return data.data;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
