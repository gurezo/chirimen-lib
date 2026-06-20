import { describe, expect, it } from 'vitest';
import { GpioOffset } from './constants';
import { InvalidAccessError } from './errors';
import { GPIOPort } from './gpio-port';

describe('GPIOPort', () => {
  it('derives port name from port number', () => {
    const port = new GPIOPort(1);

    expect(port.portName).toBe(`gpio${1 + GpioOffset}`);
  });

  it('rejects invalid export direction', async () => {
    const port = new GPIOPort(0);

    await expect(port.export('up' as 'in')).rejects.toThrow(InvalidAccessError);
  });
});
