import { Parser } from './frontend/parser';
import { createGlobalEnv } from './runtime/environment';
import { evaluate as interpreter } from './runtime/interpreter';

export function evaluate(source: string, variables?: Record<string, unknown>) {
  const parser = new Parser();
  const ast = parser.parse(source);

  const env = createGlobalEnv();
  for (const varname in variables) {
    env.declareVarFromJS(varname, variables[varname]);
  }

  return interpreter(ast, env).value;
}
