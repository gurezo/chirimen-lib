export type PortNumber = number;
export type PortName = string;
export type Uint16Max = 65535;
export type I2CSlaveAddress = number;
export type I2CPortMapSizeMax = 8;

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
