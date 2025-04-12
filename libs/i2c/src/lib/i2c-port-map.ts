import { I2CPort } from './i2c-port';

export class I2CPortMap extends Map<number, I2CPort> {
  constructor(entries?: readonly (readonly [number, I2CPort])[]) {
    super(entries);
  }
}
