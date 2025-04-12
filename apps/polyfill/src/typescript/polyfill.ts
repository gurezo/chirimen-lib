import { infoLog } from './common/logger';
import { WebSocketManager } from './common/websocket';
import { GPIOAccess } from './gpio/gpio-access';
import { I2CAccess } from './i2c/i2c-access';

const serverURL = 'wss://localhost:33330/';

// WebSocketManagerのインスタンスを作成
const wsManager = new WebSocketManager(serverURL);
wsManager.init();

// navigator.requestI2CAccessの実装
if (!navigator.requestI2CAccess) {
  navigator.requestI2CAccess = function () {
    return new Promise(function (resolve, reject) {
      wsManager
        .waitConnection()
        .then(() => {
          const i2cAccess = new I2CAccess(wsManager);
          infoLog('I2CAccess.resolve');
          resolve(i2cAccess);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };
}

// navigator.requestGPIOAccessの実装
if (!navigator.requestGPIOAccess) {
  navigator.requestGPIOAccess = function () {
    return new Promise(function (resolve, reject) {
      wsManager
        .waitConnection()
        .then(() => {
          const gpioAccess = new GPIOAccess(wsManager);
          infoLog('gpioAccess.resolve');
          resolve(gpioAccess);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };
}

// 共通ユーティリティ関数
export function sleep(ms: number): Promise<void> {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}
