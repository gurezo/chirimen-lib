import { GPIOPort } from './gpio-port';

export class GPIOPortMap extends Map<number, GPIOPort> {
  constructor(entries?: readonly (readonly [number, GPIOPort])[]) {
    super(entries);
  }
}
