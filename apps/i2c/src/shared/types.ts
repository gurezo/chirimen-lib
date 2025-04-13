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

/** ポート番号 */
export type PortNumber = number;
/** ポート名 */
export type PortName = string;
/** I2C Slave アドレス */
export type I2CSlaveAddress = number;
