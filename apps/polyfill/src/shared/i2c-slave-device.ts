import { Router } from './router';
import { I2CSlaveDevice } from './types';

export function createI2CSlaveDevice(
  router: Router,
  portNumber: number,
  slaveAddress: number
): I2CSlaveDevice {
  const i2cSlaveDevice: I2CSlaveDevice = {
    portNumber,
    slaveAddress,

    read8: async (registerNumber: number): Promise<number> => {
      await router.waitConnection();
      const data = new Uint8Array(4);
      data[0] = portNumber;
      data[1] = slaveAddress & 0xff;
      data[2] = slaveAddress >> 8;
      data[3] = registerNumber;
      const result = await router.send(0x21, data);
      return result[0];
    },

    write8: async (registerNumber: number, value: number): Promise<void> => {
      await router.waitConnection();
      const data = new Uint8Array(5);
      data[0] = portNumber;
      data[1] = slaveAddress & 0xff;
      data[2] = slaveAddress >> 8;
      data[3] = registerNumber;
      data[4] = value;
      await router.send(0x22, data);
    },

    read16: async (registerNumber: number): Promise<number> => {
      await router.waitConnection();
      const data = new Uint8Array(4);
      data[0] = portNumber;
      data[1] = slaveAddress & 0xff;
      data[2] = slaveAddress >> 8;
      data[3] = registerNumber;
      const result = await router.send(0x23, data);
      return (result[0] << 8) | result[1];
    },

    write16: async (registerNumber: number, value: number): Promise<void> => {
      await router.waitConnection();
      const data = new Uint8Array(6);
      data[0] = portNumber;
      data[1] = slaveAddress & 0xff;
      data[2] = slaveAddress >> 8;
      data[3] = registerNumber;
      data[4] = (value >> 8) & 0xff;
      data[5] = value & 0xff;
      await router.send(0x24, data);
    },

    readByte: async (): Promise<number> => {
      await router.waitConnection();
      const data = new Uint8Array(3);
      data[0] = portNumber;
      data[1] = slaveAddress & 0xff;
      data[2] = slaveAddress >> 8;
      const result = await router.send(0x25, data);
      return result[0];
    },

    writeByte: async (value: number): Promise<void> => {
      await router.waitConnection();
      const data = new Uint8Array(4);
      data[0] = portNumber;
      data[1] = slaveAddress & 0xff;
      data[2] = slaveAddress >> 8;
      data[3] = value;
      await router.send(0x26, data);
    },

    readBytes: async (length: number): Promise<number[]> => {
      await router.waitConnection();
      const data = new Uint8Array(4);
      data[0] = portNumber;
      data[1] = slaveAddress & 0xff;
      data[2] = slaveAddress >> 8;
      data[3] = length;
      return await router.send(0x27, data);
    },

    writeBytes: async (data: number[]): Promise<void> => {
      await router.waitConnection();
      const sendData = new Uint8Array(3 + data.length);
      sendData[0] = portNumber;
      sendData[1] = slaveAddress & 0xff;
      sendData[2] = slaveAddress >> 8;
      for (let i = 0; i < data.length; i++) {
        sendData[3 + i] = data[i];
      }
      await router.send(0x28, sendData);
    },
  };

  return i2cSlaveDevice;
}
