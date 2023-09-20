import { Expressions, NodeType, Not } from '../frontend/ast';
import { Environment } from './environment';
import {
  eval_binary_expr,
  eval_call_expr,
  eval_comparison,
  eval_logical_expr,
  eval_member_expression,
} from './eval/expressions';
import { NumberVal, RuntimeValue, ValueType } from './values';

function eval_not(astNode: Not, env: Environment): RuntimeValue {
  const result = evaluate(astNode.expr, env);

  if (result.type === ValueType.Boolean) {
    return { ...result, value: !result.value };
  }

  throw new Error('Cannot negate a non-boolean value');
}

export function evaluate(astNode: Expressions, env: Environment): RuntimeValue {
  switch (astNode.kind) {
    case NodeType.NumericLiteral:
      return {
        type: ValueType.Number,
        value: astNode.value,
      } as NumberVal;
    case NodeType.Identifier:
      return env.lookupVar(astNode.symbol);
    case NodeType.Comparison:
      return eval_comparison(astNode, env);
    case NodeType.MemberExpr:
      return eval_member_expression(astNode, env);
    case NodeType.Not:
      return eval_not(astNode, env);
    case NodeType.BinaryExpr:
      return eval_binary_expr(astNode, env);
    case NodeType.LogicalExpr:
      return eval_logical_expr(astNode, env);
    case NodeType.CallExpr:
      return eval_call_expr(astNode, env);
    case NodeType.String:
      return {
        type: ValueType.String,
        value: astNode.value,
      };
    case NodeType.BooleanLiteral:
      return {
        type: ValueType.Boolean,
        value: astNode.value,
      };
    default:
      throw new Error('Unsupported AST node type');
  }
}
