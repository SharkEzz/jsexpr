import vm from 'node:vm';
import { Parser } from './frontend/parser';
import { generator } from './generator';

export * from './frontend/parser';
export * from './generator';

export function compile(source: string) {
  const parser = new Parser();
  const ast = parser.parse(source);
  return generator(ast);
}

export default function evaluate<T>(source: string, context?: Record<string, unknown>): T {
  const script = new vm.Script(source);
  const sandbox = vm.createContext(context);
  return script.runInContext(sandbox, { breakOnSigint: true, timeout: 5000 }) as T;
}
