import { Router } from './router';
import { GPIOAccess, GPIOPort } from './types';

export function createGPIOAccess(router: Router): GPIOAccess {
  const ports = new Map<number, GPIOPort>();

  const gpioAccess: GPIOAccess = {
    ports,
    unexportAll: async (): Promise<void> => {
      await router.waitConnection();
      const data = new Uint8Array(1);
      data[0] = 0x00;
      await router.send(0x11, data);
    },
  };

  return gpioAccess;
}
