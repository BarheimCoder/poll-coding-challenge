import { PollOption } from '../../Molecules/PollOption/PollOption.tsx';
import Button from '../../Atoms/Button/Button';
import { Poll } from '../../../types/poll';
import { Spinner } from '../../Atoms/Spinner';
interface PollContainerProps {
  poll: Poll;
  selectedOption: number | null;
  showResult: boolean;
  onOptionSelect: (id: number) => void;
  onVote: () => void;
  isVoting: boolean;
}

export function PollContainer({ 
  poll, 
  selectedOption, 
  showResult, 
  onOptionSelect, 
  onVote, 
  isVoting 
}: PollContainerProps) {
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="container text-center py-8 px-4 rounded-lg bg-white/20 md:w-1/3 shadow-lg">
      <h1 className="text-4xl mb-12">{poll.question}</h1>
      <div className="flex flex-col gap-4 my-4">
        {poll.options.map((option) => (
          <PollOption
            key={option.id}
            option={option}
            totalVotes={totalVotes}
            showResult={showResult}
            isSelected={selectedOption === option.id}
            onSelect={onOptionSelect}
          />
        ))}
        <Button 
          type="submit" 
          onClick={onVote}
          disabled={(!selectedOption && !showResult) || isVoting}
        >
          {isVoting && <Spinner />}
          {isVoting ? <span className="animate-pulse">Voting...</span> : (!showResult ? 'Vote' : 'Vote again')}
        </Button>
      </div>
    </div>
  );
}