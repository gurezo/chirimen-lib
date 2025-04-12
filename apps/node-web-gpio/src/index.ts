import { GPIOAccess } from './gpio-access';
import { GPIOPort } from './gpio-port';
import { PortNumber } from './types';
import { GPIOPortMapSizeMax } from './utils';

// Web GPIOの仕様に基づく意図的なasync関数の使用なので、ルールを無効化
// eslint-disable-next-line
export async function requestGPIOAccess(): Promise<GPIOAccess> {
  const ports = new Map<PortNumber, GPIOPort>(
    [...Array(GPIOPortMapSizeMax).keys()].map((portNumber) => [
      portNumber,
      new GPIOPort(portNumber),
    ])
  );

  return new GPIOAccess(ports);
}

export { GPIOAccess, GPIOPort };
