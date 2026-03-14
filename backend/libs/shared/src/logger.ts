export interface ILogger {
  info(msg: string, meta?: Record<string, unknown>): void;
  warn(msg: string, meta?: Record<string, unknown>): void;
  error(msg: string, meta?: Record<string, unknown>): void;
  child(bindings: Record<string, string>): ILogger;
}

export class StdLogger implements ILogger {
  constructor(private prefix = 'musallih') {}

  private format(level: string, msg: string, meta?: Record<string, unknown>) {
    const entry = {
      time: new Date().toISOString(),
      level,
      msg: `[${this.prefix}] ${msg}`,
      ...meta,
    };
    return JSON.stringify(entry);
  }

  info(msg: string, meta?: Record<string, unknown>): void {
    console.log(this.format('info', msg, meta));
  }

  warn(msg: string, meta?: Record<string, unknown>): void {
    console.warn(this.format('warn', msg, meta));
  }

  error(msg: string, meta?: Record<string, unknown>): void {
    console.error(this.format('error', msg, meta));
  }

  child(bindings: Record<string, string>): ILogger {
    return new StdLogger(`${this.prefix}:${Object.values(bindings).join(':')}`);
  }
}
