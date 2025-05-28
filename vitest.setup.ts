import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Leaflet CSS mockの設定
vi.mock('leaflet/dist/leaflet.css', () => ({}));

// Leaflet global variables
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

// ResizeObserver mock
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
