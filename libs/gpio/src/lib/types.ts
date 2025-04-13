import { EventEmitter } from 'node:events';

export interface GPIOChangeEvent {
  port: number;
  value: number;
}

export type GPIOChangeEventHandler = (event: GPIOChangeEvent) => void;

export interface GPIOPort extends EventEmitter {
  port: number;
  exported: boolean;
  direction: 'in' | 'out';
  value: number;
  onchange?: GPIOChangeEventHandler;
  export(): Promise<void>;
  unexport(): Promise<void>;
  read(): Promise<number>;
  write(value: number): Promise<void>;
}

export interface GPIOAccess {
  ports: Map<number, GPIOPort>;
  onchange?: GPIOChangeEventHandler;
  unexportAll(): Promise<void>;
}

export interface GPIORouter {
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

export { GPIOPortMap } from './gpio-port-map';
