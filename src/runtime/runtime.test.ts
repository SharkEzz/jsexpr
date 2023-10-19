import { Runtime } from '.';
import compile from '..';

describe('Runtime', () => {
  const runtime = new Runtime();

  it('should execute simple expression', () => {
    const source = compile('true + false');
    expect(runtime.execute(source)).toEqual(1);
  });

  it('should return true if array contains', () => {
    const source = compile('[1, 2] contains 1');
    expect(runtime.execute(source)).toEqual(true);
  });

  it('should return false if array does not contain', () => {
    const source = compile('[1, 2] contains 5');
    expect(runtime.execute(source)).toEqual(false);
  });

  it('should access object', () => {
    const source = compile('test.toto.titi');
    expect(runtime.execute(source, { test: { toto: { titi: 5 } } })).toEqual(5);
  });

  it('should access complex object with strict equal', () => {
    const source = compile('user.id === 1');
    expect(runtime.execute(source, { user: { id: 1 } })).toEqual(true);
  });

  it('should access complex object with loose equal', () => {
    const source = compile('user.id == 1');
    expect(runtime.execute(source, { user: { id: '1' } })).toEqual(true);
  });
});
