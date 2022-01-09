import fetch from 'isomorphic-unfetch';
import cookies from 'js-cookie';

export function authFetch(endpoint: string, args?: any) {
  const token = cookies.get('_auth_token');

  if (!token) {
    window.location.href = '/';
  }

  let method;
  let headers;

  if (args) {
    method = args.method;
    headers = {
      token,
      'Content-Type': 'application/json',
      ...args.headers,
    };
  } else {
    method = 'GET';
    headers = { token, 'Content-Type': 'application/json' };
  }

  return fetch(endpoint, {
    ...args,
    method,
    headers,
  }).then(async (r) => ({
    ok: r.ok,
    status: r.status,
    json: await r.json(),
  }));
}
