import {
  I2CAccess,
  I2CPort,
  I2CPortMap,
  I2CSlaveDevice,
} from '@chirimen-lib/i2c';
import {
  I2CPortMapSizeMax,
  I2CSlaveAddress,
  OperationError,
  parseUint16,
  PortName,
  PortNumber,
  Uint16Max,
} from '@chirimen-lib/shared';

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

export type { PortName, PortNumber };

export {
  I2CAccess,
  I2CPort,
  I2CPortMap,
  I2CPortMapSizeMax,
  I2CSlaveAddress,
  I2CSlaveDevice,
  OperationError,
  parseUint16,
  Uint16Max,
};
