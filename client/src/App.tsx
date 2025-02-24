import { useState, useEffect } from 'react';
import { PollContainer } from './components/Organisms/PollContainer/PollContainer';
import { pollService } from './services/api';
import { Poll } from './types/poll';

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
      setShowResult(false);
      setSelectedOption(null);
      return;
    }

    if (!poll || !selectedOption) return;

    try {
      await pollService.vote(poll.id, selectedOption);
      setShowResult(true);
      loadActivePoll();
    } catch (err) {
      setError('Failed to submit vote');
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!poll) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center h-screen">
      <PollContainer
        poll={poll}
        selectedOption={selectedOption}
        showResult={showResult}
        onOptionSelect={setSelectedOption}
        onVote={handleVoteClick}
      />
    </div>
  );
}

export default App;
