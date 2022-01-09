import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAuth } from 'hooks/useAuth';

declare global {
  interface Window {
    ethereum: any;
  }
}

const Index: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [walletCheckDone, setWalletCheckDone] = useState(false);
  const [walletCheckOk, setWalletCheckOk] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    const { ethereum } = window;

    if (ethereum) {
      setWalletCheckOk(true);
      setWalletCheckDone(true);
    } else {
      setWalletCheckDone(true);
      setWalletCheckOk(false);
    }
  };

  const walletConnect = async () => {
    setLoading(true);
    const { ethereum } = window;

    if (!ethereum) {
      console.log('no metamask');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length > 0) {
      console.log('done');
      await login();

      window.location.href = '/home';
    } else {
      console.log('something went wrong -- no wallet');
    }
    setLoading(false);
  };

  return (
    <Box p={5}>
      <Flex>
        <Box>
          <strong>pinboard</strong>.so
        </Box>
        <Spacer />
        <Box>
          {walletCheckDone && walletCheckOk && (
            <Button
              variant="outline"
              isLoading={loading}
              onClick={walletConnect}
            >
              Connect Wallet
            </Button>
          )}
          {walletCheckDone && !walletCheckOk && (
            <Button isDisabled={true}>No Wallet Detected</Button>
          )}
        </Box>
      </Flex>
      <Box>Payroll for DAOs</Box>
      <Box>More info here plus some image maybe</Box>
      <Box>Now some other information or something</Box>
    </Box>
  );
};

export default Index;
