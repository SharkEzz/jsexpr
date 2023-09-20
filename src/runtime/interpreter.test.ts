import { Parser } from '../frontend/parser';
import { Environment, createGlobalEnv } from './environment';
import { evaluate } from './interpreter';
import { BooleanVal, MAKE_RUNTIME_VAL, MK_BOOL, MK_FUNC, NumberVal, RuntimeValue, ValueType } from './values';
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

  it('should evaluate nullish coalescing expression', () => {
    let ast = parser.parse('false ?? true');
    expect(evaluate(ast, env).value).toBe(false);

    ast = parser.parse('"coucou" ?? null');
    expect(evaluate(ast, env).value).toBe('coucou');

    ast = parser.parse('null ?? null');
    expect(evaluate(ast, env).value).toBe(null);
  });

  it('shoud evaluate function call expression without parameters', () => {
    const ast = parser.parse('toto()');
    env.declareVar(
      'toto',
      MK_FUNC(() => ({ type: ValueType.String, value: 'toto' })),
    );
    expect(evaluate(ast, env).value).toBe('toto');
  });

  it('shoud evaluate function call expression with parameters', () => {
    const ast = parser.parse('add(1, 1)');
    env.declareVar(
      'add',
      MK_FUNC((args) => MAKE_RUNTIME_VAL((args[0] as NumberVal).value + (args[1] as NumberVal).value)),
    );
    expect(evaluate(ast, env).value).toBe(2);
  });

  it.todo('should throw if an AST node is unsupported');
});
