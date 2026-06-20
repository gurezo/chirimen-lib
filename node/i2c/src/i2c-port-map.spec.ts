import { describe, expect, it } from 'vitest';
import { I2CPortMap } from './i2c-port-map';
import { OperationError } from './operation-error';

describe('I2CPortMap', () => {
  it('returns undefined for invalid port names', () => {
    const map = new I2CPortMap();

    expect(map.getByName('invalid')).toBeUndefined();
  });
});

describe('OperationError', () => {
  it('sets the error name', () => {
    const error = new OperationError('test');

    expect(error.name).toBe('OperationError');
    expect(error.message).toBe('test');
  });
});
