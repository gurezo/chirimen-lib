export type PortNumber = number;
export type PortName = string;
export const Uint16Max = 65535;
export const I2CSlaveAddress = {
  MIN: 0,
  MAX: 127,
} as const;
export const I2CPortMapSizeMax = 8;

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
