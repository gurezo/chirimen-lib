import { EventEmitter } from 'node:events';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { InvalidAccessError, OperationError } from './errors';
import {
  DirectionMode,
  GPIOChangeEvent,
  GPIOChangeEventHandler,
  GPIOValue,
  PortName,
  PortNumber,
} from './types';
import {
  GpioOffset,
  PollingInterval,
  SysfsGPIOPath,
  parseUint16,
  sleep,
} from './utils';

/**
 * GPIO ポート
 */
export class GPIOPort extends EventEmitter {
  /** ポート番号 */
  private readonly _portNumber: PortNumber;
  /** ポーリング間隔 */
  private readonly _pollingInterval: number;
  /** 入出力方向 */
  private _direction: DirectionMode | OperationError;
  /** エクスポート */
  private _exported: boolean | OperationError;
  /** エクスポートリトライ回数 */
  private _exportRetry: number;
  /** 入出力値 */
  private _value: GPIOValue | undefined;
  /** タイムアウト値 */
  private _timeout: ReturnType<typeof setInterval> | undefined;
  /** GPIO チェンジイベントハンドラ */
  onchange: GPIOChangeEventHandler | undefined;

  /**
   * Creates an instance of GPIOPort.
   * @param portNumber ポート番号
   */
  constructor(portNumber: PortNumber) {
    super();

    this._portNumber = parseUint16(portNumber.toString()) + GpioOffset;
    this._pollingInterval = PollingInterval;
    this._direction = new OperationError('Unknown direction.');
    this._exported = new OperationError('Unknown export.');
    this._exportRetry = 0;

    this.on('change', (event: GPIOChangeEvent): void => {
      if (this.onchange !== undefined) this.onchange(event);
    });
  }

  /**
   * ポート番号取得処理
   * @return 現在のポート番号
   */
  get portNumber(): PortNumber {
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
  get pinName(): string {
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
      await fs.access(path.join(SysfsGPIOPath, this.portName));
      this._exported = true;
    } catch {
      this._exported = false;
    }

    try {
      clearInterval(this._timeout as ReturnType<typeof setInterval>);
      if (!this.exported) {
        await fs.writeFile(
          path.join(SysfsGPIOPath, 'export'),
          String(this.portNumber)
        );
      }
      await fs.writeFile(
        path.join(SysfsGPIOPath, this.portName, 'direction'),
        direction
      );
      if (direction === 'in') {
        this._timeout = setInterval(
          // eslint-disable-next-line
          this.read.bind(this),
          this._pollingInterval
        );
      }
      // biome-ignore lint/suspicious/noExplicitAny:
    } catch (error: any) {
      if (this._exportRetry < 10) {
        await sleep(100);
        console.warn('May be the first time port access. Retry..');
        ++this._exportRetry;
        await this.export(direction);
      } else {
        throw new OperationError(error);
      }
    }

    this._direction = direction;
    this._exported = true;
  }

  /**
   * Unexport exported GPIO ports.
   * ポート開放をする
   * @return ポート開放処理の完了
   */
  async unexport(): Promise<void> {
    clearInterval(this._timeout as ReturnType<typeof setInterval>);

    try {
      await fs.writeFile(
        path.join(SysfsGPIOPath, 'unexport'),
        String(this.portNumber)
      );
      // biome-ignore lint/suspicious/noExplicitAny:
    } catch (error: any) {
      throw new OperationError(error);
    }

    this._exported = false;
  }

  /**
   * 入力値読み取り処理
   * @return 読み取り処理の完了
   */
  async read(): Promise<GPIOValue> {
    if (!(this.exported && this.direction === 'in')) {
      throw new InvalidAccessError(
        `The exported must be true and value of direction must be "in".`
      );
    }

    try {
      const buffer = await fs.readFile(
        path.join(SysfsGPIOPath, this.portName, 'value')
      );

      const value = parseUint16(buffer.toString()) as GPIOValue;

      if (this._value !== value) {
        this._value = value;
        const event: GPIOChangeEvent = {
          value,
          portNumber: this.portNumber,
        };
        this.emit('change', event);
      }

      return value;
      // biome-ignore lint/suspicious/noExplicitAny:
    } catch (error: any) {
      throw new OperationError(error);
    }
  }

  /**
   * 出力値書き込み処理
   * @return 読み取り処理の完了
   */
  async write(value: GPIOValue): Promise<void> {
    if (!(this.exported && this.direction === 'out')) {
      throw new InvalidAccessError(
        `The exported must be true and value of direction must be "out".`
      );
    }

    try {
      await fs.writeFile(
        path.join(SysfsGPIOPath, this.portName, 'value'),
        parseUint16(value.toString()).toString()
      );
      // biome-ignore lint/suspicious/noExplicitAny:
    } catch (error: any) {
      throw new OperationError(error);
    }
  }
}
