import { ethers } from 'ethers';
import { config } from 'utils/api';

const SIGN_MESSAGE = `Please sign this message to connect. This action does not cost anything. We're just checking your wallet identity and creating a session.`;

const signMessage = async ({ message }: { message: string }) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const signature = await signer.signMessage(message);
  const address = await signer.getAddress();

  return { address, message, signature };
};

export async function walletLogin() {
  const randomString =
    Date.now().toString(36) + Math.random().toString(36).substr(2);
  const sig = await signMessage({ message: `${SIGN_MESSAGE} ${randomString}` });

  const res = await fetch(`${config.API_ENDPOINT}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sig),
  }).then(async (r) => ({
    ok: r.ok,
    status: r.status,
    json: await r.json(),
  }));

  if (res.ok) {
    return { wallet: sig.address, token: res.json.token };
  } else {
    throw new Error('Log in failed');
  }
}
