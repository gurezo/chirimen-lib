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

export { GPIOPortMap } from './gpio-port-map';
