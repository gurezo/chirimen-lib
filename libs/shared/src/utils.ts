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

/**
 * 指定されたミリ秒間スリープします
 * @param ms スリープするミリ秒
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * ログ情報出力
 * @param str 出力文字列
 */
export function infoLog(str: string): void {
  console.log('info: ' + str);
}

/**
 * エラーログログ情報出力
 * @param error エラー情報
 */
export function errLog(error: Error | string): void {
  console.error(error);
}
