import { GPIOAccess, GPIOPort, GPIOPortMap } from '@chirimen-lib/gpio';
import { sleep } from '@chirimen-lib/shared';

/**
 * GPIO アクセス要求処理
 * @return GPIO アクセス
 */
export async function requestGPIOAccess(): Promise<GPIOAccess> {
  const ports = new GPIOPortMap();
  const access = new GPIOAccess(ports);

  // NOTE: For testing.
  await sleep(100);

  return access;
}

export { GPIOAccess, GPIOPort };
