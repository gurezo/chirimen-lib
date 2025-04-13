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
