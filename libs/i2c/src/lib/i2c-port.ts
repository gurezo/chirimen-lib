import { Router } from '@chirimen/shared';
import { I2CPortManager } from './i2c-port-manager';
import { I2CPort } from './types';

export function createI2CPort(router: Router, portNumber: number): I2CPort {
  return new I2CPortManager(router, portNumber, `i2c-${portNumber}`);
}
