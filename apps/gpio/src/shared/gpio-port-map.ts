import { PortNumber } from '@chirimen/shared';
import { GPIOPort } from './gpio-port';

/**
 * Different from Web GPIO API specification.
 */
export class GPIOPortMap extends Map<PortNumber, GPIOPort> {}
