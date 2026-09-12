import { validateDescriptionLength, truncateDescription } from './description';

describe('truncateDescription', () => {
  it('returns undefined when no description is given', () => {
    expect(truncateDescription(undefined)).toBeUndefined();
  });

  it('returns the description unchanged when within the limit', () => {
    expect(truncateDescription('Short and sweet')).toBe('Short and sweet');
  });

  it('truncates with an ellipsis when longer than 40 characters', () => {
    const long = 'This description is definitely longer than forty characters';
    const result = truncateDescription(long)!;
    expect(result.length).toBe(40);
    expect(result.endsWith('…')).toBe(true);
  });
});

describe('validateDescriptionLength', () => {
  const originalEnv = process.env.NODE_ENV;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it('warns in development when a description exceeds 40 characters', () => {
    process.env.NODE_ENV = 'development';
    validateDescriptionLength('item-1', 'This description is definitely longer than forty characters');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/item-1/);
  });

  it('does not warn for a description within the limit', () => {
    process.env.NODE_ENV = 'development';
    validateDescriptionLength('item-1', 'Short');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('does not warn in production even when too long', () => {
    process.env.NODE_ENV = 'production';
    validateDescriptionLength('item-1', 'This description is definitely longer than forty characters');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('does not warn when no description is given', () => {
    process.env.NODE_ENV = 'development';
    validateDescriptionLength('item-1', undefined);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
