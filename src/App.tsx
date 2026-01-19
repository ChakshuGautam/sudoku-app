import { useState, useCallback, useEffect } from 'react';
import { SudokuBoard } from './components/SudokuBoard';
import { NumberPad } from './components/NumberPad';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Board } from './utils/sudoku';
import {
  checkWin,
  deepCopyBoard,
  isValidPlacement,
} from './utils/sudoku';
import { fetchSudokuPuzzle } from './services/sudokuApi';
import { Timer, Trophy, RefreshCw, Loader2 } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [board, setBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [solution, setSolution] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewGame = useCallback(async (diff: Difficulty) => {
    setIsLoading(true);
    setError(null);
    setIsRunning(false);

    try {
      const { puzzle, solution: sol } = await fetchSudokuPuzzle(diff);
      setBoard(deepCopyBoard(puzzle));
      setInitialBoard(puzzle);
      setSolution(sol);
      setSelectedCell(null);
      setErrors(new Set());
      setWon(false);
      setTimer(0);
      setIsRunning(true);
    } catch (err) {
      setError('Failed to load puzzle. Please try again.');
      console.error('Error fetching puzzle:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    startNewGame(difficulty);
  }, []);

  useEffect(() => {
    let interval: number;
    if (isRunning && !won) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, won]);

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row][col] === null) {
      setSelectedCell([row, col]);
    }
  };

  const handleNumberClick = useCallback((num: number | null) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;

    setBoard(prevBoard => {
      const newBoard = deepCopyBoard(prevBoard);
      newBoard[row][col] = num;

      const newErrors = new Set<string>();
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const val = newBoard[r][c];
          if (val !== null) {
            const temp = newBoard[r][c];
            newBoard[r][c] = null;
            if (!isValidPlacement(newBoard, r, c, val)) {
              newErrors.add(`${r}-${c}`);
            }
            newBoard[r][c] = temp;
          }
        }
      }
      setErrors(newErrors);

      if (newErrors.size === 0 && checkWin(newBoard, solution)) {
        setWon(true);
        setIsRunning(false);
      }

      return newBoard;
    });
  }, [selectedCell, solution]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedCell) return;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberClick(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        handleNumberClick(null);
      } else if (e.key === 'ArrowUp' && selectedCell[0] > 0) {
        setSelectedCell([selectedCell[0] - 1, selectedCell[1]]);
      } else if (e.key === 'ArrowDown' && selectedCell[0] < 8) {
        setSelectedCell([selectedCell[0] + 1, selectedCell[1]]);
      } else if (e.key === 'ArrowLeft' && selectedCell[1] > 0) {
        setSelectedCell([selectedCell[0], selectedCell[1] - 1]);
      } else if (e.key === 'ArrowRight' && selectedCell[1] < 8) {
        setSelectedCell([selectedCell[0], selectedCell[1] + 1]);
      }
    },
    [selectedCell, handleNumberClick]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    startNewGame(diff);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-4 sm:p-8">
      <div className="max-w-lg mx-auto">
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Sudoku
            </CardTitle>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleDifficultyChange(diff)}
                  className="capitalize"
                  disabled={isLoading}
                >
                  {diff}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Timer className="w-5 h-5 text-muted-foreground" />
              <Badge variant="secondary" className="text-lg font-mono px-3 py-1">
                {formatTime(timer)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4">
            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {won && (
              <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg animate-pulse">
                <Trophy className="w-6 h-6" />
                <span className="font-semibold">
                  Congratulations! Solved in {formatTime(timer)}!
                </span>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center w-full h-[360px] sm:h-[432px]">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : board.length > 0 && (
              <SudokuBoard
                board={board}
                initialBoard={initialBoard}
                selectedCell={selectedCell}
                onCellClick={handleCellClick}
                errors={errors}
              />
            )}

            <NumberPad onNumberClick={handleNumberClick} disabled={!selectedCell || won || isLoading} />

            <Button
              onClick={() => startNewGame(difficulty)}
              className="mt-4 gap-2"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isLoading ? 'Loading...' : 'New Game'}
            </Button>

            <p className="text-sm text-muted-foreground text-center mt-2">
              Click a cell and use the number pad or keyboard (1-9) to fill in numbers.
              <br />
              Use arrow keys to navigate. Press Backspace to clear.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
