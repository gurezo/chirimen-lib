import { AccessError } from './errors';
import { PortName, PortNumber } from './types';
import { generatePortName } from './utils';

/**
 * ポートアクセスの基本クラス
 */
export abstract class PortAccess {
  protected readonly portNumber: PortNumber;
  protected readonly portName: PortName;

  constructor(portNumber: PortNumber) {
    this.portNumber = portNumber;
    this.portName = generatePortName(portNumber);
  }

  /**
   * ポート番号を取得
   */
  getPortNumber(): PortNumber {
    return this.portNumber;
  }

  /**
   * ポート名を取得
   */
  getPortName(): PortName {
    return this.portName;
  }

  /**
   * ポートが利用可能かチェック
   */
  protected checkPortAvailable(): void {
    if (this.portNumber < 0) {
      throw new AccessError('Port number must be positive');
    }
  }
}
