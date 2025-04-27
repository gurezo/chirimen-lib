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
