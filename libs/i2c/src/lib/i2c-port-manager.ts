import { Router } from '@chirimen/shared';
import { I2CSlaveDeviceDriver } from './i2c-slave-device-driver';
import { I2CPort, I2CSlaveDevice } from './types';

export class I2CPortManager implements I2CPort {
  constructor(
    private readonly router: Router,
    public readonly portNumber: number,
    public readonly portName: string
  ) {}

  async open(slaveAddress: number): Promise<I2CSlaveDevice> {
    return new I2CSlaveDeviceDriver(this.router, slaveAddress);
  }
}
