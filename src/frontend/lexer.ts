import { Token, TokenType } from './tokens';

type Spec = [TokenType, RegExp];

const SPECS: Spec[] = [
  [TokenType.Boolean, /^(true|false)/],
  [TokenType.Number, /^\d+/],
  [TokenType.Skipped, /^\s+/],
  [TokenType.String, /^"(.*)"/],
  [TokenType.String, /^'(.*)'/],
  [TokenType.Identifier, /^[a-zA-Z_][a-zA-Z0-9_]*/],
  [TokenType.Dot, /^\./],
  [TokenType.StrictEqual, /^===/],
  [TokenType.NotStrictEqual, /^!==/],
  [TokenType.Equal, /^==/],
  [TokenType.NotEqual, /^!=/],
  [TokenType.Bang, /^\!/],
  [TokenType.LeftParen, /^\(/],
  [TokenType.RightParen, /^\)/],
  [TokenType.Plus, /^\+/],
  [TokenType.Minus, /^-/],
  [TokenType.Star, /^\*/],
  [TokenType.Slash, /^\//],
  [TokenType.Modulo, /^%/],
];

export function tokenize(source: string): Token[] {
  let position = 0;
  const tokens: Token[] = [];

  outer: while (position < source.length) {
    const substr = source.substring(position);

    for (const [type, regex] of SPECS) {
      if (!regex.test(substr)) {
        continue;
      }

      const matched = regex.exec(substr);
      if (!matched) continue;

      const value = matched.at(1) ?? matched[0];
      position += matched[0].length;

      if (type === TokenType.Skipped) continue outer;

      tokens.push({ type, value });
      continue outer;
    }

    throw new Error(`Unexpected token: '${substr.at(0) ?? ''}'`);
  }

  return tokens;
}
