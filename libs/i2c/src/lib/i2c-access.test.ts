import { describe, expect, it } from 'vitest';
import { I2CAccessManager } from './i2c-access';
import { I2CPortMap } from './types';

describe('I2CAccessManager', () => {
  it('should create an instance with default ports', () => {
    const manager = new I2CAccessManager();
    expect(manager.ports).toBeInstanceOf(I2CPortMap);
  });

  it('should create an instance with provided ports', () => {
    const ports = new I2CPortMap();
    const manager = new I2CAccessManager(ports);
    expect(manager.ports).toBe(ports);
  });

  it('should return the same ports instance', () => {
    const manager = new I2CAccessManager();
    const ports1 = manager.ports;
    const ports2 = manager.ports;
    expect(ports1).toBe(ports2);
  });
});
