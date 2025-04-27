import { I2CAccess } from './i2c-access';

/**
 * I2CAccess インスタンス生成処理
 * @return I2CAccess インスタンスの生成の完了
 */
export async function requestI2CAccess(): Promise<I2CAccess> {
  return new I2CAccess();
}
