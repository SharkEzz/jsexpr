import { describe, it } from 'vitest';
import evaluate, { compile } from '.';

describe('Runtime', () => {
  it.concurrent('should execute simple expression', ({ expect }) => {
    const source = compile('true + false');
    expect(evaluate(source)).toEqual(1);
  });

  it.concurrent('should return true if array contains', ({ expect }) => {
    const source = compile('[1, 2] contains 1');
    expect(evaluate(source)).toEqual(true);
  });

  it.concurrent('should return false if array does not contain', ({ expect }) => {
    const source = compile('[1, 2] contains 5');
    expect(evaluate(source)).toEqual(false);
  });

  it.concurrent('should access object', ({ expect }) => {
    const source = compile('test.toto.titi');
    expect(evaluate(source, { test: { toto: { titi: 5 } } })).toEqual(5);
  });

  it.concurrent('should access complex object with strict equal', ({ expect }) => {
    const source = compile('user.id === 1');
    expect(evaluate(source, { user: { id: 1 } })).toEqual(true);
  });

  it.concurrent('should access complex object with loose equal', ({ expect }) => {
    const source = compile('user.id == 1');
    expect(evaluate(source, { user: { id: '1' } })).toEqual(true);
  });

  it.concurrent('should return true if "to" is in "toto"', ({ expect }) => {
    const source = compile('"to" in "toto"');
    expect(evaluate(source)).toEqual(true);
  });

  it.concurrent('should return true if 1 is greater than 0', ({ expect }) => {
    const source = compile('1 > 0');
    expect(evaluate(source)).toEqual(true);
  });

  it.concurrent('should return true if negated (1 is greater than 0)', ({ expect }) => {
    const source = compile('not (1 > 0)');
    expect(evaluate(source)).toEqual(false);
  });

  it.concurrent('should return true if "1" loose equal 1', ({ expect }) => {
    const source = compile('"1" == 1');
    expect(evaluate(source)).toEqual(true);
  });

  it.concurrent('should return true if Boolean(1)', ({ expect }) => {
    const source = compile('Boolean(1)');
    expect(evaluate(source)).toEqual(true);
  });
});
