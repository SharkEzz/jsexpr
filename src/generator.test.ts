import { compile } from '.';

describe('Generator', () => {
  it('should generate simple expression', () => {
    expect(compile('true + false')).toEqual('true+false');
  });

  it('should generate array check expression', () => {
    expect(compile('5 in [1, 2]')).toEqual('[1,2].includes(5)');
  });

  it('should generate array access expression', () => {
    expect(compile('[1, 2][0]')).toEqual('[1,2][0]');
  });

  it('should generate object member access expression', () => {
    expect(compile('toto.titi.tata')).toEqual('toto.titi.tata');
  });

  it('should generate unary expression', () => {
    expect(compile("1 + +'1'")).toEqual("1++'1'");
  });

  it('should generate not expression', () => {
    expect(compile('!true == false')).toEqual('!(true)==false');
  });

  it('should generate not expression with parenthesis', () => {
    expect(compile('!(true == false)')).toEqual('!(true==false)');
  });

  it('should generate expression with not contains on string', () => {
    expect(compile("'toto' not contains 'a'")).toEqual("!('toto'.includes('a'))");
  });

  it('should generate expression with not contains on string', () => {
    expect(compile('3 not in [1]')).toEqual('!([1].includes(3))');
  });

  it('should generate function call with arguments', () => {
    expect(compile('add(1, 2)')).toEqual('add(1,2)');
  });

  it('should generate function call with argument', () => {
    expect(compile('Boolean(1)')).toEqual('Boolean(1)');
  });
});
