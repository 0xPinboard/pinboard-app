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
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Person } from 'models/person';

interface UpdatePersonModalProps {
  onClose: any;
  isOpen: boolean;
  onSave: any;
  person: Person;
}

export function UpdatePersonModal({
  onClose,
  isOpen,
  onSave,
  person,
}: UpdatePersonModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(person.name);
  const [wallet, setWallet] = useState(person.wallet);
  const [role, setRole] = useState(person.role);
  const [rate, setRate] = useState(person.rate.toString());
  const saveEnabled = name && wallet && role && rate;

  useEffect(() => {
    setName(person.name);
    setRole(person.role);
    setWallet(person.wallet);
    setRate(person.rate.toString());
  }, [person]);

  const handleSave = async () => {
    setLoading(true);
    await onSave({ name, wallet, role, rate });
    setLoading(false);
    onClose();
  };

  const formatFloatInput = (str: string) => {
    return str.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Person</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Box width="100%">
              <Text>Name</Text>
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box width="100%">
              <Text>Wallet Address (Ethereum)</Text>
              <Input
                placeholder="Wallet"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
              />
            </Box>
            <Box width="100%">
              <Text>Role</Text>
              <Input
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </Box>
            <Box width="100%">
              <Text>Hourly Rate (ETH)</Text>
              <Input
                placeholder="Hourly Rate (ETH)"
                value={rate}
                onChange={(e) => setRate(formatFloatInput(e.target.value))}
              />
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
          <Button
            onClick={handleSave}
            isLoading={loading}
            isDisabled={!saveEnabled}
            background="black"
            color="white"
            _hover={{ background: '#333' }}
            ml={2}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
