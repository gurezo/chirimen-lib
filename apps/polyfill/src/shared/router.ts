import { errLog, infoLog } from '@chirimen/shared';
import { Router as RouterType } from './types';

export type Router = RouterType;

export function createRouter(serverURL: string): Router {
  const router = {
    wss: null,
    queue: new Map(),
    onevents: new Map(),
    waitQueue: [],
    status: 0,
    session: 0,
  } as Router;

  router.init = function (serverURL: string): void {
    infoLog('bone.init()');
    this.waitQueue = [];
    this.queue = new Map();
    this.onevents = new Map();
    this.wss = new WebSocket(serverURL);
    this.wss.binaryType = 'arraybuffer';
    this.status = 1;

    this.wss.onopen = () => {
      infoLog('onopen');
      for (let cnt = 0; cnt < this.waitQueue.length; cnt++) {
        if (typeof this.waitQueue[cnt] === 'function') {
          this.waitQueue[cnt](true);
        }
      }
      this.status = 2;
      this.waitQueue = [];
    };

    this.wss.onerror = (error) => {
      errLog(error);
      errLog(
        [
          'Node.jsプロセスとの接続に失敗しました。',
          'CHIRIMEN for Raspberry Piやその互換環境でのみ実行可能です。',
          'https://r.chirimen.org/tutorial',
        ].join('\n')
      );
      const length = this.waitQueue ? this.waitQueue.length : 0;
      for (let cnt = 0; cnt < length; cnt++) {
        if (typeof this.waitQueue[cnt] === 'function') {
          this.waitQueue[cnt](false);
        }
      }
      this.status = 0;
      this.waitQueue = [];
    };

    this.wss.onmessage = (mes) => {
      const buffer = new Uint8Array(mes.data);
      infoLog('on message:' + buffer);
      if (buffer[0] == 1) {
        this.receive(buffer);
      } else if (buffer[0] == 2) {
        this.onEvent(buffer);
      }
    };
  };

  router.send = function (func: number, data: Uint8Array): Promise<number[]> {
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

      for (let cnt = 0; cnt < data.length; cnt++) {
        buf[4 + cnt] = data[cnt];
      }
      infoLog('send message:' + buf);
      this.queue.set(this.session, (data) => {
        resolve(data);
      });
      this.wss?.send(buf);
      this.session++;
      if (this.session > 0xffff) {
        this.session = 0;
      }
    });
  };

  router.receive = function (mes: Uint8Array): void {
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
      const data = [];
      for (let cnt = 0; cnt < mes.length - 4; cnt++) {
        data.push(mes[4 + cnt]);
      }
      func(data);
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
  };

  router.registerEvent = function (
    f: number,
    port: number,
    func: (data: Uint8Array) => void
  ): void {
    const key = (f << 8) | port;
    this.onevents.set(key, func);
  };

  router.removeEvent = function (f: number, port: number): void {
    const key = (f << 8) | port;
    this.onevents.delete(key);
  };

  router.onEvent = function (data: Uint8Array): void {
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

    const key = (data[3] << 8) | data[4];
    const func = this.onevents.get(key);
    if (typeof func === 'function') {
      infoLog('onevent');
      func(data);
    }
  };

  router.waitConnection = function (): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.status == 2) {
        resolve();
      } else if (this.status == 0) {
        reject();
      } else {
        this.waitQueue.push((result) => {
          if (result == true) {
            resolve();
          } else {
            reject();
          }
        });
      }
    });
  };

  router.init(serverURL);
  return router;
}
