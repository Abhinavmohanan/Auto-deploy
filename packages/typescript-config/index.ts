export type Workspace = {
  name: string;
  version: string;
};

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  log: (log: string) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  subscribe: (channel: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
