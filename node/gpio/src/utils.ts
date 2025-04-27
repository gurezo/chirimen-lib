import {
  extractPortNumber,
  generatePortName,
  parseUint16,
  Uint16Max,
} from '@chirimen/core';

/**
 * スリープ処理
 * @param ms ミリ秒
 * @return Promise
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { extractPortNumber, generatePortName, parseUint16, Uint16Max };
