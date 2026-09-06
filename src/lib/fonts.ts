import localFont from 'next/font/local';

export const shipporiMincho = localFont({
  src: '../assets/fonts/shippori-mincho-600.woff2',
  weight: '600',
  style: 'normal',
  variable: '--font-shippori-mincho',
  display: 'swap',
  preload: true,
  fallback: [
    'Hiragino Mincho ProN',
    'Hiragino Mincho Pro',
    'Yu Mincho',
    'YuMincho',
    'Noto Serif JP',
    'serif',
  ],
  adjustFontFallback: false,
});

export const hinaMinchoLogo = localFont({
  src: '../assets/fonts/hina-mincho-400-logo.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-hina-mincho',
  display: 'swap',
  preload: true,
  fallback: [
    'Hiragino Mincho ProN',
    'Hiragino Mincho Pro',
    'Yu Mincho',
    'YuMincho',
    'Noto Serif JP',
    'serif',
  ],
  adjustFontFallback: false,
});
