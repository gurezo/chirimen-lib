import { OperationError } from '@chirimen/shared';

export class I2CSlaveDevice {
  constructor(
    private readonly portNumber: number,
    private readonly slaveAddress: number
  ) {}

  public async read8(registerNumber: number): Promise<number> {
    throw new OperationError('Not implemented');
  }

  public async write8(registerNumber: number, value: number): Promise<void> {
    throw new OperationError('Not implemented');
  }

  public async read16(registerNumber: number): Promise<number> {
    throw new OperationError('Not implemented');
  }

  public async write16(registerNumber: number, value: number): Promise<void> {
    throw new OperationError('Not implemented');
  }

  public async readByte(): Promise<number> {
    throw new OperationError('Not implemented');
  }

  public async writeByte(value: number): Promise<void> {
    throw new OperationError('Not implemented');
  }

  public async readBytes(length: number): Promise<Uint8Array> {
    throw new OperationError('Not implemented');
  }

  public async writeBytes(data: Uint8Array): Promise<void> {
    throw new OperationError('Not implemented');
  }

  public async readWord(): Promise<number> {
    throw new OperationError('Not implemented');
  }

  public async writeWord(value: number): Promise<void> {
    throw new OperationError('Not implemented');
  }

  public async readWords(length: number): Promise<Uint16Array> {
    throw new OperationError('Not implemented');
  }

  public async writeWords(data: Uint16Array): Promise<void> {
    throw new OperationError('Not implemented');
  }
}
