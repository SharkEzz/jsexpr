import { Parser } from '../frontend/parser';
import { Environment, createGlobalEnv } from './environment';
import { evaluate } from './interpreter';
import { BooleanVal, MK_BOOL, RuntimeValue, ValueType } from './values';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Interpreter', () => {
  let parser: Parser;
  let env: Environment;

  beforeEach(() => {
    parser = new Parser();
    env = createGlobalEnv();
  });

  it('should evaluate simple expression', () => {
    let result = evaluate(parser.parse('1 == 2'), env);
    expect(result).toMatchObject<BooleanVal>({ type: ValueType.Boolean, value: false });

    result = evaluate(parser.parse('1 == 1'), env);
    expect(result).toMatchObject<BooleanVal>({ type: ValueType.Boolean, value: true });
  });

  it('should throw if invalid', () => {
    const t = () => evaluate(parser.parse('1 =='), env);

    expect(t).toThrowError();
  });

  it('should evaluate identifier', () => {
    env.declareVar('test', MK_BOOL(true));
    const result = evaluate(parser.parse('test'), env);
    expect(result).toMatchObject<BooleanVal>({ type: ValueType.Boolean, value: true });
  });

  it('should evaluate negated comparison', () => {
    let result = evaluate(parser.parse('1 !== 2'), env);
    expect(result).toMatchObject<BooleanVal>({ type: ValueType.Boolean, value: true });

    result = evaluate(parser.parse('(!true) == (!true)'), env);
    expect(result).toMatchObject<BooleanVal>({ type: ValueType.Boolean, value: true });

    result = evaluate(parser.parse('(!true) == true'), env);
    expect(result).toMatchObject<BooleanVal>({ type: ValueType.Boolean, value: false });

    result = evaluate(parser.parse('!(!true) == true'), env);
    expect(result).toMatchObject<BooleanVal>({ type: ValueType.Boolean, value: true });
  });

  it('should evaluate member expression', () => {
    env.declareVar('object', {
      type: ValueType.Object,
      value: new Map<string, RuntimeValue>([
        [
          'toto',
          {
            type: ValueType.Object,
            value: new Map<string, RuntimeValue>([['titi', { type: ValueType.String, value: 'toto' }]]),
          },
        ],
      ]),
    });
    const ast = parser.parse('object.toto.titi');
    expect(evaluate(ast, env).value).toBe('toto');
  });

  it('should return true if not strict comparison', () => {
    const ast = parser.parse('1 == "1"');
    expect(evaluate(ast, env).value).toBe(true);
  });

  it('should return false if not strict comparison', () => {
    const ast = parser.parse('1 == "1"');
    expect(evaluate(ast, env).value).toBe(true);
  });

  it.todo('should throw if an AST node is unsupported');
});
