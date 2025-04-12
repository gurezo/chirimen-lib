import * as os from 'node:os';

/**
 * Interval of file system polling, in milliseconds.
 */
export const PollingInterval = 100;

/**
 * GPIO パス
 */
export const SysfsGPIOPath = '/sys/class/gpio';

/**
 * GPIO ポートマップサイズ
 */
export const GPIOPortMapSizeMax = 1024;

/**
 * Uint16 Max サイズ
 */
export const Uint16Max = 65535;

/**
 * GPIO0 オフセット
 * @see {@link https://github.com/raspberrypi/linux/issues/6037}
 */
export const GpioOffset =
  process.platform === 'linux' && 6.6 <= Number(os.release().match(/\d+\.\d+/))
    ? 512
    : 0;

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
 * 待機 関数
 * @param ms スリープ時間（ミリ秒）
 * @return 待機完了
 */
export function sleep(ms: number) {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
}
