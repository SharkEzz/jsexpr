import { TokenType } from './tokens';

export enum NodeType {
  NumericLiteral = 'NumericLiteral',
  BinaryExpr = 'BinaryExpr',
  Identifier = 'Identifier',
  Comparison = 'Comparison',
  MemberExpression = 'MemberExpression',
  Boolean = 'Boolean',
  Not = 'Not',
  String = 'String',
}

export type Expressions =
  | Identifier
  | NumericLiteral
  | Comparison
  | MemberExpr
  | Not
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Boolean
  | BinaryExpr
  | StringLiteral;

export interface Expr {
  kind: NodeType;
}

export interface Identifier extends Expr {
  kind: NodeType.Identifier;
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: NodeType.NumericLiteral;
  value: number;
}

export interface Comparison extends Expr {
  kind: NodeType.Comparison;
  left: Expressions;
  right: Expressions;
  operator: TokenType;
}

export interface MemberExpr extends Expr {
  kind: NodeType.MemberExpression;
  object: Expressions;
  property: Expressions;
}

export interface Not extends Expr {
  kind: NodeType.Not;
  expr: Expressions;
}

export interface Boolean extends Expr {
  kind: NodeType.Boolean;
  value: boolean;
}

export interface BinaryExpr extends Expr {
  kind: NodeType.BinaryExpr;
  left: Expressions;
  right: Expressions;
  operator: string;
}

export interface StringLiteral extends Expr {
  kind: NodeType.String;
  value: string;
}
