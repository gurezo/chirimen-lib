import { OperationError, Uint16Max } from '@chirimen-lib/shared';

export class I2CSlaveDevice {
  constructor(
    private readonly portNumber: number,
    private readonly slaveAddress: number
  ) {}

  public async read8(registerNumber: number): Promise<number> {
    if (registerNumber < 0 || registerNumber > 255) {
      throw new OperationError('Invalid register number');
    }
    // TODO: Implement actual I2C communication
    return 0;
  }

  public async write8(registerNumber: number, value: number): Promise<void> {
    if (registerNumber < 0 || registerNumber > 255) {
      throw new OperationError('Invalid register number');
    }
    if (value < 0 || value > 255) {
      throw new OperationError('Invalid value');
    }
    // TODO: Implement actual I2C communication
  }

  public async read16(registerNumber: number): Promise<number> {
    if (registerNumber < 0 || registerNumber > 255) {
      throw new OperationError('Invalid register number');
    }
    // TODO: Implement actual I2C communication
    return 0;
  }

  public async write16(registerNumber: number, value: number): Promise<void> {
    if (registerNumber < 0 || registerNumber > 255) {
      throw new OperationError('Invalid register number');
    }
    if (value < 0 || value > Uint16Max) {
      throw new OperationError('Invalid value');
    }
    // TODO: Implement actual I2C communication
  }

  public async readByte(): Promise<number> {
    // TODO: Implement actual I2C communication
    return 0;
  }

  public async writeByte(value: number): Promise<void> {
    if (value < 0 || value > 255) {
      throw new OperationError('Invalid value');
    }
    // TODO: Implement actual I2C communication
  }

  public async readBytes(length: number): Promise<Uint8Array> {
    if (length <= 0) {
      throw new OperationError('Invalid length');
    }
    // TODO: Implement actual I2C communication
    return new Uint8Array(length);
  }

  public async writeBytes(data: Uint8Array): Promise<void> {
    if (data.length === 0) {
      throw new OperationError('Empty data');
    }
    // TODO: Implement actual I2C communication
  }

  public async readWord(): Promise<number> {
    // TODO: Implement actual I2C communication
    return 0;
  }

  public async writeWord(value: number): Promise<void> {
    if (value < 0 || value > Uint16Max) {
      throw new OperationError('Invalid value');
    }
    // TODO: Implement actual I2C communication
  }

  public async readWords(length: number): Promise<Uint16Array> {
    if (length <= 0) {
      throw new OperationError('Invalid length');
    }
    // TODO: Implement actual I2C communication
    return new Uint16Array(length);
  }

  public async writeWords(data: Uint16Array): Promise<void> {
    if (data.length === 0) {
      throw new OperationError('Empty data');
    }
    for (const value of data) {
      if (value > Uint16Max) {
        throw new OperationError('Invalid value in data');
      }
    }
    // TODO: Implement actual I2C communication
  }
}
