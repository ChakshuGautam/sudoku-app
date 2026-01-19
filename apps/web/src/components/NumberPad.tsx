import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-react';

interface NumberPadProps {
  onNumberClick: (num: number | null) => void;
  disabled: boolean;
}

export function NumberPad({ onNumberClick, disabled }: NumberPadProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-xs sm:max-w-md mt-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <Button
          key={num}
          variant="outline"
          size="lg"
          className="w-12 h-12 sm:w-14 sm:h-14 text-xl font-bold"
          onClick={() => onNumberClick(num)}
          disabled={disabled}
        >
          {num}
        </Button>
      ))}
      <Button
        variant="destructive"
        size="lg"
        className="w-12 h-12 sm:w-14 sm:h-14"
        onClick={() => onNumberClick(null)}
        disabled={disabled}
      >
        <Eraser className="w-5 h-5" />
      </Button>
    </div>
  );
}
