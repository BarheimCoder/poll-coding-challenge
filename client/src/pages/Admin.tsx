import Button from '../components/Atoms/Button/Button';
import { Input } from '../components/Atoms/Input/Input';
import { useState } from 'react';
import AdminContainer from '../components/Organisms/PollContainer/AdminContainer';

interface Vote {
  option_text: string;
  voted_at: string;
  total_votes: number;
}

interface AdminProps {
  onCreatePoll: (question: string, options: string[]) => Promise<boolean>;
  onToggleActive: (pollId: number) => Promise<boolean>;
  onDeletePoll: (pollId: number) => Promise<boolean>;
  onViewVotes: (pollId: number) => Promise<Vote[]>;
  isCreating: boolean;
  isToggling: boolean;
  isDeleting: boolean;
  isLoadingVotes: boolean;
  error: string | null;
}

export function Admin({ 
  onCreatePoll, 
  onToggleActive, 
  onDeletePoll,
  onViewVotes,
  isCreating,
  isToggling,
  isDeleting,
  isLoadingVotes,
  error 
}: AdminProps) {
  const [question, setQuestion] = useState('');
  const [optionsString, setOptionsString] = useState('');
  const [togglePollId, setTogglePollId] = useState('');
  const [deletePollId, setDeletePollId] = useState('');
  const [viewVotesId, setViewVotesId] = useState('');
  const [votes, setVotes] = useState<Vote[]>([]);
  const [showVotes, setShowVotes] = useState(false);
  const [errorState, setError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [toggleMessage, setToggleMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [createMessage, setCreateMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    const options = optionsString
      .split('\n')
      .map(opt => opt.trim())
      .filter(opt => opt);

    if (options.length < 2) {
      setCreateMessage({ text: 'Please provide at least 2 options', type: 'error' });
      return;
    }

    try {
      await onCreatePoll(question, options);
      setCreateMessage({ text: 'Poll created successfully', type: 'success' });
      setQuestion('');
      setOptionsString('');
    } catch (err) {
      if (err instanceof Error) {
        setCreateMessage({ text: err.message, type: 'error' });
      } else {
        setCreateMessage({ text: 'Failed to create poll', type: 'error' });
      }
    }
  };

  const handleToggleActive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!togglePollId) return;

    try {
      await onToggleActive(Number(togglePollId));
      setToggleMessage({ text: 'Poll status updated successfully', type: 'success' });
      setTogglePollId('');
    } catch (err) {
      if (err instanceof Error) {
        setToggleMessage({ text: err.message, type: 'error' });
      } else {
        setToggleMessage({ text: 'Failed to toggle poll status', type: 'error' });
      }
    }
  };

  const handleDeletePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePollId) return;

    try {
      await onDeletePoll(Number(deletePollId));
      setDeleteMessage({ text: 'Poll deleted successfully', type: 'success' });
      setDeletePollId('');
    } catch (err) {
      if (err instanceof Error) {
        setDeleteMessage({ text: err.message, type: 'error' });
      } else {
        setDeleteMessage({ text: 'Failed to delete poll', type: 'error' });
      }
    }
  };

  const handleViewVotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewVotesId) return;

    setModalError(null);
    try {
      const voteDetails = await onViewVotes(Number(viewVotesId));
      setVotes(voteDetails);
      setShowVotes(true);
    } catch (err) {
      if (err instanceof Error) {
        setModalError(err.message);
      } else {
        setModalError('Failed to load vote details');
      }
      setShowVotes(true); // Still show modal but with error
      setVotes([]);
    }
  };
  
  return (
    <div className="container text-center flex gap-4 justify-between flex-wrap y-8 p-4 rounded-lg bg-white/20">
      <h1 className="text-4xl mb-12 w-full">Admin Panel</h1>

      <AdminContainer title="Delete Poll" onSubmit={handleDeletePoll}>
        <Input 
          label="Poll ID to delete" 
          type="number" 
          id="pollId" 
          placeholder="Poll ID"
          value={deletePollId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeletePollId(e.target.value)}
          required
        />
        {deleteMessage && (
          <p className={`text-sm ${deleteMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {deleteMessage.text}
          </p>
        )}
        <Button type="submit" disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete Poll'}
        </Button>
      </AdminContainer>

      <AdminContainer title="Create Poll" onSubmit={handleCreatePoll}>
        <Input
          label="Question"
          type="text"
          id="question"
          placeholder="What is your favorite color?"
          value={question}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
          required
        />
        <Input
          label="Options (one per line)"
          type="textarea"
          id="options"
          placeholder="Red&#10;Blue&#10;Green"
          value={optionsString}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOptionsString(e.target.value)}
          rows={4}
          required
        />
        {createMessage && (
          <p className={`text-sm ${createMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {createMessage.text}
          </p>
        )}
        <Button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create Poll'}
        </Button>
      </AdminContainer>

      <AdminContainer title="View Vote Details" onSubmit={handleViewVotes}>
        <Input 
          label="Poll ID to view vote details" 
          type="number" 
          id="viewVotesId" 
          placeholder="Poll ID"
          value={viewVotesId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setViewVotesId(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoadingVotes}>
          {isLoadingVotes ? 'Loading...' : 'View Votes'}
        </Button>
      </AdminContainer>

      <AdminContainer title="Toggle active poll" onSubmit={handleToggleActive}>
        <Input 
          label="Poll ID to toggle active status of" 
          type="number" 
          id="pollId" 
          placeholder="Poll ID"
          value={togglePollId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTogglePollId(e.target.value)}
          required
        />
        {toggleMessage && (
          <p className={`text-sm ${toggleMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {toggleMessage.text}
          </p>
        )}
        <Button type="submit" disabled={isToggling}>
          {isToggling ? 'Toggling...' : 'Toggle Active Poll'}
        </Button>
      </AdminContainer>

      {showVotes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl">Vote Details</h2>
              <button 
                onClick={() => {
                  setShowVotes(false);
                  setModalError(null);
                }} 
                className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              >
                ✕
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            
            {modalError ? (
              <div className="text-red-500 text-center py-4">{modalError}</div>
            ) : (
              <div className="space-y-2">
                {votes.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No votes recorded yet</div>
                ) : (
                  votes.map((vote, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{vote.option_text}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(vote.voted_at).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 