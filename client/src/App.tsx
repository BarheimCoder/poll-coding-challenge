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
  const [isCreating, setIsCreating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingVotes, setIsLoadingVotes] = useState(false);

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

  const handleCreatePoll = async (question: string, options: string[]) => {
    setIsCreating(true);
    try {
      await pollService.createPoll({ question, options });
      await loadActivePoll();
      return true; // Return success status to Admin component
    } catch (err) {
      setError('Failed to create poll');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActive = async (pollId: number) => {
    setIsToggling(true);
    try {
      await pollService.toggleActive(pollId);
      await loadActivePoll();
      return true;
    } catch (err) {
      setError('Failed to toggle poll status');
      return false;
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeletePoll = async (pollId: number) => {
    setIsDeleting(true);
    try {
      await pollService.deletePoll(pollId);
      await loadActivePoll();
      return true;
    } catch (err) {
      setError('Failed to delete poll');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewVotes = async (pollId: number) => {
    setIsLoadingVotes(true);
    try {
      const votes = await pollService.getVoteDetails(pollId);
      return votes;
    } catch (err) {
      if (err instanceof Error) {
        throw err; // Pass the error through to Admin component
      }
      setError('Failed to load vote details');
      throw new Error('Failed to load vote details');
    } finally {
      setIsLoadingVotes(false);
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
        <nav className="bg-white/20 p-4 mb-8 shadow-lg">
          <div className="container mx-auto flex justify-center gap-4">
            <Link to="/" className="text-black transition duration-200 hover:opacity-70">Vote</Link>
            <Link to="/admin" className="text-black transition duration-200 hover:opacity-70">Admin</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/admin" element={
            <div className="flex justify-center items-center">
              <Admin 
                onCreatePoll={handleCreatePoll}
                onToggleActive={handleToggleActive}
                onDeletePoll={handleDeletePoll}
                isCreating={isCreating}
                isToggling={isToggling}
                isDeleting={isDeleting}
                isLoadingVotes={isLoadingVotes}
                onViewVotes={handleViewVotes}
                error={error}
              />
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
