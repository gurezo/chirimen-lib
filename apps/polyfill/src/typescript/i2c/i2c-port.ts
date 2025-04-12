import { errLog, infoLog } from '../common/logger';
import { WebSocketManager } from '../common/websocket';

export class I2CPort {
  constructor(private portNumber: number, private wsManager: WebSocketManager) {
    this.init(portNumber);
  }

  private init(portNumber: number): void {
    this.portNumber = portNumber;
  }

  open(slaveAddress: number): Promise<I2CSlaveDevice> {
    return new Promise((resolve, reject) => {
      const device = new I2CSlaveDevice(
        this.portNumber,
        slaveAddress,
        this.wsManager
      );
      device.init().then(() => resolve(device), reject);
    });
  }
}

class I2CSlaveDevice {
  private portNumber: number;
  private slaveAddress: number;

  constructor(
    portNumber: number,
    slaveAddress: number,
    private wsManager: WebSocketManager
  ) {
    this.portNumber = portNumber;
    this.slaveAddress = slaveAddress;
  }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = new Uint8Array([this.slaveAddress, 1]);
      this.wsManager.send(0x20, data).then(
        (result) => {
          if (result[0] !== 0) {
            infoLog('I2CSlaveDevice.init() result OK');
            resolve();
          } else {
            errLog(`I2C-${this.portNumber}への接続に失敗しました。`);
            errLog('I2CSlaveDevice.init() result NG');
            reject('I2CSlaveDevice.init() result NG:');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  read8(registerNumber: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const data = new Uint8Array([this.slaveAddress, registerNumber, 1]);
      this.wsManager.send(0x23, data).then(
        (result) => {
          infoLog('I2CSlaveDevice.read8() result value=' + result);
          const readSize = result[0];
          if (readSize === 1) {
            resolve(result[1]);
          } else {
            this.printReadError();
            reject('read8() readSize unmatch : ' + readSize);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  read16(registerNumber: number): Promise<number> {
    return new Promise((resolve, reject) => {
      infoLog('I2CSlaveDevice.read16() registerNumber=' + registerNumber);
      const data = new Uint8Array([this.slaveAddress, registerNumber, 2]);
      this.wsManager.send(0x23, data).then(
        (result) => {
          infoLog('I2CSlaveDevice.write8() result value=' + result);
          const readSize = result[0];
          if (readSize === 2) {
            const res_l = result[1];
            const res_h = result[2];
            const res = res_l + (res_h << 8);
            resolve(res);
          } else {
            this.printReadError();
            reject('read16() readSize unmatch : ' + readSize);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  write8(registerNumber: number, value: number): Promise<void> {
    return new Promise((resolve, reject) => {
      infoLog(
        `I2CSlaveDevice.write8() registerNumber=${registerNumber} value=${value}`
      );
      const size = 2;
      const data = new Uint8Array([
        this.slaveAddress,
        size,
        registerNumber,
        value,
      ]);
      this.wsManager.send(0x21, data).then(
        (result) => {
          infoLog('I2CSlaveDevice.write8() result value=' + result);
          if (result[0] !== size) {
            this.printWriteError();
            reject('I2CSlaveAddress(' + this.slaveAddress + ').write8():error');
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

  write16(registerNumber: number, value: number): Promise<void> {
    return new Promise((resolve, reject) => {
      infoLog(
        `I2CSlaveDevice.write16() registerNumber=${registerNumber} value=${value}`
      );
      const value_L = value & 0x00ff;
      const value_H = (value >> 8) & 0x00ff;
      const size = 3;
      const data = new Uint8Array([
        this.slaveAddress,
        size,
        registerNumber,
        value_L,
        value_H,
      ]);
      this.wsManager.send(0x21, data).then(
        (result) => {
          infoLog('I2CSlaveDevice.write16() result value=' + result);
          if (result[0] !== size) {
            this.printWriteError();
            reject(
              'I2CSlaveAddress(' + this.slaveAddress + ').write16():error'
            );
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

  readByte(): Promise<number> {
    return new Promise((resolve, reject) => {
      const data = new Uint8Array([this.slaveAddress, 1]);
      this.wsManager.send(0x22, data).then(
        (result) => {
          infoLog('I2CSlaveDevice.readByte() result value=' + result);
          const readSize = result[0];
          if (readSize === 1) {
            resolve(result[1]);
          } else {
            this.printReadError();
            reject('readByte() readSize unmatch : ' + readSize);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  readBytes(length: number): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (typeof length !== 'number' || length > 127) {
        reject('readBytes() readSize error : ' + length);
      }
      const data = new Uint8Array([this.slaveAddress, length]);
      this.wsManager.send(0x22, data).then(
        (result) => {
          infoLog('I2CSlaveDevice.readBytes() result value=' + result);
          const readSize = result[0];
          if (readSize === length) {
            const buffer = result.slice(1); // readSizeを削除
            resolve(buffer);
          } else {
            this.printReadError();
            reject('readBytes() readSize unmatch : ' + readSize);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  writeByte(value: number): Promise<void> {
    return new Promise((resolve, reject) => {
      infoLog('I2CSlaveDevice.writeByte() value=' + value);
      const size = 1;
      const data = new Uint8Array([this.slaveAddress, size, value]);
      this.wsManager.send(0x21, data).then(
        (result) => {
          infoLog('I2CSlaveDevice.writeByte() result' + result);
          if (result[0] !== size) {
            this.printWriteError();
            reject(
              'I2CSlaveAddress(' + this.slaveAddress + ').writeByte():error'
            );
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

  writeBytes(buffer: Uint8Array): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (buffer.length == null) {
        reject('readBytes() parameter error : ' + buffer);
      }
      const arr = [this.slaveAddress, buffer.length];
      for (let i = 0; i < buffer.length; i++) {
        arr.push(buffer[i]);
      }
      const data = new Uint8Array(arr);
      this.wsManager.send(0x21, data).then(
        (result) => {
          infoLog('I2CSlaveDevice.writeBytes() result value=' + result);
          if (result[0] === buffer.length) {
            const resbuffer = result.slice(1); // readSizeを削除
            resolve(resbuffer);
          } else {
            this.printWriteError();
            reject('writeBytes() writeSize unmatch : ' + result[0]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  private printReadError(): void {
    errLog(
      [
        `i2c-${this.portNumber}(アドレス: 0x${this.slaveAddress.toString(16)})`,
        'からの値の取得に失敗しました。',
        'デバイスが正しく認識されており、アドレスに誤りがないことを確認してください。',
      ].join('')
    );
  }

  private printWriteError(): void {
    errLog(
      [
        `I2C-${this.portNumber}`,
        `(アドレス: 0x${this.slaveAddress.toString(16)})`,
        'への値の書き込みに失敗しました。',
        'デバイスが正しく認識されており、アドレスに誤りがないことを確認してください。',
      ].join(' ')
    );
  }
}
