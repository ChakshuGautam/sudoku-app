import type { Board } from '../utils/sudoku';
import { cn } from '@/lib/utils';

interface SudokuBoardProps {
  board: Board;
  initialBoard: Board;
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
  errors: Set<string>;
}

export function SudokuBoard({
  board,
  initialBoard,
  selectedCell,
  onCellClick,
  errors,
}: SudokuBoardProps) {
  const getCellClassName = (row: number, col: number) => {
    const isFixed = initialBoard[row][col] !== null;
    const isSelected = selectedCell && selectedCell[0] === row && selectedCell[1] === col;
    const isHighlighted = selectedCell && (
      selectedCell[0] === row ||
      selectedCell[1] === col ||
      (Math.floor(row / 3) === Math.floor(selectedCell[0] / 3) &&
       Math.floor(col / 3) === Math.floor(selectedCell[1] / 3))
    );
    const hasError = errors.has(`${row}-${col}`);
    const isBorderRight = col % 3 === 2 && col !== 8;
    const isBorderBottom = row % 3 === 2 && row !== 8;

    return cn(
      'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-semibold',
      'border border-border cursor-pointer transition-all duration-150',
      'hover:bg-accent/50',
      isFixed && 'bg-muted text-muted-foreground font-bold',
      !isFixed && 'text-primary',
      isSelected && 'bg-primary/20 ring-2 ring-primary',
      isHighlighted && !isSelected && 'bg-accent',
      hasError && 'bg-destructive/20 text-destructive',
      isBorderRight && 'border-r-2 border-r-foreground/30',
      isBorderBottom && 'border-b-2 border-b-foreground/30'
    );
  };

  return (
    <div className="bg-card rounded-lg shadow-lg p-2 sm:p-4 border-2 border-border">
      <div className="grid grid-cols-9">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(rowIndex, colIndex)}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {cell || ''}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
