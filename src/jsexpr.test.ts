import { evaluate } from '.';
import { describe, it, expect } from 'vitest';

describe('JsExpr', () => {
  it('should evaluate addition', () => {
    expect(evaluate('1 + 1')).toBe(2);
  });

  it('should evaluate substraction', () => {
    expect(evaluate('1 - 1')).toBe(0);
  });

  it('should evaluate modulo', () => {
    expect(evaluate('1 % 1')).toBe(0);
  });

  it('should evaluate complex operation', () => {
    expect(evaluate('(2 + (5 * 2)) / 2')).toBe(6);
  });

  it('should evaluate simple comparison expressions', () => {
    expect(evaluate('true === true')).toBe(true);
    expect(evaluate('true == true')).toBe(true);
    expect(evaluate('false == true')).toBe(false);
    expect(evaluate('false === true')).toBe(false);
    expect(evaluate('false === false')).toBe(true);
    expect(evaluate('false == false')).toBe(true);
    expect(evaluate('false == !false')).toBe(false);
    expect(evaluate('false != true')).toBe(true);
    expect(evaluate('false !== true')).toBe(true);
    expect(evaluate('false != "true"')).toBe(true);
    expect(evaluate('false !== "true"')).toBe(true);
    expect(evaluate('false == "false"')).toBe(false);
    expect(evaluate('false === "false"')).toBe(false);
    expect(evaluate('(!true) === (!!false)')).toBe(true);
  });

  it('should access JS object and return the value', () => {
    const result = evaluate('object.titi', {
      object: {
        titi: 'toto',
      },
    });

    expect(result).toBe('toto');
  });
});
