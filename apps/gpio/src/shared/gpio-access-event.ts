import { EventEmitter } from 'node:events';
import { GPIOPort } from './gpio-port';
import { GPIOChangeEvent, GPIOChangeEventHandler } from './types';

/**
 * GPIO アクセスのイベント管理
 */
export class GPIOAccessEvent extends EventEmitter {
  /** GPIO チェンジイベントハンドラ */
  onchange: GPIOChangeEventHandler | undefined;

  /**
   * Creates an instance of GPIOAccessEvent.
   */
  constructor() {
    super();

    this.on('change', (event: GPIOChangeEvent): void => {
      if (this.onchange !== undefined) this.onchange(event);
    });
  }

  /**
   * ポートのイベントを監視
   * @param port ポート
   * @return 監視結果
   */
  watchPort(port: GPIOPort): void {
    port.on('change', (event) => {
      this.emit('change', event);
    });
  }
}
