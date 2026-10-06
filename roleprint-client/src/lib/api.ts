import axios from 'axios';

// All requests go to /api, which Vite proxies to the backend (see vite.config.ts)
export const api = axios.create({ baseURL: '/api' });
