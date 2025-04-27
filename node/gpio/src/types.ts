import { DirectionMode, GPIOValue, PortName, PortNumber } from '@chirimen/core';

/** ピン名 */
export type PinName = string;

/**
 * GPIO チェンジイベント
 */
export interface GPIOChangeEvent {
  /** 入出力値 */
  readonly value: GPIOValue;
  /** ポート番号 */
  readonly portNumber: PortNumber;
}

/**
 * GPIO チェンジイベントハンドラ
 */
export interface GPIOChangeEventHandler {
  /** イベント */
  (event: GPIOChangeEvent): void;
}

export { DirectionMode, GPIOValue, PortName, PortNumber };
