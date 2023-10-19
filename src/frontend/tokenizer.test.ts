import { tokenize } from './tokenizer';
import { TokenType, createToken } from './tokens';

describe('Tokenizer', () => {
  it('should throw on unexpected token', () => {
    expect(() => tokenize('é')).toThrowError('Unexpected token: é as line 0 column 0');
  });

  it('should tokenize nothing if input is empty', () => {
    expect(tokenize(' ')).toEqual([]);
  });

  it('should tokenize number', () => {
    expect(tokenize('123')).toEqual([createToken(TokenType.Number, '123')]);
  });

  it('should tokenize boolean', () => {
    expect(tokenize('true')).toEqual([createToken(TokenType.Boolean, 'true')]);
  });

  it('should tokenize string', () => {
    expect(tokenize('"toto"')).toEqual([createToken(TokenType.String, 'toto')]);
  });

  it('should tokenize identifier', () => {
    expect(tokenize('toto')).toEqual([createToken(TokenType.Identifier, 'toto')]);
  });

  it('should tokenize dot expression', () => {
    expect(tokenize('toto.titi')).toEqual([
      createToken(TokenType.Identifier, 'toto'),
      createToken(TokenType.Dot, '.'),
      createToken(TokenType.Identifier, 'titi'),
    ]);
  });

  it('should tokenize binary expression', () => {
    expect(tokenize('1 + 5')).toEqual([
      createToken(TokenType.Number, '1'),
      createToken(TokenType.Plus, '+'),
      createToken(TokenType.Number, '5'),
    ]);
  });

  it('should tokenize boolean expression with literals', () => {
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

  it('should tokenize string on multiline', () => {
    expect(
      tokenize(`" titi
tata"`),
    ).toEqual([
      createToken(
        TokenType.String,
        ` titi
tata`,
      ),
    ]);
  });
});
