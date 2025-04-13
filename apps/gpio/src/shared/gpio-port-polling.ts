import { EventEmitter } from 'node:events';
import { PollingInterval } from './constants';
import { GPIOPortFS } from './gpio-port-fs';
import { GPIOValue } from './types';

/**
 * GPIO ポートのポーリング処理
 */
export class GPIOPortPolling extends EventEmitter {
  /** ファイルシステム操作 */
  private readonly _fs: GPIOPortFS;
  /** ポーリング間隔 */
  private readonly _pollingInterval: number;
  /** タイムアウト値 */
  private _timeout: ReturnType<typeof setInterval> | undefined;
  /** 現在の値 */
  private _currentValue: GPIOValue | undefined;

  /**
   * Creates an instance of GPIOPortPolling.
   * @param fs ファイルシステム操作
   */
  constructor(fs: GPIOPortFS) {
    super();
    this._fs = fs;
    this._pollingInterval = PollingInterval;
  }

  /**
   * ポーリング開始
   * @return ポーリング開始結果
   */
  start(): void {
    if (this._timeout !== undefined) {
      return;
    }

    this._timeout = setInterval(async () => {
      try {
        const newValue = await this._fs.readValue();
        if (this._currentValue !== newValue) {
          this._currentValue = newValue;
          this.emit('change', { value: newValue });
        }
      } catch (error) {
        // エラーは無視
      }
    }, this._pollingInterval);
  }

  /**
   * ポーリング停止
   * @return ポーリング停止結果
   */
  stop(): void {
    if (this._timeout === undefined) {
      return;
    }

    clearInterval(this._timeout);
    this._timeout = undefined;
  }
}
