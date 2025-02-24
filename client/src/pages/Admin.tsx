import Button from '../components/Atoms/Button/Button';
import { Input } from '../components/Atoms/Input/Input';
import { useState } from 'react';
import { pollService } from '../services/api';
import AdminContainer from '../components/Organisms/PollContainer/AdminContainer';
export const Admin = () => {
  const [question, setQuestion] = useState('');
  const [optionsString, setOptionsString] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="container text-center flex gap-4 justify-between flex-wrap y-8 p-4 rounded-lg bg-white/20">
      <h1 className="text-4xl mb-12 w-full">Admin Panel</h1>

      <AdminContainer title="Delete Poll">
        <Input label="Poll ID to delete" type="number" id="pollId" placeholder="Poll ID" />
        <Button type="submit">Delete Poll</Button>
      </AdminContainer>

      <AdminContainer title="Create Poll">
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

      <AdminContainer title="View Poll Results">
        <Input label="Poll ID to view results of" type="number" id="pollId" placeholder="Poll ID" />
          <Input label="Poll ID to view results of" type="number" id="pollId" placeholder="Poll ID" />
        <Button>View Poll Results</Button>
      </AdminContainer>

      <AdminContainer title="Set active poll">
        <Input label="Poll ID to set as active" type="number" id="pollId" placeholder="Poll ID" />
        <Button>Set Active Poll</Button>
      </AdminContainer>
    </div>
  );
}; 