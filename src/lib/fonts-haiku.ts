import localFont from 'next/font/local';

export const hinaMinchoHaiku = localFont({
  src: '../assets/fonts/hina-mincho-400-haiku.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-hina-mincho-haiku',
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
