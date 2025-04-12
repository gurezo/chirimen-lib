import { I2CAccess } from './modules/i2c-access';
import { I2CPort } from './modules/i2c-port';
import { I2CPortMap } from './modules/i2c-port-map';
import { I2CSlaveDevice } from './modules/i2c-slave-device';
import { OperationError } from './modules/operation-error';
import {
  I2CPortMapSizeMax,
  I2CSlaveAddress,
  PortName,
  PortNumber,
  Uint16Max,
} from './modules/types';
import { parseUint16 } from './modules/utils';

// Web I2Cの仕様に基づく意図的なasync関数の使用なので、ルールを無効化
// eslint-disable-next-line
export async function requestI2CAccess(): Promise<I2CAccess> {
  const ports = new I2CPortMap(
    [...Array(I2CPortMapSizeMax).keys()].map((portNumber) => [
      portNumber,
      new I2CPort(portNumber),
    ])
  );

  return new I2CAccess(ports);
}

export {
  I2CAccess,
  I2CPort,
  I2CPortMap,
  I2CPortMapSizeMax,
  I2CSlaveAddress,
  I2CSlaveDevice,
  OperationError,
  parseUint16,
  PortName,
  PortNumber,
  Uint16Max,
};
