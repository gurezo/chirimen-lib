import { createI2CSlaveDevice } from './i2c-slave-device';
import { Router } from './router';
import { I2CPort, I2CSlaveDevice } from './types';

export function createI2CPort(router: Router, portNumber: number): I2CPort {
  const i2cPort: I2CPort = {
    portNumber,
    open: async (slaveAddress: number): Promise<I2CSlaveDevice> => {
      await router.waitConnection();
      const data = new Uint8Array(3);
      data[0] = portNumber;
      data[1] = slaveAddress & 0xff;
      data[2] = slaveAddress >> 8;
      await router.send(0x20, data);
      return createI2CSlaveDevice(router, portNumber, slaveAddress);
    },
  };

  return i2cPort;
}
