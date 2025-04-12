export const parseUint16 = (value: number): number => {
  if (value < 0 || value > 65535) {
    throw new Error('Value out of range');
  }
  return value;
};
