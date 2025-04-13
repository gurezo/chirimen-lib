import { Uint16Max } from './constants';

/**
 * Uint16型変換処理
 * @param parseString 変換文字列
 * @return Uint16型変換値
 */
export function parseUint16(parseString: string) {
  const n = Number.parseInt(parseString, 10);
  if (0 <= n && n <= Uint16Max) return n;
  // biome-ignore lint/style/noUselessElse:
  else throw new RangeError(`Must be between 0 and ${Uint16Max}.`);
}

/**
 * スリープ処理
 * @param ms スリープ時間（ミリ秒）
 * @return スリープ完了
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
