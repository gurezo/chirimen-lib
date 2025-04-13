import { GPIOPortMap } from './gpio-port-map';

/**
 * GPIO アクセスのエクスポート管理
 */
export class GPIOAccessExport {
  /** ポート */
  private readonly _ports: GPIOPortMap;

  /**
   * Creates an instance of GPIOAccessExport.
   * @param ports ポート
   */
  constructor(ports: GPIOPortMap) {
    this._ports = ports;
  }

  /**
   * 全てのポートをアンエクスポート
   * @return アンエクスポート結果
   */
  async unexportAll(): Promise<void> {
    await Promise.all(
      [...this._ports.values()].map((port) =>
        port.exported ? port.unexport() : undefined
      )
    );
  }
}
