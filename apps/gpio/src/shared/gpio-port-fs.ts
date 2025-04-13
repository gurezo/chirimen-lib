import { InvalidAccessError, OperationError } from '@chirimen/shared';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { SysfsGPIOPath } from './constants';
import { DirectionMode, GPIOValue } from './types';

/**
 * GPIO ポートのファイルシステム操作
 */
export class GPIOPortFS {
  /** ポート名 */
  private readonly _portName: string;

  /**
   * Creates an instance of GPIOPortFS.
   * @param portName ポート名
   */
  constructor(portName: string) {
    this._portName = portName;
  }

  /**
   * ポートがエクスポートされているか確認
   * @return エクスポート状態
   */
  async isExported(): Promise<boolean> {
    try {
      await fs.promises.access(path.join(SysfsGPIOPath, this._portName));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ポートをエクスポート
   * @param portNumber ポート番号
   * @return エクスポート結果
   */
  async export(portNumber: number): Promise<void> {
    try {
      await fs.promises.writeFile(
        path.join(SysfsGPIOPath, 'export'),
        String(portNumber)
      );
    } catch (error) {
      throw new OperationError('Failed to export GPIO port.');
    }
  }

  /**
   * ポートをアンエクスポート
   * @param portNumber ポート番号
   * @return アンエクスポート結果
   */
  async unexport(portNumber: number): Promise<void> {
    try {
      await fs.promises.writeFile(
        path.join(SysfsGPIOPath, 'unexport'),
        String(portNumber)
      );
    } catch (error) {
      throw new OperationError('Failed to unexport GPIO port.');
    }
  }

  /**
   * 入出力方向を設定
   * @param direction 入出力方向
   * @return 設定結果
   */
  async setDirection(direction: DirectionMode): Promise<void> {
    if (!/^(in|out)$/.test(direction)) {
      throw new InvalidAccessError(`Must be "in" or "out".`);
    }

    try {
      await fs.promises.writeFile(
        path.join(SysfsGPIOPath, this._portName, 'direction'),
        direction
      );
    } catch (error) {
      throw new OperationError('Failed to set GPIO direction.');
    }
  }

  /**
   * 値を読み取り
   * @return 読み取り値
   */
  async readValue(): Promise<GPIOValue> {
    try {
      const value = await fs.promises.readFile(
        path.join(SysfsGPIOPath, this._portName, 'value'),
        'utf8'
      );
      return Number.parseInt(value.trim(), 10) as GPIOValue;
    } catch (error) {
      throw new OperationError('Failed to read GPIO value.');
    }
  }

  /**
   * 値を書き込み
   * @param value 書き込み値
   * @return 書き込み結果
   */
  async writeValue(value: GPIOValue): Promise<void> {
    try {
      await fs.promises.writeFile(
        path.join(SysfsGPIOPath, this._portName, 'value'),
        String(value)
      );
    } catch (error) {
      throw new OperationError('Failed to write GPIO value.');
    }
  }
}
