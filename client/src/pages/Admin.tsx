import Button from '../components/Atoms/Button/Button';
import { Input } from '../components/Atoms/Input/Input';
import { useState } from 'react';
import AdminContainer from '../components/Organisms/PollContainer/AdminContainer';

interface AdminProps {
  onCreatePoll: (question: string, options: string[]) => Promise<boolean>;
  onToggleActive: (pollId: number) => Promise<boolean>;
  onDeletePoll: (pollId: number) => Promise<boolean>;
  isCreating: boolean;
  isToggling: boolean;
  isDeleting: boolean;
  error: string | null;
}

export function Admin({ 
  onCreatePoll, 
  onToggleActive, 
  onDeletePoll,
  isCreating,
  isToggling,
  isDeleting,
  error 
}: AdminProps) {
  const [question, setQuestion] = useState('');
  const [optionsString, setOptionsString] = useState('');
  const [togglePollId, setTogglePollId] = useState('');
  const [deletePollId, setDeletePollId] = useState('');

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    const options = optionsString.split(',').map(opt => opt.trim()).filter(opt => opt);
    
    if (options.length < 2) {
      return; // Let App component handle the error
    }

    const success = await onCreatePoll(question, options);
    if (success) {
      setQuestion('');
      setOptionsString('');
    }
  };

  const handleToggleActive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!togglePollId) return;

    const success = await onToggleActive(Number(togglePollId));
    if (success) {
      setTogglePollId('');
    }
  };

  const handleDeletePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePollId) return;

    const success = await onDeletePoll(Number(deletePollId));
    if (success) {
      setDeletePollId('');
    }
  };

  const handleViewPollResults = async (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="container text-center flex gap-4 justify-between flex-wrap y-8 p-4 rounded-lg bg-white/20">
      <h1 className="text-4xl mb-12 w-full">Admin Panel</h1>

      {error && <p className="text-red-400 text-sm w-full">{error}</p>}

      <AdminContainer title="Delete Poll" onSubmit={handleDeletePoll}>
        <Input 
          label="Poll ID to delete" 
          type="number" 
          id="pollId" 
          placeholder="Poll ID"
          value={deletePollId}
          onChange={(e) => setDeletePollId(e.target.value)}
          required
        />
        <Button type="submit" disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete Poll'}
        </Button>
      </AdminContainer>

      <AdminContainer title="Create Poll" onSubmit={handleCreatePoll}>
        <Input 
            label="Poll question" 
            type="text" 
            id="pollQuestion" 
            placeholder="Poll question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <Input 
            label="Poll options (comma-separated)" 
            type="text" 
            id="pollOptions" 
            placeholder="Option 1, Option 2, Option 3"
            value={optionsString}
            onChange={(e) => setOptionsString(e.target.value)}
            required
          />
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Poll'}
          </Button>
      </AdminContainer>

      <AdminContainer title="View Poll Results" onSubmit={handleViewPollResults}>
        <Input label="Poll ID to view results of" type="number" id="pollId" placeholder="Poll ID" />
        <Button>View Poll Results</Button>
      </AdminContainer>

      <AdminContainer title="Toggle active poll" onSubmit={handleToggleActive}>
        <Input 
          label="Poll ID to toggle active status of" 
          type="number" 
          id="pollId" 
          placeholder="Poll ID"
          value={togglePollId}
          onChange={(e) => setTogglePollId(e.target.value)}
          required
        />
        <Button type="submit" disabled={isToggling}>
          {isToggling ? 'Toggling...' : 'Toggle Active Poll'}
        </Button>
      </AdminContainer>
    </div>
  );
} 