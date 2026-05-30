import { describe, expect, it } from 'vitest';
import { generateSessionTitle } from '../session-lifecycle';

describe('generateSessionTitle', () => {
  it('returns the first line of text', () => {
    expect(generateSessionTitle('Hello world')).toBe('Hello world');
  });

  it('truncates long text to 50 characters with ellipsis', () => {
    const long = 'a'.repeat(60);
    expect(generateSessionTitle(long)).toBe('a'.repeat(49) + '\u2026');
  });

  it('uses the first non-empty line', () => {
    expect(generateSessionTitle('\n\nHello world\nsecond line')).toBe('Hello world');
  });

  it('strips markdown heading syntax', () => {
    expect(generateSessionTitle('## Hello world')).toBe('Hello world');
  });

  it('strips blockquote markers', () => {
    expect(generateSessionTitle('> Hello world')).toBe('Hello world');
  });

  it('strips list markers', () => {
    expect(generateSessionTitle('- Hello world')).toBe('Hello world');
    expect(generateSessionTitle('* Hello world')).toBe('Hello world');
    expect(generateSessionTitle('1. Hello world')).toBe('Hello world');
  });

  it('strips code fence openers and falls back to next line', () => {
    expect(generateSessionTitle('```typescript\nconst x = 1')).toBe('const x = 1');
  });

  it('strips inline backticks', () => {
    expect(generateSessionTitle('`hello world`')).toBe('hello world');
  });

  it('returns empty string when nothing remains after cleaning', () => {
    expect(generateSessionTitle('```\n```')).toBe('');
    expect(generateSessionTitle('')).toBe('');
    expect(generateSessionTitle('   ')).toBe('');
  });

  it('handles real-world prompts', () => {
    expect(generateSessionTitle("We're at our custom branch with pi-coding-agent support")).toBe(
      "We're at our custom branch with pi-coding-agent s\u2026",
    );
    expect(generateSessionTitle('Fix the login bug in auth.ts')).toBe('Fix the login bug in auth.ts');
  });
});
