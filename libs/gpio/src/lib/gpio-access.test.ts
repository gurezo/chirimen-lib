import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';
import { createGPIOAccess, NodeGPIOAccess, Router } from './gpio-access';
import { GPIOPort, GPIOPortMap } from './types';

describe('NodeGPIOAccess', () => {
  it('should create an instance with default ports', () => {
    const access = new NodeGPIOAccess();
    expect(access).toBeInstanceOf(EventEmitter);
    expect(access.ports).toBeInstanceOf(GPIOPortMap);
  });

  it('should create an instance with provided ports', () => {
    const ports = new GPIOPortMap();
    const access = new NodeGPIOAccess(ports);
    expect(access.ports).toBe(ports);
  });

  it('should handle port change events', () => {
    const access = new NodeGPIOAccess();
    const mockCallback = vi.fn();
    access.onchange = mockCallback;

    const event = { port: 1, value: 1 };
    access.emit('change', event);

    expect(mockCallback).toHaveBeenCalledWith(event);
  });

  it('should unexport all ports', async () => {
    const mockPort: GPIOPort = {
      port: 1,
      exported: true,
      direction: 'out',
      value: 0,
      on: vi.fn(),
      emit: vi.fn(),
      addListener: vi.fn(),
      once: vi.fn(),
      removeListener: vi.fn(),
      off: vi.fn(),
      removeAllListeners: vi.fn(),
      setMaxListeners: vi.fn(),
      getMaxListeners: vi.fn(),
      listeners: vi.fn(),
      rawListeners: vi.fn(),
      listenerCount: vi.fn(),
      prependListener: vi.fn(),
      prependOnceListener: vi.fn(),
      eventNames: vi.fn(),
      export: vi.fn().mockResolvedValue(undefined),
      unexport: vi.fn().mockResolvedValue(undefined),
      read: vi.fn().mockResolvedValue(0),
      write: vi.fn().mockResolvedValue(undefined),
    };
    const ports = new GPIOPortMap();
    ports.set(1, mockPort);

    const access = new NodeGPIOAccess(ports);
    await access.unexportAll();

    expect(mockPort.unexport).toHaveBeenCalled();
  });
});

describe('createGPIOAccess', () => {
  it('should create GPIOAccess with router', () => {
    const mockRouter: Router = {
      waitConnection: vi.fn().mockResolvedValue(undefined),
      send: vi.fn().mockResolvedValue(undefined),
    };

    const access = createGPIOAccess(mockRouter);
    expect(access.ports).toBeInstanceOf(GPIOPortMap);
    expect(access.unexportAll).toBeInstanceOf(Function);
  });

  it('should call router methods during unexportAll', async () => {
    const mockRouter: Router = {
      waitConnection: vi.fn().mockResolvedValue(undefined),
      send: vi.fn().mockResolvedValue(undefined),
    };

    const access = createGPIOAccess(mockRouter);
    await access.unexportAll();

    expect(mockRouter.waitConnection).toHaveBeenCalled();
    expect(mockRouter.send).toHaveBeenCalledWith(0x11, expect.any(Uint8Array));
  });
});
