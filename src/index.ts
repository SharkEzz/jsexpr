import { Parser } from './frontend/parser';
import { generator } from './generator';

export * from './frontend/parser';
export * from './generator';
export * from './runtime';

export default function compile(source: string) {
  const parser = new Parser();
  const ast = parser.parse(source);
  return generator(ast);
}
