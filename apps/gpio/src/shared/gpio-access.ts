import { EventEmitter } from 'node:events';
import { GPIOPortMap } from './gpio-port-map';
import { GPIOChangeEvent, GPIOChangeEventHandler } from './types';

/**
 * GPIO
 */
export class GPIOAccess extends EventEmitter {
  /** ポート */
  private readonly _ports: GPIOPortMap;
  /** GPIO チェンジイベントハンドラ */
  onchange: GPIOChangeEventHandler | undefined;

  /**
   * Creates an instance of GPIOAccess.
   * @param ports ポート番号
   */
  constructor(ports?: GPIOPortMap) {
    super();

    this._ports = ports == null ? new GPIOPortMap() : ports;
    // biome-ignore lint/complexity/noForEach:
    this._ports.forEach((port) =>
      port.on('change', (event) => {
        this.emit('change', event);
      })
    );

    this.on('change', (event: GPIOChangeEvent): void => {
      if (this.onchange !== undefined) this.onchange(event);
    });
  }

  /**
   * ポート情報取得処理
   * @return 現在のポート情報
   */
  get ports(): GPIOPortMap {
    return this._ports;
  }

  /**
   * Unexport all exported GPIO ports.
   * 全てのポート開放をする
   * @return ポート開放結果
   */
  async unexportAll(): Promise<void> {
    await Promise.all(
      [...this.ports.values()].map((port) =>
        port.exported ? port.unexport() : undefined
      )
    );
  }
}
