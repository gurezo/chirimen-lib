import { GPIOPort } from './gpio-port';
import { PortNumber } from './types';

/**
 * Different from Web GPIO API specification.
 */
export class GPIOPortMap extends Map<PortNumber, GPIOPort> {}
