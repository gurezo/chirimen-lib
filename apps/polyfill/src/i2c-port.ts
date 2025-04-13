import { createI2CPort } from '@chirimen/i2c';
import { createRouter } from './shared/router';

const serverURL = 'wss://localhost:33330/';
const router = createRouter(serverURL);

export const i2cPort = createI2CPort(router, 0);
