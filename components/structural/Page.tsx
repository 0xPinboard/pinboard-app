import { Box, Flex } from '@chakra-ui/react';
import { Header } from 'components/structural/Header';

interface PageProps {
  children: any;
}

export function Page({ children }: PageProps) {
  return (
    <Flex>
      <Box width="100%">
        <Header />
        <Box padding={4}>{children}</Box>
      </Box>
    </Flex>
  );
}
