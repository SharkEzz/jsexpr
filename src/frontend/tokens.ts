export enum TokenType {
  Number = 'Number',
  String = 'String',
  Boolean = 'Boolearn',

  Identifier = 'Identifier',
  Dot = 'Dot',
  LeftParen = 'LeftParen',
  RightParen = 'RightParen',
  LeftBracket = 'LeftBracket',
  RightBracket = 'RightBracket',
  Bang = 'Bang',
  Comma = 'Comma',

  Plus = 'Plus',
  Minus = 'Minus',
  Star = 'Star',
  Slash = 'Slash',
  Modulo = 'Modulo',

  Equal = 'Equal',
  NotEqual = 'NotEqual',
  GreaterThan = 'GreaterThan',
  GreaterThanOrEqual = 'GreaterThanOrEqual',
  LessThan = 'LessThan',
  LessThanOrEqual = 'LessThanOrEqual',
  StrictEqual = 'StrictEqual',
  StrictNotEqual = 'StrictNotEqual',

  And = 'And',
  Or = 'Or',
  Not = 'Not',
  In = 'In',
  Contains = 'Contains',

  Skipped = 'Skipped',
  EOF = 'EOF',
}

export interface Token {
  kind: TokenType;
  value: string;
  raw: string;
}

export function createToken(kind: TokenType, value = '', raw?: string): Token {
  return {
    kind,
    value,
    raw: raw ?? value,
  };
}
