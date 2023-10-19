import evaluate, { compile } from '.';

describe('Runtime', () => {
  it('should execute simple expression', () => {
    const source = compile('true + false');
    expect(evaluate(source)).toEqual(1);
  });

  it('should return true if array contains', () => {
    const source = compile('[1, 2] contains 1');
    expect(evaluate(source)).toEqual(true);
  });

  it('should return false if array does not contain', () => {
    const source = compile('[1, 2] contains 5');
    expect(evaluate(source)).toEqual(false);
  });

  it('should access object', () => {
    const source = compile('test.toto.titi');
    expect(evaluate(source, { test: { toto: { titi: 5 } } })).toEqual(5);
  });

  it('should access complex object with strict equal', () => {
    const source = compile('user.id === 1');
    expect(evaluate(source, { user: { id: 1 } })).toEqual(true);
  });

  it('should access complex object with loose equal', () => {
    const source = compile('user.id == 1');
    expect(evaluate(source, { user: { id: '1' } })).toEqual(true);
  });

  it('should return true if "to" is in "toto"', () => {
    const source = compile('"to" in "toto"');
    expect(evaluate(source)).toEqual(true);
  });

  it('should return true if 1 is greater than 0', () => {
    const source = compile('1 > 0');
    expect(evaluate(source)).toEqual(true);
  });

  it('should return true if negated (1 is greater than 0)', () => {
    const source = compile('not (1 > 0)');
    expect(evaluate(source)).toEqual(false);
  });

  it('should return true if "1" loose equal 1', () => {
    const source = compile('"1" == 1');
    expect(evaluate(source)).toEqual(true);
  });

  it('should return true if Boolean(1)', () => {
    const source = compile('Boolean(1)');
    expect(evaluate(source)).toEqual(true);
  });
});
