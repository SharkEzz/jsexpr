import { BinaryExpression, ComparisonExpression, Expression, NodeType } from './frontend/ast';

function processExpression(expression: BinaryExpression | ComparisonExpression): string {
  switch (expression.operator) {
    case 'in':
      return generator(expression.right) + '.includes(' + generator(expression.left) + ')';
    case 'contains':
      return generator(expression.left) + '.includes(' + generator(expression.right) + ')';
    default: {
      const left = generator(expression.left);
      const right = generator(expression.right);
      return `${left}${expression.operator}${right}`;
    }
  }
}

/**
 * Turn the AST into valid JavaScript code.
 */
export function generator(source: Expression) {
  let output = '';

  switch (source.kind) {
    case NodeType.ComparisonExpression:
    case NodeType.BinaryExpression:
      output += processExpression(source);
      break;
    case NodeType.BooleanLiteral:
    case NodeType.NumericLiteral:
    case NodeType.Identifier:
      output += source.value;
      break;
    case NodeType.StringLiteral:
      if (source.singleQuote) {
        output += `'${source.value}'`;
        break;
      }
      output += `"${source.value}"`;
      break;
    case NodeType.ArrayAccessExpression:
      output += generator(source.array);
      output += '[';
      output += generator(source.indexExpr);
      output += ']';
      break;
    case NodeType.ArrayExpression:
      output += '[';
      output += source.elements.map(generator).join(',');
      output += ']';
      break;
    case NodeType.MemberExpr:
      output += generator(source.object);
      output += '.';
      output += generator(source.property);
      break;
    case NodeType.UnaryExpression:
      output += source.operator;
      output += generator(source.expr);
      break;
    case NodeType.Not:
      output += '!(';
      output += generator(source.expr);
      output += ')';
      break;
    case NodeType.FunctionCall:
      output += generator(source.callee);
      output += '(';
      output += source.args.map(generator).join(',');
      output += ')';
      break;
  }

  return output;
}
