import type { NextPage } from 'next';
import Link from 'next/link';
import {
  Button,
  Heading,
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

function parseBalance(balance: number, decimals: number) {
  const b = balance / parseInt('1' + '0'.repeat(decimals));
  return Math.round((b + Number.EPSILON) * 100) / 100;
}

const Home: NextPage = () => {
  const { balance, boards, loading } = useWallet();

  const combined = balance.map((t: Token) => ({
    ...t,
    board: boards.find((b: Board) => b.token === t.tokenAddress),
  }));

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
                      <Link href={`/create/${token.tokenAddress}`} passHref>
                        <Button size="xs" variant="outline">
                          Create Pinboard
                        </Button>
                      </Link>
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
