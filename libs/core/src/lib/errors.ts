/** ポート操作エラー */
export class PortOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PortOperationError';
  }
}

/** アクセスエラー */
export class AccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccessError';
  }
}

/** 引数エラー */
export class ArgumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArgumentError';
  }
}
