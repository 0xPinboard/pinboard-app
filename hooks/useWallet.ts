import { useEffect, useState } from 'react';
import { authFetch } from 'services/http';
import { Token } from 'models/token';

function translateToken(token: any): Token {
  return {
    balance: parseInt(token.balance),
    decimals: parseInt(token.decimals),
    logo: token.logo,
    name: token.name,
    symbol: token.symbol,
    thumbnail: token.thumbnail,
    tokenAddress: token.token_address,
  };
}

export function useWallet() {
  const [balance, setBalance] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const response = await authFetch('/api/wallet');

    if (response.ok) {
      setBalance(response.json.balance.map(translateToken));
      setBoards(response.json.boards);
    } else {
      throw new Error('Error fetching data');
    }
    setLoading(false);
  };

  return { balance, boards, loading };
}
