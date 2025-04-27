/** ポート番号 */
export type PortNumber = number;
/** ポート名 */
export type PortName = string;

/** 入出力方向 */
export type DirectionMode = 'in' | 'out';

/** GPIO 値 0: LOW / 1: HIGH */
export type GPIOValue = 0 | 1;

/** I2C Slave アドレス */
export type I2CSlaveAddress = number;

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
