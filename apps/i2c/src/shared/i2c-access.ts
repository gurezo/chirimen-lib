import { I2CPortMap } from './i2c-port-map';

/**
 * I2CAccess クラス
 */
export class I2CAccess {
  private readonly _ports: I2CPortMap;

  /**
   * Creates an instance of GPIOAccess.
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
