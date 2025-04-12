import { openPromisified } from 'i2c-bus';
import { I2CSlaveDevice } from './i2c-slave-device';
import { OperationError } from './operation-error';
import { I2CSlaveAddress, PortNumber } from './types';
import { parseUint16 } from './utils';

/**
 * I2CPort クラス
 */
export class I2CPort {
  private readonly _portNumber: PortNumber;

  /**
   * Creates an instance of GPIOPort.
   * @param portNumber ポート番号
   */
  constructor(portNumber: PortNumber) {
    this._portNumber = parseUint16(portNumber.toString());
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
  get portName(): string {
    return `i2c-${this.portNumber}`;
  }

  /**
   * I2CSlave 接続デバイスオープン処理
   * @param slaveAddress 接続デバイス情報のアドレス
   * @return I2CSlaveDevice インスタンスの生成の完了
   */
  async open(slaveAddress: I2CSlaveAddress): Promise<I2CSlaveDevice> {
    const bus = await openPromisified(this.portNumber).catch(
      (error: unknown) => {
        throw new OperationError(
          error instanceof Error ? error.message : String(error)
        );
      }
    );

    return {
      slaveAddress,
      /**
       * @function
       * I2C 読み取り処理
       * @param registerNumber 読み取りアドレス
       */
      read8: (registerNumber) =>
        bus.readByte(slaveAddress, registerNumber).catch((error: unknown) => {
          throw new OperationError(
            error instanceof Error ? error.message : String(error)
          );
        }),
      /**
       * @function
       * I2C 読み取り処理
       * @param registerNumber 読み取りアドレス
       */
      read16: (registerNumber) =>
        bus.readWord(slaveAddress, registerNumber).catch((error: unknown) => {
          throw new OperationError(
            error instanceof Error ? error.message : String(error)
          );
        }),
      /**
       * @function
       * I2c s/I2c/I2C 書き込み処理
       * @param registerNumber 書き込みアドレス
       * @param byte 書き込みの値（バイト）
       */
      write8: async (registerNumber, byte) => {
        try {
          await bus.writeByte(slaveAddress, registerNumber, byte);
          return byte;
        } catch (error: unknown) {
          throw new OperationError(
            error instanceof Error ? error.message : String(error)
          );
        }
      },
      /**
       * @function
       * I2c bytes 書き込み処理
       * @param registerNumber 書き込みアドレス
       * @param word 書き込みの値（ワード）
       */
      write16: async (registerNumber, word) => {
        try {
          await bus.writeWord(slaveAddress, registerNumber, word);
          return word;
        } catch (error: unknown) {
          throw new OperationError(
            error instanceof Error ? error.message : String(error)
          );
        }
      },
      /**
       * @function
       * I2c bytes 読み取りバイト処理
       * Different from Web I2C API specification.
       */
      readByte: async () => {
        try {
          const byte = await bus.receiveByte(slaveAddress);
          return byte;
        } catch (error: unknown) {
          throw new OperationError(
            error instanceof Error ? error.message : String(error)
          );
        }
      },
      /**
       * @function
       * I2c bytes 読み取りバイト処理
       * Different from Web I2C API specification.
       * @param length 読み取る配列の長さ
       */
      readBytes: async (length) => {
        try {
          const { bytesRead, buffer } = await bus.i2cRead(
            slaveAddress,
            length,
            Buffer.allocUnsafe(length)
          );
          return new Uint8Array(buffer.slice(0, bytesRead));
        } catch (error: unknown) {
          throw new OperationError(
            error instanceof Error ? error.message : String(error)
          );
        }
      },
      /**
       * @function
       * I2c bytes 書き込みバイト処理
       * Different from Web I2C API specification.
       *  @param byte 書き込みの値
       */
      writeByte: async (byte) => {
        try {
          await bus.sendByte(slaveAddress, byte);
          return byte;
        } catch (error: unknown) {
          throw new OperationError(
            error instanceof Error ? error.message : String(error)
          );
        }
      },
      /**
       * @function
       * I2c bytes 書き込み処理
       * Different from Web I2C API specification.
       * @param bytes 書き込みの値の配列
       */
      writeBytes: async (bytes) => {
        try {
          const { bytesWritten, buffer } = await bus.i2cWrite(
            slaveAddress,
            bytes.length,
            Buffer.from(bytes)
          );
          return new Uint8Array(buffer.slice(0, bytesWritten));
        } catch (error: unknown) {
          throw new OperationError(
            error instanceof Error ? error.message : String(error)
          );
        }
      },
    };
  }
}
