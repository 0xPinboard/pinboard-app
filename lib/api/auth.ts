import { supabase } from 'services/supabase';
import { AuthToken } from 'models/authToken';

export async function validateToken({
  token,
}: {
  token: string;
}): Promise<AuthToken | null> {
  const { data, error, status } = await supabase
    .from<AuthToken>('authTokens')
    .select('*')
    .eq('token', token);

  let authToken: AuthToken | null = null;
  if (data && data.length > 0) {
    authToken = data[0];
  }

  return authToken;
}

export async function checkAuth({ token }: { token: string }) {
  if (!token) {
    throw new Error('Not logged in');
  }

  const validated = await validateToken({ token });

  if (!validated) {
    return null;
  }

  const { wallet } = validated;

  return wallet;
}
