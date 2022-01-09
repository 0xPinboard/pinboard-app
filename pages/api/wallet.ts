import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'lib/api/auth';
import { supabase } from 'services/supabase';
import { getTokenBalance } from 'lib/api/tokens';
import { Board } from 'models/board';

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.headers;

  if (typeof token !== 'string') {
    res.statusCode = 403;
    res.json('Unauthorized');
  }

  const wallet = await checkAuth({ token: token ? token.toString() : '' });

  if (!wallet) {
    res.statusCode = 403;
    res.json('Unauthorized');
  }

  const { data, error, status } = await supabase
    .from<Board>('boards')
    .select('*')
    .eq('wallet', wallet?.toString());

  // console.log(data);

  const balance = await getTokenBalance(wallet || '');

  res.json({ balance, boards: data });

  // res.json(balance);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    default:
      res.statusCode = 400;
      res.json('Wrong method');
  }
};

export default handler;
