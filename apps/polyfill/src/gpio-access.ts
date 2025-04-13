import { createGPIOAccess } from '@chirimen/gpio';
import { createRouter } from './shared/router';

const serverURL = 'wss://localhost:33330/';
const router = createRouter(serverURL);

export const gpioAccess = createGPIOAccess(router);
