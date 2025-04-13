import {
  InvalidAccessError,
  OperationError,
  parseUint16,
  PortName,
} from '@chirimen/shared';
import { EventEmitter } from 'node:events';
import { GpioOffset } from './constants';
import { GPIOPortFS } from './gpio-port-fs';
import { GPIOPortPolling } from './gpio-port-polling';
import {
  DirectionMode,
  GPIOChangeEvent,
  GPIOChangeEventHandler,
  GPIOValue,
  PinName,
} from './types';

/**
 * GPIO ポート
 */
export class GPIOPort extends EventEmitter {
  /** ポート番号 */
  private readonly _portNumber: number;
  /** ファイルシステム操作 */
  private readonly _fs: GPIOPortFS;
  /** ポーリング処理 */
  private readonly _polling: GPIOPortPolling;
  /** 入出力方向 */
  private _direction: DirectionMode | OperationError;
  /** エクスポート */
  private _exported: boolean | OperationError;
  /** GPIO チェンジイベントハンドラ */
  onchange: GPIOChangeEventHandler | undefined;

  /**
   * Creates an instance of GPIOPort.
   * @param portNumber ポート番号
   */
  constructor(portNumber: number) {
    super();

    this._portNumber = parseUint16(portNumber.toString()) + GpioOffset;
    this._fs = new GPIOPortFS(this.portName);
    this._polling = new GPIOPortPolling(this._fs);
    this._direction = new OperationError('Unknown direction.');
    this._exported = new OperationError('Unknown export.');

    this._polling.on('change', (event: { value: GPIOValue }): void => {
      this.emit('change', { value: event.value, port: this });
    });

    this.on('change', (event: GPIOChangeEvent): void => {
      if (this.onchange !== undefined) this.onchange(event);
    });
  }

  /**
   * ポート番号取得処理
   * @return 現在のポート番号
   */
  get portNumber(): number {
    return this._portNumber;
  }

  /**
   * ポート名取得処理
   * @return 現在のポート名
   */
  get portName(): PortName {
    return `gpio${this.portNumber}`;
  }

  /**
   * ピン名取得処理
   * @return 現在のピン名
   */
  get pinName(): PinName {
    // NOTE: Unknown pinName.
    return '';
  }

  /**
   * GPIO 入出力方向 getter
   * @return 現在のGPIO 入出力方向
   */
  get direction(): DirectionMode {
    if (this._direction instanceof OperationError) throw this._direction;
    return this._direction;
  }

  /**
   * GPIO export の有無 getter
   * @return 現在のGPIO 出力
   */
  get exported(): boolean {
    if (this._exported instanceof OperationError) throw this._exported;
    return this._exported;
  }

  /**
   * GPIO 出力処理
   * @param direction GPIO 入出力方向
   * @return export 処理の完了
   */
  async export(direction: DirectionMode): Promise<void> {
    if (!/^(in|out)$/.test(direction)) {
      throw new InvalidAccessError(`Must be "in" or "out".`);
    }

    try {
      this._exported = await this._fs.isExported();
      if (!this.exported) {
        await this._fs.export(this.portNumber);
      }
      await this._fs.setDirection(direction);
      if (direction === 'in') {
        this._polling.start();
      } else {
        this._polling.stop();
      }
      this._direction = direction;
      this._exported = true;
    } catch (error) {
      this._exported = false;
      throw error;
    }
  }

  /**
   * GPIO ポート開放処理
   * @return unexport 処理の完了
   */
  async unexport(): Promise<void> {
    try {
      this._polling.stop();
      if (this.exported) {
        await this._fs.unexport(this.portNumber);
      }
      this._exported = false;
    } catch (error) {
      this._exported = true;
      throw error;
    }
  }

  /**
   * GPIO 入力処理
   * @return GPIO 入力値
   */
  async read(): Promise<GPIOValue> {
    if (!this.exported) {
      throw new InvalidAccessError('GPIO port is not exported.');
    }
    if (this.direction !== 'in') {
      throw new InvalidAccessError('GPIO port is not input mode.');
    }

    return this._fs.readValue();
  }

  /**
   * GPIO 出力処理
   * @param value GPIO 出力値
   * @return write 処理の完了
   */
  async write(value: GPIOValue): Promise<void> {
    if (!this.exported) {
      throw new InvalidAccessError('GPIO port is not exported.');
    }
    if (this.direction !== 'out') {
      throw new InvalidAccessError('GPIO port is not output mode.');
    }

    await this._fs.writeValue(value);
  }
}
