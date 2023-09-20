export enum TokenType {
  Number = 'Number',
  String = 'String',
  Boolean = 'Boolean',

  Dot = 'Dot',
  Bang = 'Bang',
  Plus = 'Plus',
  Minus = 'Minus',
  Star = 'Star',
  Slash = 'Slash',
  Modulo = 'Modulo',

  Equal = 'Equal',
  NotEqual = 'NotEqual',
  StrictEqual = 'StrictEqual',
  NotStrictEqual = 'NotStrictEqual',

  LeftParen = 'LeftParen',
  RightParen = 'RightParen',

  Identifier = 'Identifier',

  Skipped = 'Skipped',
}

export interface Token {
  type: TokenType;
  value: string;
}
