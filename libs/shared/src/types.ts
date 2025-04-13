/** ポート番号 */
export type PortNumber = number;
/** ポート名 */
export type PortName = string;

/** ルーター */
export interface Router {
  wss: any;
  queue: Map<any, any>;
  onevents: Map<any, any>;
  waitQueue: undefined[];
  status: number;
  session: number;
  init: (serverURL: string) => void;
  send: (func: number, data: Uint8Array) => Promise<number[]>;
  receive: (mes: Uint8Array) => void;
  registerEvent: (
    f: number,
    port: number,
    func: (data: Uint8Array) => void
  ) => void;
  removeEvent: (f: number, port: number) => void;
  onEvent: (data: Uint8Array) => void;
  waitConnection: () => Promise<void>;
  onmessage: ((event: MessageEvent) => void) | null;
  close: () => void;
}
