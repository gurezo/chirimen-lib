import { Router } from '@chirimen/shared';
import { I2CSlaveDevice } from './types';

export class I2CSlaveDeviceDriver implements I2CSlaveDevice {
  constructor(
    private readonly router: Router,
    public readonly slaveAddress: number
  ) {}

  async read8(registerNumber: number): Promise<number> {
    const data = new Uint8Array([registerNumber]);
    const result = await this.router.send(0x02, data);
    return result[0];
  }

  async read16(registerNumber: number): Promise<number> {
    const data = new Uint8Array([registerNumber]);
    const result = await this.router.send(0x02, data);
    return (result[0] << 8) | result[1];
  }

  async write8(registerNumber: number, value: number): Promise<number> {
    const data = new Uint8Array([registerNumber, value]);
    await this.router.send(0x01, data);
    return value;
  }

  async write16(registerNumber: number, value: number): Promise<number> {
    const data = new Uint8Array([
      registerNumber,
      (value >> 8) & 0xff,
      value & 0xff,
    ]);
    await this.router.send(0x01, data);
    return value;
  }

  async readByte(): Promise<number> {
    const result = await this.router.send(0x06, new Uint8Array(0));
    return result[0];
  }

  async readBytes(length: number): Promise<Uint8Array> {
    const result = await this.router.send(0x08, new Uint8Array([length]));
    return new Uint8Array(result);
  }

  async writeByte(byte: number): Promise<number> {
    await this.router.send(0x05, new Uint8Array([byte]));
    return byte;
  }

  async writeBytes(bytes: Array<number>): Promise<Uint8Array> {
    const data = new Uint8Array(bytes);
    await this.router.send(0x07, data);
    return data;
  }
}
