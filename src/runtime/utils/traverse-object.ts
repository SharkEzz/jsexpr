import { Identifier, MemberExpr, NodeType } from '../../frontend/ast';

export function traverse_object(member: MemberExpr, previous?: string[]): string[] {
  const path = previous ?? [];

  if (member.object.kind === NodeType.MemberExpression) {
    return path.concat(traverse_object(member.object), [(member.property as Identifier).symbol]);
  }

  return path.concat((member.object as Identifier).symbol, (member.property as Identifier).symbol);
}
