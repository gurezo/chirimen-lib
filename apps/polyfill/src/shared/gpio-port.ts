import { Router } from './router';
import { GPIOPort } from './types';

export function createGPIOPort(router: Router, portNumber: number): GPIOPort {
  const gpioPort: GPIOPort = {
    portNumber,
    direction: 'in',
    onchange: null,

    export: async (): Promise<void> => {
      await router.waitConnection();
      const data = new Uint8Array(2);
      data[0] = portNumber;
      data[1] = 0x00;
      await router.send(0x10, data);
    },

    unexport: async (): Promise<void> => {
      await router.waitConnection();
      const data = new Uint8Array(2);
      data[0] = portNumber;
      data[1] = 0x00;
      await router.send(0x11, data);
    },

    read: async (): Promise<number> => {
      await router.waitConnection();
      const data = new Uint8Array(2);
      data[0] = portNumber;
      data[1] = 0x00;
      const result = await router.send(0x12, data);
      return result[0];
    },

    write: async (value: number): Promise<void> => {
      await router.waitConnection();
      const data = new Uint8Array(3);
      data[0] = portNumber;
      data[1] = 0x00;
      data[2] = value;
      await router.send(0x13, data);
    },
  };

  return gpioPort;
}
