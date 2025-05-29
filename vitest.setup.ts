import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('leaflet/dist/leaflet.css', () => ({}));

Object.defineProperty(window, 'L', {
  value: {
    Icon: {
      Default: {
        mergeOptions: vi.fn(),
        prototype: { _getIconUrl: vi.fn() },
      },
    },
  },
  writable: true,
});

if (typeof global !== 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
} else if (typeof globalThis !== 'undefined') {
  (globalThis as any).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
} else if (typeof window !== 'undefined') {
  (window as any).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
