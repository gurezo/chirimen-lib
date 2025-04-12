import { OperationError } from '@chirimen/shared';
import { I2CSlaveDevice } from './i2c-slave-device';

export class I2CPort {
  constructor(private readonly portNumber: number) {}

  public async open(slaveAddress: number): Promise<I2CSlaveDevice> {
    if (slaveAddress < 0 || slaveAddress > 127) {
      throw new OperationError('Invalid slave address');
    }

    return new I2CSlaveDevice(this.portNumber, slaveAddress);
  }
}
