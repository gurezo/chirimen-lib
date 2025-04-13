import { I2CAccess, I2CPortMap } from './types';

/**
 * I2CAccess クラス
 */
export class I2CAccessManager implements I2CAccess {
  private readonly _ports: I2CPortMap;

  /**
   * Creates an instance of I2CAccess.
   * @param ports ポート番号
   */
  constructor(ports?: I2CPortMap) {
    this._ports = ports == null ? new I2CPortMap() : ports;
  }

  /**
   * ポート情報取得処理
   * @return 現在のポート情報
   */
  get ports(): I2CPortMap {
    return this._ports;
  }
}
