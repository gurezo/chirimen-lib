import { PortName, PortNumber } from './types';

/**
 * ポート番号からポート名を生成
 * @param portNumber ポート番号
 * @returns ポート名
 */
export function generatePortName(portNumber: PortNumber): PortName {
  return `port${portNumber}`;
}

/**
 * ポート名からポート番号を抽出
 * @param portName ポート名
 * @returns ポート番号
 */
export function extractPortNumber(portName: PortName): PortNumber {
  const match = portName.match(/^port(\d+)$/);
  if (!match) {
    throw new Error(`Invalid port name: ${portName}`);
  }
  return parseInt(match[1], 10);
}
