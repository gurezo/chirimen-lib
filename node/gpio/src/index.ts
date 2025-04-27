import { GPIOAccess } from './gpio-access';
import { GPIOPort } from './gpio-port';
import { sleep } from './utils';

/**
 * GPIO Access 要求処理
 * @return GPIO Access インスタンス
 */
export async function requestGPIOAccess(): Promise<GPIOAccess> {
  const access = new GPIOAccess();
  await sleep(100);
  return access;
}

export { GPIOAccess, GPIOPort };
