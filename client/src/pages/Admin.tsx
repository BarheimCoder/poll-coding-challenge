import Button from '../components/Atoms/Button/Button';
import { Input } from '../components/Atoms/Input/Input';
import { useState } from 'react';
import { pollService } from '../services/api';
import AdminContainer from '../components/Organisms/PollContainer/AdminContainer';

export function Admin() {
  const [question, setQuestion] = useState('');
  const [optionsString, setOptionsString] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [togglePollId, setTogglePollId] = useState('');
  const [isToggling, setIsToggling] = useState(false);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const options = optionsString.split(',').map(opt => opt.trim()).filter(opt => opt);
    
    if (options.length < 2) {
      setError('Please provide at least 2 options (comma-separated)');
      return;
    }

    setIsCreating(true);
    try {
      await pollService.createPoll({ question, options });
      setQuestion('');
      setOptionsString('');
    } catch (err) {
      setError('Failed to create poll');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!togglePollId) return;

    setIsToggling(true);
    try {
      await pollService.toggleActive(Number(togglePollId));
      setTogglePollId('');
      setError(null);
    } catch (err) {
      setError('Failed to toggle poll status');
    } finally {
      setIsToggling(false);
    }
  };
      

  return (
    <div className="container text-center flex gap-4 justify-between flex-wrap y-8 p-4 rounded-lg bg-white/20">
      <h1 className="text-4xl mb-12 w-full">Admin Panel</h1>

      <AdminContainer title="Delete Poll" onSubmit={handleDeletePoll}>
        <Input label="Poll ID to delete" type="number" id="pollId" placeholder="Poll ID" />
        <Button type="submit">Delete Poll</Button>
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
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Poll'}
          </Button>
      </AdminContainer>

      <AdminContainer title="View Poll Results" onSubmit={handleViewPollResults}>
        <Input label="Poll ID to view results of" type="number" id="pollId" placeholder="Poll ID" />
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