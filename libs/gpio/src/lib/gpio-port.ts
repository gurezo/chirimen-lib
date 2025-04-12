import { OperationError } from '@chirimen/shared';

export type GPIODirection = 'in' | 'out';
export type GPIOValue = 0 | 1;

export class GPIOPort {
  private direction: GPIODirection = 'in';
  private value: GPIOValue = 0;

  constructor(private readonly portNumber: number) {}

  public async export(direction: GPIODirection): Promise<void> {
    if (direction !== 'in' && direction !== 'out') {
      throw new OperationError('Invalid direction');
    }

    this.direction = direction;
  }

  public async read(): Promise<GPIOValue> {
    return this.value;
  }

  public async write(value: GPIOValue): Promise<void> {
    if (this.direction !== 'out') {
      throw new OperationError('Port is not configured as output');
    }

    if (value !== 0 && value !== 1) {
      throw new OperationError('Invalid value');
    }

    this.value = value;
  }

  public async unexport(): Promise<void> {
    this.direction = 'in';
    this.value = 0;
  }
}
