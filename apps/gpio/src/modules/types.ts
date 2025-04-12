import { EventEmitter } from 'node:events';
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

/** ポート番号 */
export type PortNumber = number;
/** ポート名 */
export type PortName = string;
/** ピン名 */
export type PinName = string;

/** 入出力方向 */
export type DirectionMode = 'in' | 'out';

/** GPIO 値 0: LOW / 1: HIGH */
export type GPIOValue = 0 | 1;

/**
 * GPIO ポートインターフェース
 */
export interface IGPIOPort extends EventEmitter {
  /** ポート番号 */
  readonly portNumber: PortNumber;
  /** ポート名 */
  readonly portName: PortName;
  /** ピン名 */
  readonly pinName: PinName;
  /** 入出力方向 */
  readonly direction: DirectionMode;
  /** エクスポート */
  readonly exported: boolean;
  /** GPIO チェンジイベントハンドラ */
  onchange?: GPIOChangeEventHandler;
  /** エクスポート */
  export(direction: DirectionMode): Promise<void>;
  /** アンエクスポート */
  unexport(): Promise<void>;
  /** 読み込み */
  read(): Promise<GPIOValue>;
  /** 書き込み */
  write(value: GPIOValue): Promise<void>;
}

/**
 * GPIO チェンジイベント
 */
export interface GPIOChangeEvent {
  /** 入出力値 */
  readonly value: GPIOValue;
  /** ポート */
  readonly port: IGPIOPort;
}

/**
 * GPIO チェンジイベントハンドラ
 */
export interface GPIOChangeEventHandler {
  /** イベント */
  (event: GPIOChangeEvent): void;
}

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
 * スリープ処理
 * @param ms スリープ時間(ミリ秒)
 * @return スリープ完了
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
