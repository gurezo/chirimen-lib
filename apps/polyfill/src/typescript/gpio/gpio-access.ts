import { WebSocketManager } from '../common/websocket';
import { GPIOPort } from './gpio-port';

const gpioPorts = [
  4, 17, 18, 27, 22, 23, 24, 25, 5, 6, 12, 13, 19, 16, 26, 20, 21,
];

export class GPIOAccess {
  private _ports: Map<number, GPIOPort> = new Map();

  constructor(private wsManager: WebSocketManager) {
    this.init();
  }

  private init(): void {
    for (const portNumber of gpioPorts) {
      this._ports.set(portNumber, new GPIOPort(portNumber, this.wsManager));
    }
  }

  get ports(): Map<number, GPIOPort> {
    return this._ports;
  }

  unexportAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const port of this._ports.values()) {
      promises.push(port.unexport());
    }
    return Promise.all(promises).then(() => undefined);
  }
}
