import compile from '.';

describe('Generator', () => {
  it('should generate simple expression', () => {
    expect(compile('true + false')).toEqual('true+false');
  });

  it('should generate array check expression', () => {
    expect(compile('5 in [1, 2]')).toEqual('5 in [1,2]');
  });

  it('should generate array access expression', () => {
    expect(compile('[1, 2][0]')).toEqual('[1,2][0]');
  });

  it('should generate object member access expression', () => {
    expect(compile('toto.titi.tata')).toEqual('toto.titi.tata');
  });

  it('should generate unary expression', () => {
    expect(compile("1 + +'1'")).toEqual('1++"1"');
  });

  it('should generate not expression', () => {
    expect(compile('!true == false')).toEqual('!true==false');
  });
});
