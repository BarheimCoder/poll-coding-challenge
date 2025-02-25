const API_URL = 'http://localhost:5000/api';

export const pollService = {
  getActivePoll: async () => {
    const response = await fetch(`${API_URL}/polls/active`);
    if (!response.ok) throw new Error('Failed to fetch active poll');
    return response.json();
  },

  vote: async (pollId: number, optionId: number) => {
    const response = await fetch(`${API_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ optionId }),
    });
    if (!response.ok) throw new Error('Failed to submit vote');
    return response.json();
  },

  createPoll: async ({ question, options }: { question: string; options: string[] }) => {
    const response = await fetch(`${API_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, options }),
    });
    return response.json();
  },

  toggleActive: async (pollId: number) => {
    const response = await fetch(`${API_URL}/polls/toggle-active`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pollId }),
    });
    if (!response.ok) throw new Error('Failed to toggle poll status');
    return response.json();
  },

  deletePoll: async (pollId: number) => {
    const response = await fetch(`${API_URL}/polls/${pollId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete poll');
    return response.json();
  },

  getPollResults: async (pollId: number) => {
    const response = await fetch(`${API_URL}/polls/${pollId}/results`);
    if (!response.ok) throw new Error('Failed to fetch poll results');
    return response.json();
  },
}; 