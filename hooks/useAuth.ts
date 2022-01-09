import cookies from 'js-cookie';
import { walletLogin } from '../services/auth';
import { useEffect } from 'react';
import { Store } from 'pullstate';

interface AuthState {
  wallet: string | undefined;
  token: string | undefined;
  isLoggedin: boolean;
}

const DEFAULT_STATE: AuthState = {
  wallet: undefined,
  token: undefined,
  isLoggedin: false,
};

export const AuthStore = new Store(DEFAULT_STATE);

export function useAuth() {
  const wallet = AuthStore.useState((s) => s.wallet);
  const token = AuthStore.useState((s) => s.token);
  const isLoggedin = AuthStore.useState((s) => s.isLoggedin);

  useEffect(() => {
    const tokenCookie = cookies.get('_auth_token');
    const walletCookie = cookies.get('_auth_wallet');

    if (tokenCookie && walletCookie) {
      AuthStore.update((s) => {
        s.wallet = walletCookie;
        s.token = tokenCookie;
        s.isLoggedin = true;
      });
    }
  }, []);

  const login = async () => {
    try {
      const { wallet, token } = await walletLogin();

      cookies.set('_auth_wallet', wallet);
      cookies.set('_auth_token', token);

      AuthStore.update((s) => {
        s.wallet = wallet;
        s.token = token;
        s.isLoggedin = true;
      });
    } catch (e) {
      console.log('failed', e);
    }
  };

  const logout = async () => {
    cookies.remove('_auth_wallet');
    cookies.remove('_auth_token');

    AuthStore.update((s) => {
      s.wallet = undefined;
      s.token = undefined;
      s.isLoggedin = false;
    });
  };

  return { wallet, token, isLoggedin, login, logout };
}
