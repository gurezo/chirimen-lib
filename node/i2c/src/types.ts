import {
  I2CSlaveAddress,
  PortName,
  PortNumber,
  Uint16Max,
} from '@chirimen/core';

/**
 * I2C Port Map Max サイズ
 */
export const I2CPortMapSizeMax = 32;

export { I2CSlaveAddress, PortName, PortNumber, Uint16Max };

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
