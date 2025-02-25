import Button from '../../Atoms/Button/Button';
import { PollOption as PollOptionType } from '../../../types/poll';

interface PollOptionProps {
  option: PollOptionType;
  totalVotes: number;
  showResult: boolean;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export function PollOption({ 
  option, 
  totalVotes, 
  showResult, 
  isSelected, 
  onSelect 
}: PollOptionProps) {
  const percentage = totalVotes > 0 
    ? `${((option.votes / totalVotes) * 100).toFixed(0)}%` 
    : '0%';

  return (
    <Button
      type="button"
      result={showResult ? percentage : undefined}
      showResult={showResult}
      isSelected={isSelected}
      onSelect={() => onSelect(option.id)}
    >
      {option.option_text}
    </Button>
  );
} 