import { I2CPortMap } from './i2c-port-map';

export class I2CAccess {
  constructor(private readonly ports: I2CPortMap) {}

  public port(portNumber: number) {
    return this.ports.get(portNumber);
  }

  public ports() {
    return this.ports;
  }
}
