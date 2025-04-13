import { describe, expect, it, vi } from 'vitest';
import { errLog, infoLog } from './logger';
import { Uint16Max } from './number-constants';
import { parseUint16 } from './number-utils';
import { sleep } from './promise-utils';

describe('utils', () => {
  describe('parseUint16', () => {
    it('should parse valid Uint16 values', () => {
      expect(parseUint16('0')).toBe(0);
      expect(parseUint16('65535')).toBe(Uint16Max);
      expect(parseUint16('12345')).toBe(12345);
    });

    it('should throw RangeError for invalid values', () => {
      expect(() => parseUint16('-1')).toThrow(RangeError);
      expect(() => parseUint16('65536')).toThrow(RangeError);
      expect(() => parseUint16('invalid')).toThrow(RangeError);
    });
  });

  describe('sleep', () => {
    it('should wait for the specified time', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });

  describe('infoLog', () => {
    it('should log info message', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      infoLog('test message');
      expect(consoleSpy).toHaveBeenCalledWith('info: test message');
      consoleSpy.mockRestore();
    });
  });

  describe('errLog', () => {
    it('should log error message as string', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      errLog('test error');
      expect(consoleSpy).toHaveBeenCalledWith('test error');
      consoleSpy.mockRestore();
    });

    it('should log error object', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      const error = new Error('test error');
      errLog(error);
      expect(consoleSpy).toHaveBeenCalledWith(error);
      consoleSpy.mockRestore();
    });
  });
});
