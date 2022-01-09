import { useRouter } from 'next/router';
import { Box, Button, Flex, Spacer, Stack } from '@chakra-ui/react';
import { Logo } from 'components/reusable/Logo';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log(accounts);
      if (accounts.length > 0) {
        setConnected(true);
      }
    }
  };

  return (
    <Flex width="100%" borderBottom="1px solid #dde" padding={4}>
      <Logo />
      <Spacer />
      <Box>
        <Stack>
          {!connected && <Button>Connect</Button>}
          {connected && (
            <Box
              background="#38A169"
              borderRadius="md"
              px={6}
              py={2}
              color="white"
              fontWeight="bold"
            >
              Connected
            </Box>
          )}
        </Stack>
      </Box>
    </Flex>
  );
}

// #38a169
