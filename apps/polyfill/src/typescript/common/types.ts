export type Direction = 'in' | 'out';
export type Value = 0 | 1;

export interface WebSocketMessage {
  type: number;
  session: number;
  functionId: number;
  data: Uint8Array;
}

export interface EventCallback {
  (data: Uint8Array): void;
}

export interface ConnectionCallback {
  (result: boolean): void;
}

// Navigatorインターフェースの拡張
declare global {
  interface Navigator {
    requestI2CAccess(): Promise<I2CAccess>;
    requestGPIOAccess(): Promise<GPIOAccess>;
  }
}

// I2CAccessとGPIOAccessのインターフェースを定義
export interface I2CAccess {
  ports: Map<number, I2CPort>;
}

export interface GPIOAccess {
  ports: Map<number, GPIOPort>;
  unexportAll(): Promise<void>;
}

export interface I2CPort {
  open(slaveAddress: number): Promise<I2CSlaveDevice>;
}

export interface I2CSlaveDevice {
  read8(registerNumber: number): Promise<number>;
  read16(registerNumber: number): Promise<number>;
  write8(registerNumber: number, value: number): Promise<void>;
  write16(registerNumber: number, value: number): Promise<void>;
  readByte(): Promise<number>;
  readBytes(length: number): Promise<Uint8Array>;
  writeByte(value: number): Promise<void>;
  writeBytes(buffer: Uint8Array): Promise<Uint8Array>;
}

export interface GPIOPort {
  export(direction: Direction): Promise<void>;
  read(): Promise<Value>;
  write(value: Value): Promise<void>;
  unexport(): Promise<void>;
  onchange: ((value: Value) => void) | null;
}
