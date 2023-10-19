import { describe, it } from 'vitest';
import { compile } from '.';

describe('Generator', () => {
  it.concurrent('should generate simple expression', ({ expect }) => {
    expect(compile('true + false')).toEqual('true+false');
  });

  it.concurrent('should generate array check expression', ({ expect }) => {
    expect(compile('5 in [1, 2]')).toEqual('[1,2].includes(5)');
  });

  it.concurrent('should generate array access expression', ({ expect }) => {
    expect(compile('[1, 2][0]')).toEqual('[1,2][0]');
  });

  it.concurrent('should generate object member access expression', ({ expect }) => {
    expect(compile('toto.titi.tata')).toEqual('toto.titi.tata');
  });

  it.concurrent('should generate unary expression', ({ expect }) => {
    expect(compile("1 + +'1'")).toEqual("1++'1'");
  });

  it.concurrent('should generate not expression', ({ expect }) => {
    expect(compile('!true == false')).toEqual('!(true)==false');
  });

  it.concurrent('should generate not expression with parenthesis', ({ expect }) => {
    expect(compile('!(true == false)')).toEqual('!(true==false)');
  });

  it.concurrent('should generate expression with not contains on string', ({ expect }) => {
    expect(compile("'toto' not contains 'a'")).toEqual("!('toto'.includes('a'))");
  });

  it.concurrent('should generate expression with not contains on string', ({ expect }) => {
    expect(compile('3 not in [1]')).toEqual('!([1].includes(3))');
  });

  it.concurrent('should generate function call with arguments', ({ expect }) => {
    expect(compile('add(1, 2)')).toEqual('add(1,2)');
  });

  it.concurrent('should generate function call with argument', ({ expect }) => {
    expect(compile('Boolean(1)')).toEqual('Boolean(1)');
  });
});
