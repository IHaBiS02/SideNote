import { afterEach } from 'vitest';

Object.defineProperty(document, 'execCommand', {
  configurable: true,
  value: () => false,
});

afterEach(() => {
  document.body.replaceChildren();
});
