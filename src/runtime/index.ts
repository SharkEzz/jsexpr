import vm from 'node:vm';

export class Runtime {
  public execute<T>(source: string, context?: Record<string, unknown>): T {
    const script = new vm.Script(source);
    const sandbox = vm.createContext(context);
    return script.runInContext(sandbox) as T;
  }
}
