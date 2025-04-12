import { I2CPortMap } from './i2c-port-map';

export class I2CAccess {
  constructor(private readonly _ports: I2CPortMap) {}

  public port(portNumber: number) {
    return this._ports.get(portNumber);
  }

  public getAllPorts() {
    return this._ports;
  }
}
