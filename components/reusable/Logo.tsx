import { Center, Image, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export function Logo() {
  const router = useRouter();

  return (
    <Center
      px={3}
      onClick={() => router.push('/home')}
      _hover={{ cursor: 'pointer' }}
    >
      <Image src="/pinboard.svg" height="32px" width="32px" alt="Pinboard" />
      <Text fontWeight="bold" fontSize="20px" pl={2}>
        Pinboard
      </Text>
    </Center>
  );
}
