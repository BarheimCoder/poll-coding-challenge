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
  const [errorState, setError] = useState<string | null>(null);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    const options = optionsString
      .split('\n')
      .map(opt => opt.trim())
      .filter(opt => opt);
    
    if (options.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    if (options.length > 7) {
      setError('Maximum 7 options allowed');
      return;
    }

    if (new Set(options).size !== options.length) {
      setError('Duplicate options are not allowed');
      return;
    }

    const success = await onCreatePoll(question, options);
    if (success) {
      setQuestion('');
      setOptionsString('');
      setError(null);
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

      {errorState && <p className="text-red-400 text-sm w-full">{errorState}</p>}

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
        <Button type="submit" disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete Poll'}
        </Button>
      </AdminContainer>

      <AdminContainer title="Create Poll" onSubmit={handleCreatePoll}>
        <Input 
          label="Poll question" 
          type="text" 
          id="pollQuestion" 
          placeholder="What is your favorite color?"
          value={question}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
          required
          minLength={5}
          maxLength={200}
        />
        <Input 
          label="Poll options (one per line)" 
          type="textarea" 
          id="pollOptions" 
          placeholder="Red&#13;&#10;Blue&#13;&#10;Green"
          value={optionsString}
          rows={5}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOptionsString(e.target.value)}
          required
        />
        {errorState && <p className="text-red-500 text-sm">{errorState}</p>}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTogglePollId(e.target.value)}
          required
        />
        <Button type="submit" disabled={isToggling}>
          {isToggling ? 'Toggling...' : 'Toggle Active Poll'}
        </Button>
      </AdminContainer>
    </div>
  );
} 