import { GPIOPort } from './gpio-port';

/** ピン名 */
export type PinName = string;

/** 入出力方向 */
export type DirectionMode = 'in' | 'out';

/** GPIO 値 0: LOW / 1: HIGH */
export type GPIOValue = 0 | 1;

/**
 * GPIO チェンジイベント
 */
export interface GPIOChangeEvent {
  /** 入出力値 */
  readonly value: GPIOValue;
  /** ポート */
  readonly port: GPIOPort;
}

/**
 * GPIO チェンジイベントハンドラ
 */
export interface GPIOChangeEventHandler {
  /** イベント */
  (event: GPIOChangeEvent): void;
}
