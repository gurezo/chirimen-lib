import { libsChirimenI2c } from './libs-chirimen-i2c';

describe('libsChirimenI2c', () => {
  it('should work', () => {
    expect(libsChirimenI2c()).toEqual('libs-chirimen-i2c');
  });
});
