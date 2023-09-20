import { BinaryExpr, CallExpr, Comparison, LogicalExpr, NodeType, Not, NumericLiteral } from './ast';
import { Parser } from './parser';
import { TokenType } from './tokens';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  it('should parse simple expression', () => {
    const ast = parser.parse('user.id == 1') as Comparison;
    expect(ast.kind).toBe(NodeType.Comparison);
    expect(ast.left).toMatchObject<Comparison['left']>({
      kind: NodeType.MemberExpr,
      object: { kind: NodeType.Identifier, symbol: 'user' },
      property: { kind: NodeType.Identifier, symbol: 'id' },
    });
    expect(ast.right).toMatchObject<NumericLiteral>({ kind: NodeType.NumericLiteral, value: 1 });
    expect(ast.operator).toBe(TokenType.Equal);
  });

  it('should parse simple negated expression', () => {
    expect(parser.parse('1 !== 1')).toMatchObject<Comparison>({
      kind: NodeType.Comparison,
      left: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
      right: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
      operator: TokenType.NotStrictEqual,
    });

    expect(parser.parse('(!true) === !true')).toMatchObject<Comparison>({
      kind: NodeType.Comparison,
      left: { kind: NodeType.Not, expr: { kind: NodeType.BooleanLiteral, value: true } } as Not,
      right: { kind: NodeType.Not, expr: { kind: NodeType.BooleanLiteral, value: true } } as Not,
      operator: TokenType.StrictEqual,
    });
  });

  it('should parse additive expression', () => {
    expect(parser.parse('1 + 1')).toMatchObject<BinaryExpr>({
      kind: NodeType.BinaryExpr,
      left: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
      right: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
      operator: '+',
    });

    expect(parser.parse('1 + (1 + 1)')).toMatchObject<BinaryExpr>({
      kind: NodeType.BinaryExpr,
      left: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
      right: {
        kind: NodeType.BinaryExpr,
        left: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
        right: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
        operator: '+',
      } as BinaryExpr,
      operator: '+',
    });
  });

  it('should parse multiplicative expression', () => {
    expect(parser.parse('1 * 1')).toMatchObject<BinaryExpr>({
      kind: NodeType.BinaryExpr,
      left: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
      right: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
      operator: '*',
    });

    expect(parser.parse('1 + (1 * 1)')).toMatchObject<BinaryExpr>({
      kind: NodeType.BinaryExpr,
      left: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
      right: {
        kind: NodeType.BinaryExpr,
        left: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
        right: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
        operator: '*',
      } as BinaryExpr,
      operator: '+',
    });

    expect(parser.parse('1 / (1 * 1)')).toMatchObject<BinaryExpr>({
      kind: NodeType.BinaryExpr,
      left: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
      right: {
        kind: NodeType.BinaryExpr,
        left: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
        right: { kind: NodeType.NumericLiteral, value: 1 } as NumericLiteral,
        operator: '*',
      } as BinaryExpr,
      operator: '/',
    });
  });

  it('should throw if expression is invalid', () => {
    const t = () => {
      parser.parse('1 =');
    };

    expect(t).toThrowError();
  });

  it('should parse expression with nullish coalesing operator', () => {
    expect(parser.parse('false ?? true')).toMatchObject<LogicalExpr>({
      kind: NodeType.LogicalExpr,
      left: { kind: NodeType.BooleanLiteral, value: false },
      right: { kind: NodeType.BooleanLiteral, value: true },
      operator: '??',
    });
  });

  it('should parse call expression without parameters', () => {
    const ast = parser.parse('toto()');
    expect(ast).toMatchObject<CallExpr>({
      kind: NodeType.CallExpr,
      caller: { kind: NodeType.Identifier, symbol: 'toto' },
      args: [],
    });
  });

  it('should parse call expression with parameters', () => {
    const ast = parser.parse('toto(coucou, 1 + 1)');
    expect(ast).toMatchObject<CallExpr>({
      kind: NodeType.CallExpr,
      caller: { kind: NodeType.Identifier, symbol: 'toto' },
      args: [
        {
          kind: NodeType.Identifier,
          symbol: 'coucou',
        },
        {
          kind: NodeType.BinaryExpr,
          left: { kind: NodeType.NumericLiteral, value: 1 },
          right: { kind: NodeType.NumericLiteral, value: 1 },
          operator: '+',
        },
      ],
    });
  });
});
