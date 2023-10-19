import { describe, it } from 'vitest';
import { tokenize } from './tokenizer';
import { TokenType, createToken } from './tokens';

describe('Tokenizer', () => {
  it.concurrent('should throw on unexpected token', ({ expect }) => {
    expect(() => tokenize('é')).toThrowError('Unexpected token: é as line 0 column 0');
  });

  it.concurrent('should tokenize nothing if input is empty', ({ expect }) => {
    expect(tokenize(' ')).toEqual([]);
  });

  it.concurrent('should tokenize number', ({ expect }) => {
    expect(tokenize('123')).toEqual([createToken(TokenType.Number, '123')]);
  });

  it.concurrent('should tokenize boolean', ({ expect }) => {
    expect(tokenize('true')).toEqual([createToken(TokenType.Boolean, 'true')]);
  });

  it.concurrent('should tokenize string', ({ expect }) => {
    expect(tokenize('"toto"')).toEqual([createToken(TokenType.String, 'toto', '"toto"')]);
  });

  it.concurrent('should tokenize identifier', ({ expect }) => {
    expect(tokenize('toto')).toEqual([createToken(TokenType.Identifier, 'toto')]);
  });

  it.concurrent('should tokenize dot expression', ({ expect }) => {
    expect(tokenize('toto.titi')).toEqual([
      createToken(TokenType.Identifier, 'toto'),
      createToken(TokenType.Dot, '.'),
      createToken(TokenType.Identifier, 'titi'),
    ]);
  });

  it.concurrent('should tokenize binary expression', ({ expect }) => {
    expect(tokenize('1 + 5')).toEqual([
      createToken(TokenType.Number, '1'),
      createToken(TokenType.Plus, '+'),
      createToken(TokenType.Number, '5'),
    ]);
  });

  it.concurrent('should tokenize boolean expression with literals', ({ expect }) => {
    expect(tokenize('5 in [1, 2]')).toEqual([
      createToken(TokenType.Number, '5'),
      createToken(TokenType.In, 'in'),
      createToken(TokenType.LeftBracket, '['),
      createToken(TokenType.Number, '1'),
      createToken(TokenType.Comma, ','),
      createToken(TokenType.Number, '2'),
      createToken(TokenType.RightBracket, ']'),
    ]);
  });

  it.concurrent('should tokenize boolean expression with not in', ({ expect }) => {
    expect(tokenize('5 not in [1, 2]')).toEqual([
      createToken(TokenType.Number, '5'),
      createToken(TokenType.Not, 'not'),
      createToken(TokenType.In, 'in'),
      createToken(TokenType.LeftBracket, '['),
      createToken(TokenType.Number, '1'),
      createToken(TokenType.Comma, ','),
      createToken(TokenType.Number, '2'),
      createToken(TokenType.RightBracket, ']'),
    ]);
  });

  it.concurrent('should tokenize boolean expression with contains on a string', ({ expect }) => {
    expect(tokenize("'toto' contains 'to'")).toEqual([
      createToken(TokenType.String, 'toto', "'toto'"),
      createToken(TokenType.Contains, 'contains'),
      createToken(TokenType.String, 'to', "'to'"),
    ]);
  });

  it.concurrent('should tokenize boolean expression with not contains on a string', ({ expect }) => {
    expect(tokenize("'toto' not contains 'to'")).toEqual([
      createToken(TokenType.String, 'toto', "'toto'"),
      createToken(TokenType.Not, 'not'),
      createToken(TokenType.Contains, 'contains'),
      createToken(TokenType.String, 'to', "'to'"),
    ]);
  });

  it.concurrent('should tokenize string on multiline', ({ expect }) => {
    expect(
      tokenize(`" titi
tata"`),
    ).toEqual([
      createToken(
        TokenType.String,
        ` titi
tata`,
        `" titi
tata"`,
      ),
    ]);
  });
});
