import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import md5 from 'md5';
import { supabase } from 'services/supabase';
import { AuthToken } from 'models/authToken';

interface VerifyMessageProps {
  address: string;
  message: string;
  signature: string;
}

async function verifyMessage({
  address,
  message,
  signature,
}: VerifyMessageProps) {
  const signerAddr = await ethers.utils.verifyMessage(message, signature);
  return signerAddr === address;
}

function generateToken({ address }: { address: string }) {
  const date = new Date();
  const now = date.getTime();

  return md5(`${now}:${address}`);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { address, message, signature } = req.body;
  const verified = await verifyMessage({ address, message, signature });

  if (verified) {
    const token = await generateToken(address);

    const authToken: AuthToken = {
      token,
      wallet: address,
    };

    const { data, error, status } = await supabase
      .from<AuthToken>('authTokens')
      .insert([authToken]);

    res.json({ token });
  } else {
    res.statusCode = 403;
    res.json('Unauthorized');
  }
}
