const DEV_MODE = process.env.NODE_ENV !== 'production';
const API_ENDPOINT = DEV_MODE
  ? 'http://localhost:3000'
  : process.env.NEXT_PUBLIC_BASE_URL;

export const config = {
  API_ENDPOINT,
};
