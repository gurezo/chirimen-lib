export interface I2CPort {
  portNumber: number;
  open: (slaveAddress: number) => Promise<I2CSlaveDevice>;
}

export interface I2CSlaveDevice {
  portNumber: number;
  slaveAddress: number;
  read8: (registerNumber: number) => Promise<number>;
  write8: (registerNumber: number, value: number) => Promise<void>;
  read16: (registerNumber: number) => Promise<number>;
  write16: (registerNumber: number, value: number) => Promise<void>;
  readByte: () => Promise<number>;
  writeByte: (value: number) => Promise<void>;
  readBytes: (length: number) => Promise<number[]>;
  writeBytes: (data: number[]) => Promise<void>;
}
