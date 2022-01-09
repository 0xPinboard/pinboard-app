import type { NextPage } from 'next';
import Link from 'next/link';
import {
  Button,
  Heading,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { Page } from 'components/structural/Page';
import { useWallet } from 'hooks/useWallet';
import { Token } from 'models/token';
import { Board } from 'models/board';
import { ContractFactory, ethers } from 'ethers';
import { useBoards } from 'hooks/useBoards';
import pinboardContract from 'contracts/pinboard.abi.json';

function parseBalance(balance: number, decimals: number) {
  const b = balance / parseInt('1' + '0'.repeat(decimals));
  return Math.round((b + Number.EPSILON) * 100) / 100;
}

const Home: NextPage = () => {
  const { balance, boards, loading } = useWallet();
  const { addBoard } = useBoards();

  const combined = balance.map((t: Token) => ({
    ...t,
    board: boards.find((b: Board) => b.token === t.tokenAddress),
  }));

  const deploy = async (address: string) => {
    const { ethereum } = window;

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
    } else {
      throw new Error('No token address from URL :\\');
    }
  };

  return (
    <Page>
      <Heading as="h3" size="md">
        Your Wallet
      </Heading>
      <Table variant="simple" size="sm" width="800px" mt={6}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Symbol</Th>
            <Th isNumeric>Balance</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading && (
            <Tr>
              <Td>Loading...</Td>
            </Tr>
          )}
          {!loading && (
            <>
              {combined.map((token: any) => (
                <Tr key={token.tokenAddress}>
                  <Td>{token.name}</Td>
                  <Td>{token.symbol}</Td>
                  <Td isNumeric>
                    {parseBalance(token.balance, token.decimals)}
                  </Td>
                  <Td>
                    {token.board && (
                      <Link href={`/board/${token.board.contract}`} passHref>
                        <Button size="xs" background="green.200">
                          View Pinboard
                        </Button>
                      </Link>
                    )}

                    {!token.board && (
                      <Popover>
                        <PopoverTrigger>
                          {/* <Button>Trigger</Button> */}
                          <Button size="xs" variant="outline">
                            Create Pinboard
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Create a Pinboard</PopoverHeader>
                          <PopoverBody>
                            This will deploy a Pinboard contract, owned by your
                            wallet. This will be your new payroll interface for
                            your DAO. Deployment is going to cost some gas!
                          </PopoverBody>
                          <PopoverFooter>
                            <Flex>
                              <Spacer />
                              <Button
                                size="xs"
                                background="green.200"
                                onClick={() => deploy(token.tokenAddress)}
                              >
                                Deploy Pinboard
                              </Button>
                            </Flex>
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                    )}
                  </Td>
                </Tr>
              ))}
            </>
          )}
        </Tbody>
      </Table>
    </Page>
  );
};

export default Home;
