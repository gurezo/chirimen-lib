import { errLog, infoLog } from '../common/logger';
import { Direction, Value } from '../common/types';
import { WebSocketManager } from '../common/websocket';

export class GPIOPort {
  private portNumber: number;
  private value: Value | null = null;
  private _onchange: ((value: Value) => void) | null = null;

  constructor(portNumber: number, private wsManager: WebSocketManager) {
    this.portNumber = portNumber;
    infoLog(`GPIOPort:${portNumber}`);
  }

  export(direction: Direction): Promise<void> {
    return new Promise((resolve, reject) => {
      let dir = -1;
      if (direction === 'out') {
        dir = 0;
        this.wsManager.removeEvent(0x14, this.portNumber);
      } else if (direction === 'in') {
        dir = 1;
        this.wsManager.registerEvent(0x14, this.portNumber, (buf) => {
          if (typeof this._onchange === 'function') {
            infoLog('onchange');
            this._onchange(buf[5] as Value);
          }
        });
      } else {
        reject(`export:direction not valid! [${direction}]`);
        return;
      }

      infoLog(`export: Port:${this.portNumber} direction=${direction}`);
      const data = new Uint8Array([this.portNumber, dir]);
      this.wsManager.send(0x10, data).then(
        (result) => {
          if (result[0] === 0) {
            errLog(
              [
                `GPIO${this.portNumber}への接続に失敗しました。`,
                '他のウィンドウ/タブなど別のプロセスが既に同じピン番号を使用している可能性があります。',
              ].join('')
            );
            reject(`GPIOPort(${this.portNumber}).export() error`);
          } else {
            resolve();
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  read(): Promise<Value> {
    return new Promise((resolve, reject) => {
      infoLog(`read: Port:${this.portNumber}`);
      const data = new Uint8Array([this.portNumber]);
      this.wsManager.send(0x12, data).then(
        (result) => {
          if (result[0] === 0) {
            errLog(`GPIO${this.portNumber}から値の取得に失敗しました。`);
            reject(`GPIOPort(${this.portNumber}).read() error`);
          } else {
            this.value = result[1] as Value;
            resolve(this.value);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  write(value: Value): Promise<void> {
    return new Promise((resolve, reject) => {
      infoLog(`write: Port:${this.portNumber} value=${value}`);
      const data = new Uint8Array([this.portNumber, value]);
      this.wsManager.send(0x11, data).then(
        (result) => {
          if (result[0] === 0) {
            errLog(`GPIO${this.portNumber}に値の設定に失敗しました。`);
            reject(`GPIOPort(${this.portNumber}).write() error`);
          } else {
            this.value = value;
            resolve();
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  unexport(): Promise<void> {
    return new Promise((resolve, reject) => {
      infoLog(`unexport: Port:${this.portNumber}`);
      const data = new Uint8Array([this.portNumber]);
      this.wsManager.send(0x13, data).then(
        (result) => {
          if (result[0] === 0) {
            errLog(`GPIO${this.portNumber}の開放に失敗しました。`);
            reject(`GPIOPort(${this.portNumber}).unexport() error`);
          } else {
            this.value = null;
            resolve();
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  set onchange(callback: ((value: Value) => void) | null) {
    this._onchange = callback;
  }

  get onchange(): ((value: Value) => void) | null {
    return this._onchange;
  }
}
