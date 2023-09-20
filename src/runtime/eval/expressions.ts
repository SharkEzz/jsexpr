import type { BinaryExpr, Comparison, MemberExpr } from '../../frontend/ast';
import { BinaryOperator, TokenType } from '../../frontend/tokens';
import { Environment } from '../environment';
import { evaluate } from '../interpreter';
import { traverse_object } from '../utils/traverse-object';
import { BooleanVal, NumberVal, ObjectVal, RuntimeValue, ValueType } from '../values';

export function eval_comparison(comparison: Comparison, env: Environment): RuntimeValue {
  const { left, right, operator } = comparison;
  const evaluatedLeft = evaluate(left, env);
  const evaluatedRight = evaluate(right, env);

  switch (operator) {
    case TokenType.Equal:
      return { type: ValueType.Boolean, value: evaluatedLeft.value == evaluatedRight.value } as BooleanVal;
    case TokenType.StrictEqual:
      return { type: ValueType.Boolean, value: evaluatedLeft.value === evaluatedRight.value } as BooleanVal;
    case TokenType.NotEqual:
      return { type: ValueType.Boolean, value: evaluatedLeft.value != evaluatedRight.value } as BooleanVal;
    case TokenType.NotStrictEqual:
      return { type: ValueType.Boolean, value: evaluatedLeft.value !== evaluatedRight.value } as BooleanVal;
    default:
      throw new Error('Failed to apply operator');
  }
}

export function eval_member_expression(member: MemberExpr, env: Environment): RuntimeValue {
  const path = traverse_object(member);
  const object = env.lookupVar(path.shift() as string) as ObjectVal;

  return path.reduce<RuntimeValue>((prev, curr) => {
    if (prev.type === ValueType.Object) {
      const value = prev.value.get(curr);
      if (!value) throw new Error('Failed to get key');
      return value;
    } else {
      return prev;
    }
  }, object);
}

export function eval_numeric_binary_expr(lhs: NumberVal, rhs: NumberVal, operator: string): RuntimeValue {
  let result: number;
  switch (operator) {
    case '+':
      result = lhs.value + rhs.value;
      break;
    case '-':
      result = lhs.value - rhs.value;
      break;
    case '*':
      result = lhs.value * rhs.value;
      break;
    case '/':
      result = lhs.value / rhs.value;
      break;
    default:
      result = lhs.value % rhs.value;
      break;
  }

  return { type: ValueType.Number, value: result } as NumberVal;
}

export function eval_binary_expr(expr: BinaryExpr, env: Environment): RuntimeValue {
  const { left, operator, right } = expr;

  if (!(['+', '-', '*', '/', '%'] as BinaryOperator[]).includes(operator)) {
    throw new Error(`Invalid operator: ${operator}`);
  }

  const lhs = evaluate(left, env);
  const rhs = evaluate(right, env);

  if (lhs.type !== ValueType.Number && rhs.type !== ValueType.Number) {
    throw new Error(`Invalid binary expression: ${lhs.type} and ${rhs.type}`);
  }

  return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, operator);
}
