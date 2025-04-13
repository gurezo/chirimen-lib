import { GPIOPort, GPIOPortMap, NodeGPIOAccess } from '@chirimen/gpio';
import { sleep } from '@chirimen/shared';

/**
 * GPIO アクセス要求処理
 * @return GPIO アクセス
 */
export async function requestGPIOAccess(): Promise<NodeGPIOAccess> {
  const ports = new GPIOPortMap();
  const access = new NodeGPIOAccess(ports);

  // NOTE: Wait for GPIO initialization.
  await sleep(100);

  return access;
}

export { NodeGPIOAccess as GPIOAccess, GPIOPort, GPIOPortMap };
