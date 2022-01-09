import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: '"PT Mono", monospace',
      },
    },
  },
});

export default theme;
