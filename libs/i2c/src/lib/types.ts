/**
 * I2C Port Map Max サイズ
 */
export const I2CPortMapSizeMax = 32;

/**
 * Uint16 Max サイズ
 */
export const Uint16Max = 65535;

/**
 * Uint16型変換処理
 * @param parseString 変換文字列
 * @return Uint16型変換値
 */
export function parseUint16(parseString: string) {
  const n = Number.parseInt(parseString, 10);
  if (0 <= n && n <= Uint16Max) return n;
  else throw new RangeError(`Must be between 0 and ${Uint16Max}.`);
}

/** I2C Slave アドレス */
export type I2CSlaveAddress = number;

/** ポート番号 */
export type PortNumber = number;

/** ポート名 */
export type PortName = string;

/**
 * I2CSlaveDevice インターフェース
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
   * I2C 書き込み処理
   * @param registerNumber 書き込みアドレス
   * @param value 書き込みの値（バイト）
   */
  write8(registerNumber: number, value: number): Promise<number>;
  /**
   * @function
   * I2C 書き込み処理
   * @param registerNumber 書き込みアドレス
   * @param value 書き込みの値（ワード）
   */
  write16(registerNumber: number, value: number): Promise<number>;

  /**
   * @function
   * I2C 読み取りバイト処理
   * Different from Web I2C API specification.
   */
  readByte(): Promise<number>;
  /**
   * @function
   * I2C 読み取りバイト処理
   * Different from Web I2C API specification.
   * @param length 読み取る配列の長さ
   */
  readBytes(length: number): Promise<Uint8Array>;
  /**
   * @function
   * I2C 書き込みバイト処理
   * Different from Web I2C API specification.
   * @param byte 書き込みの値
   */
  writeByte(byte: number): Promise<number>;
  /**
   * @function
   * I2C 書き込みバイト配列処理
   * Different from Web I2C API specification.
   * @param bytes 書き込みの値の配列
   */
  writeBytes(bytes: Array<number>): Promise<Uint8Array>;
}

/**
 * I2CPort インターフェース
 */
export interface I2CPort {
  /** ポート番号 */
  readonly portNumber: PortNumber;
  /** ポート名 */
  readonly portName: string;

  /**
   * I2CSlave 接続デバイスオープン処理
   * @param slaveAddress 接続デバイス情報のアドレス
   * @return I2CSlaveDevice インスタンスの生成の完了
   */
  open(slaveAddress: I2CSlaveAddress): Promise<I2CSlaveDevice>;
}

/**
 * I2CPortMap クラス
 * Different from Web I2C API specification.
 */
export class I2CPortMap extends Map<PortNumber, I2CPort> {
  /**
   * ポート名からポートを取得する
   * @param portName ポート名
   * @return ポート
   */
  getByName(portName: PortName): I2CPort | undefined {
    const matches = /^i2c-(\d+)$/.exec(portName);
    return matches == null ? undefined : this.get(parseUint16(matches[1]));
  }
}

/**
 * I2CAccess インターフェース
 */
export interface I2CAccess {
  /** ポート情報 */
  readonly ports: I2CPortMap;
}
