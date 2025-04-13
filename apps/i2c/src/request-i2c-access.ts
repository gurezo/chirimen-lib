import { I2CAccess, I2CAccessManager } from '@chirimen/i2c';

/**
 * I2CAccess インスタンス生成処理
 * @return I2CAccess インスタンスの生成の完了
 */
export function requestI2CAccess(): I2CAccess {
  return new I2CAccessManager();
}
