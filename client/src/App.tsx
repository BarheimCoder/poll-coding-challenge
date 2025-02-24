import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PollContainer } from './components/Organisms/PollContainer/PollContainer';
import { pollService } from './services/api';
import { Poll } from './types/poll';
import { Spinner } from './components/Atoms/Spinner';
import { Admin } from './pages/Admin';

function App() {
  const [showResult, setShowResult] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVoting, setIsVoting] = useState<boolean>(false);

  useEffect(() => {
    loadActivePoll();
  }, []);

  const loadActivePoll = async () => {
    setIsLoading(true);
    try {
      const activePoll = await pollService.getActivePoll();
      setPoll(activePoll);
    } catch (err) {
      setError('Failed to load poll');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteClick = async () => {
    if (showResult) {
      setShowResult(false);
      setSelectedOption(null);
      return;
    }

    if (!poll || !selectedOption) return;

    setIsVoting(true);
    try {
      await pollService.vote(poll.id, selectedOption);
      setShowResult(true);
      await loadActivePoll();
    } catch (err) {
      setError('Failed to submit vote');
    } finally {
      setIsVoting(false);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!poll) return (
    <div className="flex justify-center items-center h-screen text-black">
      <div className="flex justify-center items-center gap-4 bg-white/30 backdrop:blur-sm p-4 rounded-lg animate-pulse">
      <Spinner />Loading...
    </div>
  </div>);

  return (
    <Router>
      <div className="min-h-screen">
        <nav className="bg-white/20 p-4 mb-8">
          <div className="container mx-auto flex justify-center gap-4">
            <Link to="/" className="text-black transition duration-200 hover:opacity-70">Vote</Link>
            <Link to="/admin" className="text-black transition duration-200 hover:opacity-70">Admin</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/admin" element={
            <div className="flex justify-center items-center">
              <Admin />
            </div>
          } />
          <Route path="/" element={
            <div className="flex justify-center items-center">
              <PollContainer
                poll={poll}
                selectedOption={selectedOption}
                showResult={showResult}
                onOptionSelect={setSelectedOption}
                onVote={handleVoteClick}
                isVoting={isVoting}
              />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
