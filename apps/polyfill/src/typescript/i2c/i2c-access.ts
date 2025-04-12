import { WebSocketManager } from '../common/websocket';
import { I2CPort } from './i2c-port';

const i2cPorts = [1];

export class I2CAccess {
  private _ports: Map<number, I2CPort> = new Map();

  constructor(private wsManager: WebSocketManager) {
    this.init();
  }

  private init(): void {
    for (const portNumber of i2cPorts) {
      this._ports.set(portNumber, new I2CPort(portNumber, this.wsManager));
    }
  }

  get ports(): Map<number, I2CPort> {
    return this._ports;
  }
}
