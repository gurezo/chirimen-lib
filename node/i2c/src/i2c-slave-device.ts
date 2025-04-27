import { I2CSlaveAddress } from './types';

/**
 * I2CSlaveDevice クラス
 */
export interface I2CSlaveDevice {
  /** I2C Slave アドレス */
  readonly slaveAddress: I2CSlaveAddress;

  /**
   * @function
   * I2C 読み取り処理
   * @param registerNumber 読み取りアドレス
   */
  read8(registerNumber: number): Promise<number>;
  /**
   * @function
   * I2C 読み取り処理
   * @param registerNumber 読み取りアドレス
   */
  read16(registerNumber: number): Promise<number>;
  /**
   * @function
   * I2c s/I2c/I2C 書き込み処理
   * @param registerNumber 書き込みアドレス
   * @param value 書き込みの値（バイト）
   */
  write8(registerNumber: number, value: number): Promise<number>;
  /**
   * @function
   * I2c bytes 書き込み処理
   * @param registerNumber 書き込みアドレス
   * @param value 書き込みの値（ワード）
   */
  write16(registerNumber: number, value: number): Promise<number>;
  /**
   * @function
   * I2c bytes 読み取りバイト処理
   * Different from Web I2C API specification.
   */
  readByte(): Promise<number>;
  /**
   * @function
   * I2c bytes 読み取りバイト処理
   * Different from Web I2C API specification.
   * @param length 読み取る配列の長さ
   */
  readBytes(length: number): Promise<Uint8Array>;
  /**
   * @function
   * I2c bytes 書き込みバイト処理
   * Different from Web I2C API specification.
   *  @param byte 書き込みの値
   */
  writeByte(byte: number): Promise<number>;
  /**
   * @function
   * I2c bytes 書き込みバイト配列処理
   * Different from Web I2C API specification.
   * @param bytes 書き込みの値の配列
   */
  writeBytes(bytes: Array<number>): Promise<Uint8Array>;
}
