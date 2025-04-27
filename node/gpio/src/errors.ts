import { AccessError, ArgumentError, PortOperationError } from '@chirimen/core';

export { AccessError, ArgumentError, PortOperationError };

/**
 * Invalid Access Error
 */
export class InvalidAccessError extends Error {
  /**
   * Creates an instance of InvalidAccessError.
   * @param message エラーメッセージ
   */
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAccessError';
  }
}

/**
 * Operation Error
 */
export class OperationError extends Error {
  /**
   * Creates an instance of OperationError.
   * @param message エラーメッセージ
   */
  constructor(message: string) {
    super(message);
    this.name = 'OperationError';
  }
}
