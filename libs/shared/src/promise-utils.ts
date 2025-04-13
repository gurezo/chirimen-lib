/**
 * 指定されたミリ秒間スリープします
 * @param ms スリープするミリ秒
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
