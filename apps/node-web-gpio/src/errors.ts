/**
 * 無効なアクセスエラー
 */
export class InvalidAccessError extends Error {
  /**
   * Creates an instance of InvalidAccessError.
   * @param message エラーメッセージ
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * 操作エラー
 */
export class OperationError extends Error {
  /**
   * Creates an instance of OperationError.
   * @param message エラーメッセージ
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
