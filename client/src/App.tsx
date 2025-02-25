import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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
  const [noPollExists, setNoPollExists] = useState(false);

  useEffect(() => {
    loadActivePoll();
  }, []);

  const loadActivePoll = async () => {
    setIsLoading(true);
    try {
      const activePoll = await pollService.getActivePoll();
      if (!activePoll) {
        setNoPollExists(true);
        setPoll(null);
      } else {
        setPoll(activePoll);
        setNoPollExists(false);
      }
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
      setTimeout(() => loadActivePoll(), 0);
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
      setTimeout(() => loadActivePoll(), 0);
      return true;
    } catch (err) {
      console.error('Create poll error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create poll');
      }
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActive = async (pollId: number) => {
    setIsToggling(true);
    try {
      const message = await pollService.toggleActive(pollId);
      setTimeout(() => loadActivePoll(), 0);
      return message;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Failed to toggle poll status');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeletePoll = async (pollId: number) => {
    setIsDeleting(true);
    try {
      const message = await pollService.deletePoll(pollId);
      setTimeout(() => loadActivePoll(), 0);
      return message;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Failed to delete poll');
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

  return (
    <Router>
      <div className="min-h-screen">
        <nav className="bg-white/20 p-4 mb-8 shadow-lg">
          <div className="container mx-auto flex justify-center gap-4">
            <Link to="/" className="text-black transition duration-200 hover:opacity-70">Vote</Link>
            <Link to="/admin" className="text-black transition duration-200 hover:opacity-70">Admin</Link>
          </div>
        </nav>

        {isLoading ? (
          <div className="flex justify-center items-center h-screen text-black">
            <div className="flex justify-center items-center gap-4 bg-white/30 backdrop:blur-sm p-4 rounded-lg animate-pulse">
              <Spinner />Loading...
            </div>
          </div>
        ) : (
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
              noPollExists ? (
                <Navigate to="/admin" replace />
              ) : poll ? (
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
              ) : (
                <div className="flex justify-center items-center h-screen">
                  <div className="bg-white/30 p-6 rounded-lg text-center">
                    <p className="text-lg mb-4">No active poll found</p>
                    <Link to="/admin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Go to Admin
                    </Link>
                  </div>
                </div>
              )
            } />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
