import { tokenize } from './lexer';
import { Token, TokenType } from './tokens';
import { describe, it, expect } from 'vitest';

describe('Lexer', () => {
  it('should tokenize simple expression', () => {
    const result = tokenize('1 == 1');
    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject<Token>({ type: TokenType.Number, value: '1' });
    expect(result[1]).toMatchObject<Token>({ type: TokenType.Equal, value: '==' });
    expect(result[2]).toMatchObject<Token>({ type: TokenType.Number, value: '1' });
  });

  it('should tokenize dot expression', () => {
    const result = tokenize('user == request.params.id');
    expect(result).toHaveLength(7);
  });

  it('should tokenize equals', () => {
    const result = tokenize('!= !== == ===');
    expect(result).toHaveLength(4);
  });

  it('should throw an error if a token is unexpected', () => {
    const t = () => {
      tokenize('ç');
    };
    expect(t).toThrowError("Unexpected token: 'ç'");
  });
});
