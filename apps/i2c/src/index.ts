import { OperationError } from '@chirimen/shared';
import { I2CAccess } from './shared/i2c-access';
import { I2CPort } from './shared/i2c-port';
import { I2CPortMap } from './shared/i2c-port-map';
import { I2CSlaveDevice } from './shared/i2c-slave-device';

/**
 * I2CAccess インスタンス生成処理
 * @return I2CAccess インスタンスの生成の完了
 */
export async function requestI2CAccess(): Promise<I2CAccess> {
  return new I2CAccess();
}

export { I2CAccess, I2CPort, I2CPortMap, I2CSlaveDevice, OperationError };
