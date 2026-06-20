import { describe, expect, it } from 'vitest';
import { parseUint16 } from './types';

describe('parseUint16', () => {
  it('parses valid values', () => {
    expect(parseUint16('0')).toBe(0);
    expect(parseUint16('65535')).toBe(65535);
  });

  it('throws for out of range values', () => {
    expect(() => parseUint16('-1')).toThrow(RangeError);
    expect(() => parseUint16('65536')).toThrow(RangeError);
  });
});
