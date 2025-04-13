import { sleep } from '@chirimen/shared';
import { GPIOAccess } from './shared/gpio-access';
import { GPIOPort } from './shared/gpio-port';
import { GPIOPortMap } from './shared/gpio-port-map';

/**
 * GPIO アクセス要求処理
 * @return GPIO アクセス
 */
export async function requestGPIOAccess(): Promise<GPIOAccess> {
  const ports = new GPIOPortMap();
  const access = new GPIOAccess(ports);

  // NOTE: Wait for GPIO initialization.
  await sleep(100);

  return access;
}

export { GPIOAccess, GPIOPort, GPIOPortMap };
