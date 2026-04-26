import '@testing-library/jest-dom';

// jsdom doesn't support scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function() {};
