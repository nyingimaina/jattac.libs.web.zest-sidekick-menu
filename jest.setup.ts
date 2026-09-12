import '@testing-library/jest-dom';

// jsdom doesn't support scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function() {};

// jsdom doesn't implement matchMedia - stub it so theme-detection hooks can run under test.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated, kept for older browser API shape
    removeListener: jest.fn(), // deprecated, kept for older browser API shape
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}
