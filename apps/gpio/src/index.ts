import { GPIOAccess, GPIOPortMap } from './modules/gpio-access';
import { GPIOPort } from './modules/gpio-port';
import { sleep } from './modules/types';

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
