import { Expression, NodeType } from './ast';
import { Parser } from './parser';

describe('Parser', () => {
  it('should parse simple expression', () => {
    const parser = new Parser();
    const ast = parser.parse('true + false');
    expect(ast).toEqual({
      kind: NodeType.BinaryExpression,
      left: {
        kind: NodeType.BooleanLiteral,
        value: true,
      },
      operator: '+',
      right: {
        kind: NodeType.BooleanLiteral,
        value: false,
      },
    });
  });

  it('should parse inverted boolean expression', () => {
    const parser = new Parser();
    const ast = parser.parse('!true === false');
    expect(ast).toEqual<Expression>({
      kind: NodeType.ComparisonExpression,
      operator: '===',
      left: {
        kind: NodeType.Not,
        expr: {
          kind: NodeType.BooleanLiteral,
          value: true,
        },
      },
      right: {
        kind: NodeType.BooleanLiteral,
        value: false,
      },
    });
  });

  it('should parse array access', () => {
    const parser = new Parser();
    const ast = parser.parse('toto[5]');
    expect(ast).toEqual<Expression>({
      kind: NodeType.ArrayAccessExpression,
      array: {
        kind: NodeType.Identifier,
        value: 'toto',
      },
      indexExpr: {
        kind: NodeType.NumericLiteral,
        value: 5,
      },
    });
  });

  it('should parse member expression', () => {
    const parser = new Parser();
    const ast = parser.parse('toto.titi');
    expect(ast).toEqual<Expression>({
      kind: NodeType.MemberExpr,
      object: {
        kind: NodeType.Identifier,
        value: 'toto',
      },
      property: {
        kind: NodeType.Identifier,
        value: 'titi',
      },
    });
  });

  it('should parse unary expression', () => {
    const parser = new Parser();
    const ast = parser.parse("+'1'");
    expect(ast).toEqual<Expression>({
      kind: NodeType.UnaryExpression,
      operator: '+',
      expr: {
        kind: NodeType.StringLiteral,
        value: '1',
      },
    });
  });

  it('should parse boolean expression with in literal', () => {
    const parser = new Parser();
    const ast = parser.parse('5 in [1, 2]');
    expect(ast).toEqual<Expression>({
      kind: NodeType.ComparisonExpression,
      operator: 'in',
      left: {
        kind: NodeType.NumericLiteral,
        value: 5,
      },
      right: {
        kind: NodeType.ArrayExpression,
        elements: [
          {
            kind: NodeType.NumericLiteral,
            value: 1,
          },
          {
            kind: NodeType.NumericLiteral,
            value: 2,
          },
        ],
      },
    });
  });

  it('should parse boolean expression with contains literal', () => {
    const parser = new Parser();
    const ast = parser.parse('[1, 2] contains 2');
    expect(ast).toEqual<Expression>({
      kind: NodeType.ComparisonExpression,
      operator: 'contains',
      left: {
        kind: NodeType.ArrayExpression,
        elements: [
          {
            kind: NodeType.NumericLiteral,
            value: 1,
          },
          {
            kind: NodeType.NumericLiteral,
            value: 2,
          },
        ],
      },
      right: {
        kind: NodeType.NumericLiteral,
        value: 2,
      },
    });
  });

  it('should parse expression', () => {
    const parser = new Parser();
    const ast = parser.parse('toto.titi === 1');
    expect(ast).toEqual<Expression>({
      kind: NodeType.ComparisonExpression,
      operator: '===',
      left: {
        kind: NodeType.MemberExpr,
        object: {
          kind: NodeType.Identifier,
          value: 'toto',
        },
        property: {
          kind: NodeType.Identifier,
          value: 'titi',
        },
      },
      right: {
        kind: NodeType.NumericLiteral,
        value: 1,
      },
    });
  });

  it('should throw on unexpected token', () => {
    const parser = new Parser();
    expect(() => parser.parse('1 +')).toThrowError();
  });

  it('should parse expression with correct prescedence', () => {
    const parser = new Parser();
    const ast = parser.parse("1 + (5 * 2) + +'1'");
    expect(ast).toEqual<Expression>({
      kind: NodeType.BinaryExpression,
      operator: '+',
      left: {
        kind: NodeType.BinaryExpression,
        left: {
          kind: NodeType.NumericLiteral,
          value: 1,
        },
        operator: '+',
        right: {
          kind: NodeType.BinaryExpression,
          left: {
            kind: NodeType.NumericLiteral,
            value: 5,
          },
          operator: '*',
          right: {
            kind: NodeType.NumericLiteral,
            value: 2,
          },
        },
      },
      right: {
        kind: NodeType.UnaryExpression,
        operator: '+',
        expr: {
          kind: NodeType.StringLiteral,
          value: '1',
        },
      },
    });
  });
});
