import { createRouter } from './shared/router';

export const serverURL = 'wss://localhost:33330/';
export const router = createRouter(serverURL);
