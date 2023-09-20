import { Environment, createGlobalEnv } from './environment';
import { MK_BOOL, NullVal, ValueType } from './values';
import { describe, it, expect } from 'vitest';

describe('Environment', () => {
  it('should set and retrieve a variable without parent', () => {
    const env = createGlobalEnv();
    env.declareVar('test', MK_BOOL(true));

    expect(env.lookupVar('test').value).toBe(true);
  });

  it('should retrieve a variable declared inside a parent env', () => {
    const parentEnv = createGlobalEnv();
    parentEnv.declareVar('test', MK_BOOL(false));

    const env = new Environment(parentEnv);

    expect(env.lookupVar('test').value).toBe(false);
  });

  it("shouldn't retrieve a variable that doesn't exist", () => {
    const env = createGlobalEnv();
    const t = () => env.lookupVar('test');
    expect(t).toThrowError('Cannot resolve variable as it does not exist');
  });

  it("shouldn't retrieve a variable that doesn't exist with parent", () => {
    const parentEnv = createGlobalEnv();
    const env = new Environment(parentEnv);
    const t = () => env.lookupVar('test');
    expect(t).toThrowError('Cannot resolve variable as it does not exist');
  });

  it('can add a javascript object', () => {
    const env = createGlobalEnv();
    const obj = { toto: 'titi' };
    expect(env.declareVarFromJS('test', obj).type).toBe(ValueType.Object);
  });

  it('can add a null object', () => {
    const env = createGlobalEnv();
    const value = env.declareVarFromJS('test', null);

    expect(value).toMatchObject<NullVal>({
      type: ValueType.Null,
      value: null,
    });
  });
});
