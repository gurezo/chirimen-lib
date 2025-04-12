import { I2CPort } from './i2c-port';
import { PortName, PortNumber } from './types';
import { parseUint16 } from './utils';

/** Different from Web I2C API specification. */
export class I2CPortMap extends Map<PortNumber, I2CPort> {
  getByName(portName: PortName): I2CPort | undefined {
    const matches = /^i2c-(\d+)$/.exec(portName);
    return matches == null ? undefined : this.get(parseUint16(matches[1]));
  }
}
