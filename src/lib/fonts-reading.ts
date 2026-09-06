import localFont from 'next/font/local';

export const notoSerifJP = localFont({
  src: '../assets/fonts/noto-serif-jp-400.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-noto-serif-jp',
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
