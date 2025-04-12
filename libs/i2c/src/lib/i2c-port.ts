import { I2CSlaveAddress, OperationError } from '@chirimen-lib/shared';
import { I2CSlaveDevice } from './i2c-slave-device';

export class I2CPort {
  constructor(private readonly portNumber: number) {}

  public async open(slaveAddress: number): Promise<I2CSlaveDevice> {
    if (
      slaveAddress < I2CSlaveAddress.MIN ||
      slaveAddress > I2CSlaveAddress.MAX
    ) {
      throw new OperationError('Invalid slave address');
    }

    return new I2CSlaveDevice(this.portNumber, slaveAddress);
  }
}
