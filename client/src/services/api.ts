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
  }
}; 