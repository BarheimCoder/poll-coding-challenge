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
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create poll');
    }
    const data = await response.json();
    return data.message;
  },

  toggleActive: async (pollId: number) => {
    const response = await fetch(`${API_URL}/polls/toggle-active`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pollId }),
    });
    if (response.status === 404) {
      throw new Error('Poll not found');
    }
    if (!response.ok) {
      throw new Error('Failed to toggle poll status');
    }
    const data = await response.json();
    return data.message;
  },

  deletePoll: async (pollId: number) => {
    const response = await fetch(`${API_URL}/polls/${pollId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 404) {
      throw new Error('Poll not found');
    }
    if (!response.ok) {
      throw new Error('Failed to delete poll');
    }
    const data = await response.json();
    return data.message;
  },

  getPollResults: async (pollId: number) => {
    const response = await fetch(`${API_URL}/polls/${pollId}/results`);
    if (!response.ok) throw new Error('Failed to fetch poll results');
    return response.json();
  },

  getVoteDetails: async (pollId: number) => {
    const response = await fetch(`${API_URL}/polls/${pollId}/votes`);
    if (response.status === 404) {
      throw new Error('Poll not found');
    }
    if (!response.ok) {
      throw new Error('Failed to fetch vote details');
    }
    return response.json();
  },
}; 