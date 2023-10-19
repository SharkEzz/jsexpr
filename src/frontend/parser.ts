import { type Expression, NodeType } from './ast';
import { tokenize } from './tokenizer';
import { type Token, TokenType } from './tokens';

export class Parser {
  private tokens: Token[] = [];

  public parse(source: string) {
    this.tokens = tokenize(source);
    return this.parseExpression();
  }

  private eat() {
    const token = this.tokens.shift();
    if (!token) throw new Error('Unexpected EOF');

    return token;
  }

  private at() {
    return this.tokens.at(0);
  }

  private expect(type: TokenType) {
    const prev = this.tokens.shift();
    if (!prev || prev.kind !== type) {
      throw new Error('Parser error');
    }

    return prev;
  }

  private parseExpression(): Expression {
    return this.parseArrayAccessExpr();
  }

  private parseArrayAccessExpr(): Expression {
    const expr = this.parseComparisonExpr();

    while (this.at()?.kind === TokenType.LeftBracket) {
      this.eat(); // Eat the left bracket
      const index = this.parseExpression();
      this.expect(TokenType.RightBracket);

      return {
        kind: NodeType.ArrayAccessExpression,
        array: expr,
        indexExpr: index,
      };
    }

    return expr;
  }

  private parseComparisonExpr(): Expression {
    let left = this.parseMemberExpression();

    const current = this.at();

    if (
      current?.kind === TokenType.StrictEqual ||
      current?.kind === TokenType.Equal ||
      current?.kind === TokenType.StrictNotEqual ||
      current?.kind === TokenType.NotEqual ||
      current?.kind === TokenType.GreaterThan ||
      current?.kind === TokenType.GreaterThanOrEqual ||
      current?.kind === TokenType.LessThan ||
      current?.kind === TokenType.LessThanOrEqual ||
      current?.kind === TokenType.In ||
      current?.kind === TokenType.Contains ||
      current?.kind === TokenType.And ||
      current?.kind === TokenType.Or ||
      current?.kind === TokenType.Not
    ) {
      const operator = this.eat().value;
      const right = this.parseMemberExpression();

      left = {
        kind: NodeType.ComparisonExpression,
        left,
        operator,
        right,
      };
    }

    return left;
  }

  private parseMemberExpression(): Expression {
    let object = this.parseAdditiveExpr();

    while (this.at()?.kind === TokenType.Dot) {
      this.eat(); // Eat the dot
      const property = this.parseAdditiveExpr();

      object = {
        kind: NodeType.MemberExpr,
        object,
        property,
      };
    }

    return object;
  }

  private parseAdditiveExpr(): Expression {
    let left = this.parseMultiplicativeExpr();

    while (this.at()?.kind === TokenType.Plus || this.at()?.kind === TokenType.Minus) {
      const operator = this.eat().value;
      const right = this.parseMultiplicativeExpr();
      left = {
        kind: NodeType.BinaryExpression,
        left,
        operator,
        right,
      };
    }

    return left;
  }

  private parseMultiplicativeExpr(): Expression {
    let left = this.parsePrimaryExpression();

    while (
      this.at()?.kind === TokenType.Star ||
      this.at()?.kind === TokenType.Slash ||
      this.at()?.kind === TokenType.Modulo
    ) {
      const operator = this.eat().value;
      const right = this.parsePrimaryExpression();

      left = {
        kind: NodeType.BinaryExpression,
        left,
        operator,
        right,
      };
    }

    return left;
  }

  private parsePrimaryExpression(): Expression {
    const tkType = this.at()?.kind;

    switch (tkType) {
      case TokenType.Identifier:
        return { kind: NodeType.Identifier, value: this.eat().value };
      case TokenType.Boolean:
        return { kind: NodeType.BooleanLiteral, value: this.eat().value === 'true' };
      case TokenType.Number:
        return { kind: NodeType.NumericLiteral, value: Number(this.eat().value) };
      case TokenType.String:
        return { kind: NodeType.StringLiteral, value: this.eat().value };
      case TokenType.Plus:
      case TokenType.Minus:
      case TokenType.Star:
      case TokenType.Slash:
      case TokenType.Modulo:
        return { kind: NodeType.UnaryExpression, operator: this.eat().value, expr: this.parseExpression() };
      case TokenType.LeftParen: {
        this.eat(); // Eat the left paren
        const expr = this.parseExpression();
        this.expect(TokenType.RightParen);
        return expr;
      }
      case TokenType.LeftBracket: {
        this.eat(); // Eat the left bracket
        const elements = [this.parseExpression()];
        while (this.at()?.kind === TokenType.Comma) {
          this.eat(); // Eat the comma
          elements.push(this.parseExpression());
        }
        this.expect(TokenType.RightBracket);

        return {
          kind: NodeType.ArrayExpression,
          elements,
        };
      }
      case TokenType.Bang: {
        this.eat();
        return { kind: NodeType.Not, expr: this.parsePrimaryExpression() };
      }
      default:
        throw new Error(`Unexpected token: ${this.at()?.value}`);
    }
  }
}
