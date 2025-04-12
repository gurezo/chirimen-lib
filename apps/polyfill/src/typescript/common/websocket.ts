import { errLog, infoLog } from './logger';
import { ConnectionCallback, EventCallback } from './types';

export class WebSocketManager {
  private wss: WebSocket | null = null;
  private queue: Map<number, (data: Uint8Array) => void> = new Map();
  private onevents: Map<number, EventCallback> = new Map();
  private waitQueue: ConnectionCallback[] = [];
  private status = 0; // 0: init 1: wait connection 2: connected
  private session = 0;

  constructor(private serverURL: string) {}

  init(): void {
    infoLog('WebSocketManager.init()');
    this.waitQueue = [];
    this.queue = new Map();
    this.onevents = new Map();
    this.wss = new WebSocket(this.serverURL);
    this.wss.binaryType = 'arraybuffer';
    this.status = 1;

    this.wss.onopen = () => {
      infoLog('onopen');
      for (const callback of this.waitQueue) {
        callback(true);
      }
      this.status = 2;
      this.waitQueue = [];
    };

    this.wss.onerror = () => {
      errLog('WebSocket connection error');
      errLog(
        [
          'Node.jsプロセスとの接続に失敗しました。',
          'CHIRIMEN for Raspberry Piやその互換環境でのみ実行可能です。',
          'https://r.chirimen.org/tutorial',
        ].join('\n')
      );

      const length = this.waitQueue ? this.waitQueue.length : 0;
      for (let i = 0; i < length; i++) {
        this.waitQueue[i](false);
      }
      this.status = 0;
      this.waitQueue = [];
    };

    this.wss.onmessage = (mes) => {
      const buffer = new Uint8Array(mes.data);
      infoLog('on message:' + buffer);
      if (buffer[0] === 1) {
        this.receive(buffer);
      } else if (buffer[0] === 2) {
        this.onEvent(buffer);
      }
    };
  }

  send(func: number, data: Uint8Array): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (!(data instanceof Uint8Array)) {
        reject('type error: Please using with Uint8Array buffer.');
        return;
      }

      const length = data.length + 4;
      const buf = new Uint8Array(length);

      buf[0] = 1; // 1: API Request
      buf[1] = this.session & 0x00ff; // session LSB
      buf[2] = this.session >> 8; // session MSB
      buf[3] = func;

      for (let i = 0; i < data.length; i++) {
        buf[4 + i] = data[i];
      }

      infoLog('send message:' + buf);
      this.queue.set(this.session, (data) => {
        resolve(data);
      });

      if (this.wss) {
        this.wss.send(buf);
      }

      this.session++;
      if (this.session > 0xffff) {
        this.session = 0;
      }
    });
  }

  private receive(mes: Uint8Array): void {
    if (!(mes instanceof Uint8Array)) {
      errLog(new TypeError('Please using with Uint8Array buffer.'));
      errLog(
        new TypeError(
          [
            'Uint8Array以外を受信しました。',
            'Node.jsのプロセスに何らかの内部的な問題が生じている可能性があります。',
          ].join('')
        )
      );
      return;
    }

    const session = (mes[1] & 0x00ff) | (mes[2] << 8);
    const func = this.queue.get(session);
    if (typeof func === 'function') {
      infoLog('result');
      const data: number[] = [];
      for (let i = 0; i < mes.length - 4; i++) {
        data.push(mes[4 + i]);
      }
      func(new Uint8Array(data));
      this.queue.delete(session);
    } else {
      errLog(new TypeError('session=' + session + ' func=' + func));
      errLog(
        new TypeError(
          [
            '受信処理中に問題が発生しました。',
            '他のウィンドウ/タブなど別のプロセスと競合していないことを確認してください。',
          ].join('')
        )
      );
    }
  }

  registerEvent(f: number, port: number, func: EventCallback): void {
    const key = (f << 8) | port;
    this.onevents.set(key, func);
  }

  removeEvent(f: number, port: number): void {
    const key = (f << 8) | port;
    this.onevents.delete(key);
  }

  private onEvent(data: Uint8Array): void {
    if (!(data instanceof Uint8Array)) {
      errLog(new TypeError('Please using with Uint8Array buffer.'));
      errLog(
        new TypeError(
          [
            'Uint8Array以外を受信しました。',
            'Node.jsのプロセスに何らかの内部的な問題が生じている可能性があります。',
          ].join('')
        )
      );
      return;
    }

    // [0] Change Callback (2)
    // [1] session id LSB (0)
    // [2] session id MSB (0)
    // [3] function id (0x14)
    // [4] Port Number
    // [5] Value (0:LOW 1:HIGH)
    let key = data[3];
    key = (key << 8) | data[4];

    const func = this.onevents.get(key);
    if (typeof func === 'function') {
      infoLog('onevent');
      func(data);
    }
  }

  waitConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.status === 2) {
        resolve();
      } else if (this.status === 0) {
        reject();
      } else {
        this.waitQueue.push((result) => {
          if (result === true) {
            resolve();
          } else {
            reject();
          }
        });
      }
    });
  }
}
