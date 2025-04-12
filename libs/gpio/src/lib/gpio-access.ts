import { GPIOPortMap } from './gpio-port-map';

export class GPIOAccess {
  constructor(private readonly ports: GPIOPortMap) {}

  public port(portNumber: number) {
    return this.ports.get(portNumber);
  }

  public ports() {
    return this.ports;
  }
}
