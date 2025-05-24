import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';
import { initialize, mswLoader } from 'msw-storybook-addon';

initialize({
  onUnhandledRequest: 'bypass',
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    nextjs: {
      appDirectory: true,
    },
  },
  loaders: [mswLoader],
};

export default preview;
