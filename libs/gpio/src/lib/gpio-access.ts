import { GPIOPortMap } from './gpio-port-map';

export class GPIOAccess {
  constructor(private readonly _ports: GPIOPortMap) {}

  public port(portNumber: number) {
    return this._ports.get(portNumber);
  }

  public getAllPorts() {
    return this._ports;
  }
}
