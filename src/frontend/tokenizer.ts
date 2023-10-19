import { type Token, TokenType, createToken } from './tokens';

type Spec = [TokenType, RegExp];

const specs: Readonly<Readonly<Spec>[]> = [
  [TokenType.Number, /^[0-9]+/],
  [TokenType.String, /^"([^"]*)"/],
  [TokenType.String, /^'([^']*)'/],
  [TokenType.Boolean, /^(true|false)/],

  [TokenType.Dot, /^\./],
  [TokenType.Comma, /^,/],
  [TokenType.LeftParen, /^\(/],
  [TokenType.RightParen, /^\)/],
  [TokenType.LeftBracket, /^\[/],
  [TokenType.RightBracket, /^\]/],
  [TokenType.Plus, /^\+/],
  [TokenType.Minus, /^\-/],
  [TokenType.Star, /^\*/],
  [TokenType.Slash, /^\//],
  [TokenType.Modulo, /^\%/],
  [TokenType.StrictEqual, /^===/],
  [TokenType.Equal, /^==/],
  [TokenType.StrictNotEqual, /^!==/],
  [TokenType.NotEqual, /^!=/],
  [TokenType.GreaterThan, /^>/],
  [TokenType.GreaterThanOrEqual, /^>=/],
  [TokenType.LessThan, /^</],
  [TokenType.LessThanOrEqual, /^<=/],
  [TokenType.Bang, /^\!/],
  [TokenType.And, /^and/],
  [TokenType.And, /^&&/],
  [TokenType.Or, /^or/],
  [TokenType.Or, /^\|\|/],
  [TokenType.Not, /^not/],
  [TokenType.In, /^in/],
  [TokenType.Contains, /^contains/],

  [TokenType.Identifier, /^[a-zA-Z_][a-zA-Z0-9_]+/],
  [TokenType.Skipped, /^\s+/],
] as const;

export function tokenize(source: string) {
  let position = 0;
  const line = source.match(/^\n/)?.length ?? 0;
  const column = source.match(/ +/)?.length ?? 0;
  const tokens: Token[] = [];

  outer: while (position < source.length) {
    const substr = source.substring(position);

    for (const [type, regex] of specs) {
      if (!regex.test(substr)) continue;

      const matched = regex.exec(substr)!;

      const value = matched.at(1) ?? matched[0];
      position += matched[0].length;

      if (type === TokenType.Skipped) continue outer;

      const token = createToken(type, value, matched[0]);

      tokens.push(token);
      continue outer;
    }

    throw new Error(`Unexpected token: ${substr[0]} as line ${line} column ${column}}`);
  }

  return tokens;
}
