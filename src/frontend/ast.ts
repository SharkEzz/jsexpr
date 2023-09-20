import { BinaryOperator, TokenType } from './tokens';

export enum NodeType {
  NumericLiteral = 'NumericLiteral',
  BinaryExpr = 'BinaryExpr',
  Identifier = 'Identifier',
  Comparison = 'Comparison',
  MemberExpr = 'MemberExpr',
  BooleanLiteral = 'BooleanLiteral',
  Not = 'Not',
  String = 'String',
  LogicalExpr = 'LogicalExpr',
  CallExpr = 'CallExpr',
}

export type Expressions =
  | Identifier
  | NumericLiteral
  | Comparison
  | MemberExpr
  | Not
  | BooleanLiteral
  | BinaryExpr
  | StringLiteral
  | LogicalExpr
  | CallExpr;

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
  kind: NodeType.MemberExpr;
  object: Expressions;
  property: Expressions;
}

export interface Not extends Expr {
  kind: NodeType.Not;
  expr: Expressions;
}

export interface BooleanLiteral extends Expr {
  kind: NodeType.BooleanLiteral;
  value: boolean;
}

export interface BinaryExpr extends Expr {
  kind: NodeType.BinaryExpr;
  left: Expressions;
  right: Expressions;
  operator: BinaryOperator;
}

export interface StringLiteral extends Expr {
  kind: NodeType.String;
  value: string;
}

export interface LogicalExpr extends Expr {
  kind: NodeType.LogicalExpr;
  left: Expressions;
  right: Expressions;
  operator: string;
}

export interface CallExpr extends Expr {
  kind: NodeType.CallExpr;
  caller: Identifier;
  args: Expressions[];
}
