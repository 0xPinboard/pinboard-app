import type { NextPage } from 'next';
import { Box, Button, Heading, Input, Text } from '@chakra-ui/react';
import { Page } from 'components/structural/Page';
import { useRouter } from 'next/router';
import { useBoards } from 'hooks/useBoards';

import { ContractFactory, ethers } from 'ethers';
import pinboardContract from 'contracts/pinboard.abi.json';

const Home: NextPage = () => {
  const router = useRouter();
  const { addBoard } = useBoards();

  const deploy = async () => {
    const { ethereum } = window;
    const { address } = router.query;

    if (address) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const factory = new ContractFactory(
        pinboardContract.abi,
        pinboardContract.bytecode,
        signer,
      );
      const contract = await factory.deploy(
        process.env.NEXT_PUBLIC_FEE_WALLET,
        1, // 1% fees
      );

      await addBoard(contract.address, address.toString());

      // console.log(contract.address);
      // console.log(contract.deployTransaction);
    } else {
      throw new Error('No token address from URL :\\');
    }
  };

  return (
    <Page>
      <Heading as="h3" size="md">
        Create Pinboard
      </Heading>

      <Box>
        <Text>
          Hit the button below to create a Pinboard for your DAO, represented by
          the token ...
        </Text>
        <Text>
          This action will deploy your very on Pinboard contract, so it will
          cost some gas.
        </Text>

        <Button onClick={deploy}>Deploy</Button>
      </Box>
    </Page>
  );
};

export default Home;
