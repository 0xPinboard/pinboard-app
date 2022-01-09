import fetch from 'isomorphic-unfetch';

export const getTokenBalance = async (wallet: string) => {
  // const chain = 'eth';
  const chain = 'rinkeby';

  const response = await fetch(
    `https://deep-index.moralis.io/api/v2/${wallet}/erc20?chain=${chain}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.MORALIS_API_KEY
          ? process.env.MORALIS_API_KEY
          : '',
      },
    },
  ).then(async (r: any) => ({
    ok: r.ok,
    status: r.status,
    json: await r.json(),
  }));

  if (response.ok) {
    return response.json;
  } else {
    throw new Error('not ok');
  }
};
