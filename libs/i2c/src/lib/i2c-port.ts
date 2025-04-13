import { Router } from '@chirimen/shared';
import { I2CPort, I2CSlaveDevice } from './types';

export function createI2CPort(router: Router, portNumber: number): I2CPort {
  return {
    portNumber,
    portName: `i2c-${portNumber}`,
    async open(slaveAddress: number): Promise<I2CSlaveDevice> {
      return {
        slaveAddress,
        async read8(registerNumber: number): Promise<number> {
          const data = new Uint8Array([registerNumber]);
          const result = await router.send(0x02, data);
          return result[0];
        },
        async read16(registerNumber: number): Promise<number> {
          const data = new Uint8Array([registerNumber]);
          const result = await router.send(0x02, data);
          return (result[0] << 8) | result[1];
        },
        async write8(registerNumber: number, value: number): Promise<number> {
          const data = new Uint8Array([registerNumber, value]);
          await router.send(0x01, data);
          return value;
        },
        async write16(registerNumber: number, value: number): Promise<number> {
          const data = new Uint8Array([
            registerNumber,
            (value >> 8) & 0xff,
            value & 0xff,
          ]);
          await router.send(0x01, data);
          return value;
        },
        async readByte(): Promise<number> {
          const result = await router.send(0x06, new Uint8Array(0));
          return result[0];
        },
        async readBytes(length: number): Promise<Uint8Array> {
          const result = await router.send(0x08, new Uint8Array([length]));
          return new Uint8Array(result);
        },
        async writeByte(byte: number): Promise<number> {
          await router.send(0x05, new Uint8Array([byte]));
          return byte;
        },
        async writeBytes(bytes: Array<number>): Promise<Uint8Array> {
          const data = new Uint8Array(bytes);
          await router.send(0x07, data);
          return data;
        },
      };
    },
  };
}
