import { PortNumber } from '@chirimen/shared';
import { GPIOPort } from './types';

/**
 * Different from Web GPIO API specification.
 */
export class GPIOPortMap extends Map<PortNumber, GPIOPort> {}
