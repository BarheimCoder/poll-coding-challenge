import { useState, useEffect } from 'react';
import Button from './components/Atoms/Button/Button';
import { pollService } from './services/api';

interface PollOption {
  id: number;
  option_text: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
}

function App() {
  const [showResult, setShowResult] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivePoll();
  }, []);

  const loadActivePoll = async () => {
    try {
      const activePoll = await pollService.getActivePoll();
      setPoll(activePoll);
    } catch (err) {
      setError('Failed to load poll');
    }
  };

  const handleVoteClick = async () => {
    if (showResult) {
      // Reset the poll
      setShowResult(false);
      setSelectedOption(null);
      return;
    }

    if (!poll || !selectedOption) return;

    try {
      await pollService.vote(poll.id, selectedOption);
      setShowResult(true);
      loadActivePoll(); // Reload poll to get updated votes
    } catch (err) {
      setError('Failed to submit vote');
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!poll) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container text-center py-8 px-4 rounded-lg bg-white/20 md:w-1/3">
        <h1 className="text-4xl mb-12">{poll.question}</h1>
        <div className="flex flex-col gap-4 my-4">
          {poll.options.map((option) => (
            <Button
              key={option.id}
              type="button"
              result={showResult ? `${((option.votes / poll.options.reduce((sum, opt) => sum + opt.votes, 0)) * 100).toFixed(0)}%` : undefined}
              showResult={showResult}
              isSelected={selectedOption === option.id}
              onSelect={() => setSelectedOption(option.id)}
            >
              {option.option_text}
            </Button>
          ))}
          <Button 
            type="submit" 
            onClick={handleVoteClick}
            disabled={!selectedOption && !showResult}
          >
            {!showResult ? 'Vote' : 'Vote again'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
