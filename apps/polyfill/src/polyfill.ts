import { createGPIOAccess } from './shared/gpio-access';
import { createI2CPort } from './shared/i2c-port';
import { createRouter } from './shared/router';

const serverURL = 'wss://localhost:33330/';
const router = createRouter(serverURL);

export const gpioAccess = createGPIOAccess(router);
export const i2cPort = createI2CPort(router, 0);
