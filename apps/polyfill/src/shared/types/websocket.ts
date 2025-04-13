export interface WebSocketRouter {
  wss: WebSocket | null;
  queue: Map<number, (data: number[]) => void>;
  onevents: Map<number, (data: Uint8Array) => void>;
  waitQueue: Array<(result: boolean) => void>;
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
}
