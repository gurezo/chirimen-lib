import { describe, expect, it } from 'vitest';
import { GPIOAccess } from './gpio-access';
import { GPIOPort } from './gpio-port';

describe('GPIOAccess', () => {
  it('creates an empty port map by default', () => {
    const access = new GPIOAccess();

    expect(access.ports.size).toBe(0);
  });

  it('uses the provided port map', () => {
    const ports = new Map([[0, new GPIOPort(0)]]);
    const access = new GPIOAccess(ports);

    expect(access.ports).toBe(ports);
    expect(access.ports.size).toBe(1);
  });
});
