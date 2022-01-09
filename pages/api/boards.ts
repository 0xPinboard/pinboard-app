import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'lib/api/auth';
import { supabase } from 'services/supabase';
import { Board } from 'models/board';

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.headers;
  const { contractAddress, tokenAddress } = req.body;

  if (typeof token !== 'string') {
    res.statusCode = 403;
    res.json('Unauthorized');
  }

  const wallet = await checkAuth({ token: token ? token.toString() : '' });

  if (!wallet) {
    res.statusCode = 403;
    res.json('Unauthorized');
  }

  const board: Board = {
    wallet: wallet ? wallet.toString() : '',
    contract: contractAddress,
    token: tokenAddress,
  };

  const { data, error, status } = await supabase
    .from<Board>('boards')
    .insert([board]);

  if (status === 200 || status === 201) {
    const newBoard: Board | null = data ? data[0] : null;
    res.json(newBoard);
  } else {
    console.error('Error', error);
    throw new Error('Failed to create a board');
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return handlePost(req, res);
    default:
      res.statusCode = 400;
      res.json('Wrong method');
  }
};

export default handler;
