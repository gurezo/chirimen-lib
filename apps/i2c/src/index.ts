import {
  I2CAccess,
  I2CAccessManager,
  I2CPort,
  I2CPortMap,
  I2CSlaveDevice,
} from '@chirimen/i2c';
import { OperationError } from '@chirimen/shared';

/**
 * I2CAccess インスタンス生成処理
 * @return I2CAccess インスタンスの生成の完了
 */
export function createI2CAccess(): I2CAccess {
  return new I2CAccessManager();
}

export { I2CAccess, I2CPort, I2CPortMap, I2CSlaveDevice, OperationError };
