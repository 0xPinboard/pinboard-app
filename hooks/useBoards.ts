import { authFetch } from 'services/http';

export function useBoards() {
  const addBoard = async (contractAddress: string, tokenAddress: string) => {
    const response = await authFetch('/api/boards', {
      method: 'POST',
      body: JSON.stringify({
        contractAddress,
        tokenAddress,
      }),
    });

    if (response.ok) {
      return response.json;
    } else {
      console.log(response);
      throw new Error('Error creating new board');
    }
  };

  return { addBoard };
}
