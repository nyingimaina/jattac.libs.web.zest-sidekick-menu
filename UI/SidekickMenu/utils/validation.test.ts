import { validateDescriptions } from './validation';
import { ISidekickMenuItem } from '../types';

describe('validateDescriptions', () => {
  const originalEnv = process.env.NODE_ENV;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    warnSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it('warns for a nested item with an over-long description', () => {
    const items: ISidekickMenuItem[] = [
      {
        id: 'parent',
        label: 'Parent',
        icon: '',
        searchTerms: '',
        children: [
          {
            id: 'child',
            label: 'Child',
            icon: '',
            searchTerms: '',
            path: '/child',
            description: 'This description is definitely longer than forty characters',
          },
        ],
      },
    ];
    validateDescriptions(items);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/child/);
  });

  it('does not warn when all descriptions are within the limit', () => {
    const items: ISidekickMenuItem[] = [
      { id: 'a', label: 'A', icon: '', searchTerms: '', path: '/a', description: 'Fine' },
    ];
    validateDescriptions(items);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
