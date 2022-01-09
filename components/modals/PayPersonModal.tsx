import {
  Box,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Person } from 'models/person';

interface PayPersonModalProps {
  onClose: any;
  isOpen: boolean;
  onSave: any;
  person: Person;
}

export function PayPersonModal({
  onClose,
  isOpen,
  onSave,
  person,
}: PayPersonModalProps) {
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState('0');

  const handleSave = async () => {
    setLoading(true);
    await onSave(hours);
    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setHours('0');
    onClose();
  };

  const formatFloatInput = (str: string) => {
    return str.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
  };

  const hrs = hours ? parseFloat(hours) : 0;
  const receive = hrs * person.rate;
  const fees = receive * 0.01;
  const total = receive + fees;

  return (
    <Modal onClose={handleClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pay Person</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Box width="100%">
              <Text>Hours</Text>
              <Input
                placeholder="Hours"
                value={hours}
                onChange={(e) => setHours(formatFloatInput(e.target.value))}
              />
            </Box>

            <Table variant="simple" size="sm" mt={6}>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Hourly Rate:</Td>
                  <Td isNumeric>{person.rate}</Td>
                </Tr>
                <Tr>
                  <Td>Person will get:</Td>
                  <Td isNumeric>{receive.toFixed(8)}</Td>
                </Tr>
                <Tr>
                  <Td>Fees:</Td>
                  <Td isNumeric>{fees.toFixed(8)}</Td>
                </Tr>
                <Tr>
                  <Td>
                    <b>Total:</b>
                  </Td>
                  <Td isNumeric>
                    <b>{total.toFixed(8)} ETH</b>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={handleSave}
            isLoading={loading}
            background="black"
            color="white"
            _hover={{ background: '#333' }}
            ml={2}
          >
            Pay
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
