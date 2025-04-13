import { EventEmitter } from 'node:events';
import { GPIOAccess, GPIOPortMap } from './types';

/**
 * Router interface for GPIO access implementation
 */
export interface GPIORouter {
  waitConnection(): Promise<void>;
  send(command: number, data: Uint8Array): Promise<void>;
}

/**
 * GPIO Access implementation for Node.js
 */
export class NodeGPIOAccess extends EventEmitter implements GPIOAccess {
  private readonly _ports: GPIOPortMap;
  onchange?: (event: { port: number; value: number }) => void;

  constructor(ports?: GPIOPortMap) {
    super();
    this._ports = ports ?? new GPIOPortMap();
    this._ports.forEach((port) =>
      port.on('change', (event) => {
        this.emit('change', event);
      })
    );

    this.on('change', (event) => {
      if (this.onchange !== undefined) this.onchange(event);
    });
  }

  get ports(): GPIOPortMap {
    return this._ports;
  }

  async unexportAll(): Promise<void> {
    await Promise.all(
      [...this.ports.values()].map((port) =>
        port.exported ? port.unexport() : undefined
      )
    );
  }
}

/**
 * GPIO Access implementation for Polyfill
 */
export function createGPIOAccess(router: GPIORouter): GPIOAccess {
  const ports = new GPIOPortMap();

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
