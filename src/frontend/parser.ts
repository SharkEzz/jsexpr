import { BinaryExpr, Expressions, NodeType } from './ast';
import { tokenize } from './lexer';
import { Token, TokenType } from './tokens';

export class Parser {
  private tokens: Token[] = [];

  parse(source: string) {
    this.tokens = tokenize(source);

    const ast = this.parse_expr();

    if (process.env.DEBUG_AST === 'true') console.log(ast);

    return ast;
  }

  private at() {
    return this.tokens.at(0);
  }

  private eat() {
    const token = this.tokens.shift();
    if (!token) throw new Error('Unexpected EOF');

    return token;
  }

  private expect(type: TokenType) {
    const prev = this.tokens.shift();
    if (!prev || prev.type !== type) {
      throw new Error(`Parser error: expected ${type} but received ${prev?.type}`);
    }

    return prev;
  }

  private parse_expr(): Expressions {
    return this.parse_comparison_expr();
  }

  private parse_comparison_expr(): Expressions {
    const left = this.parse_object_expr();

    const current = this.at();

    if (
      current?.type === TokenType.Equal ||
      current?.type === TokenType.StrictEqual ||
      current?.type === TokenType.NotEqual ||
      current?.type === TokenType.NotStrictEqual
    ) {
      const operator = this.eat();
      const right = this.parse_object_expr();
      return {
        kind: NodeType.Comparison,
        left,
        right,
        operator: operator.type,
      };
    }

    return left;
  }

  private parse_object_expr(): Expressions {
    let object = this.parse_additive_expr();

    while (this.at()?.type === TokenType.Dot) {
      this.eat();
      const property = this.parse_additive_expr();
      if (property.kind !== NodeType.Identifier) {
        throw new Error('Cannot use dot operator without right hand side being an identifier');
      }

      object = {
        kind: NodeType.MemberExpression,
        object,
        property,
      };
    }

    return object;
  }

  private parse_additive_expr(): Expressions {
    let left = this.parse_multiplicative_expr();

    while (this.at()?.type === TokenType.Plus || this.at()?.type === TokenType.Minus) {
      const operator = this.eat().value;
      const right = this.parse_multiplicative_expr();
      left = {
        kind: NodeType.BinaryExpr,
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_multiplicative_expr(): Expressions {
    let left = this.parse_primary_expr();

    while (
      this.at()?.type === TokenType.Slash ||
      this.at()?.type === TokenType.Star ||
      this.at()?.type === TokenType.Modulo
    ) {
      const operator = this.eat().value;
      const right = this.parse_primary_expr();
      left = {
        kind: NodeType.BinaryExpr,
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_primary_expr(): Expressions {
    const tk = this.at()?.type;

    switch (tk) {
      case TokenType.Identifier:
        return { kind: NodeType.Identifier, symbol: this.eat().value };
      case TokenType.Number:
        return { kind: NodeType.NumericLiteral, value: +this.eat().value };
      case TokenType.Boolean:
        return { kind: NodeType.Boolean, value: this.eat().value === 'true' };
      case TokenType.String:
        return { kind: NodeType.String, value: this.eat().value };
      case TokenType.Bang:
        this.eat();
        return { kind: NodeType.Not, expr: this.parse_expr() };
      case TokenType.LeftParen: {
        this.eat();
        const value = this.parse_expr();
        this.expect(TokenType.RightParen);
        return value;
      }
      default:
        throw new Error(`Unexpected token found during parsing: ${this.at()?.type}`);
    }
  }
}
