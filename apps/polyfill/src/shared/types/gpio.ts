export interface GPIOAccess {
  ports: Map<number, GPIOPort>;
  unexportAll: () => Promise<void>;
}

export interface GPIOPort {
  portNumber: number;
  direction: string;
  export: () => Promise<void>;
  unexport: () => Promise<void>;
  read: () => Promise<number>;
  write: (value: number) => Promise<void>;
  onchange: ((value: number) => void) | null;
}
