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
  (
    globalThis as typeof globalThis & { ResizeObserver: typeof ResizeObserver }
  ).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
} else if (typeof window !== 'undefined') {
  (
    window as typeof window & { ResizeObserver: typeof ResizeObserver }
  ).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
