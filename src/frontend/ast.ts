export enum NodeType {
  NumericLiteral = 'NumericLiteral',
  StringLiteral = 'StringLiteral',
  BooleanLiteral = 'BooleanLiteral',
  MemberExpr = 'MemberExpr',
  ArrayExpression = 'ArrayExpression',
  ArrayAccessExpression = 'ArrayAccessExpression',
  Identifier = 'Identifier',
  Not = 'Not',
  BinaryExpression = 'BinaryExpression',
  UnaryExpression = 'UnaryExpression',
  ComparisonExpression = 'ComparisonExpression',
  FunctionCall = 'FunctionCall',
}

export interface Expr {
  kind: NodeType;
}

export interface Identifier extends Expr {
  kind: NodeType.Identifier;
  value: string;
}

export interface NumericLiteral extends Expr {
  kind: NodeType.NumericLiteral;
  value: number;
}

export interface StringLiteral extends Expr {
  kind: NodeType.StringLiteral;
  value: string;
  singleQuote: boolean;
}

export interface BooleanLiteral extends Expr {
  kind: NodeType.BooleanLiteral;
  value: boolean;
}

export interface MemberExpr extends Expr {
  kind: NodeType.MemberExpr;
  object: Expression;
  property: Expression;
}

export interface Not extends Expr {
  kind: NodeType.Not;
  expr: Expression;
}

export interface BinaryExpression extends Expr {
  kind: NodeType.BinaryExpression;
  left: Expression;
  operator: string;
  right: Expression;
}

export interface UnaryExpression extends Expr {
  kind: NodeType.UnaryExpression;
  operator: string;
  expr: Expression;
}

export interface ComparisonExpression extends Expr {
  kind: NodeType.ComparisonExpression;
  left: Expression;
  operator: string;
  right: Expression;
}

export interface ArrayExpression extends Expr {
  kind: NodeType.ArrayExpression;
  elements: Expression[];
}

export interface ArrayAccessExpression extends Expr {
  kind: NodeType.ArrayAccessExpression;
  array: Expression;
  indexExpr: Expression;
}

export interface FunctionCall extends Expr {
  kind: NodeType.FunctionCall;
  callee: Expression;
  args: Expression[];
}

export type Expression =
  | NumericLiteral
  | StringLiteral
  | BooleanLiteral
  | MemberExpr
  | Identifier
  | Not
  | BinaryExpression
  | UnaryExpression
  | ComparisonExpression
  | ArrayAccessExpression
  | ArrayExpression
  | FunctionCall;
