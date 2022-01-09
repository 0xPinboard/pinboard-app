import type { NextPage } from 'next';
import {
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
} from '@chakra-ui/react';
import { Page } from 'components/structural/Page';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { usePeople } from 'hooks/usePeople';
import { Person } from 'models/person';
import { AddPersonModal } from 'components/modals/AddPersonModal';
import { UpdatePersonModal } from 'components/modals/UpdatePersonModal';
import { PayPersonModal } from 'components/modals/PayPersonModal';

const EMPTY_PERSON: Person = {
  board: '',
  name: '',
  role: '',
  wallet: '',
  rate: 0,
};

const Home: NextPage = () => {
  const router = useRouter();
  const addPersonModalCtrl = useDisclosure();
  const updatePersonModalCtrl = useDisclosure();
  const payPersonModalCtrl = useDisclosure();
  const {
    people,
    getPeople,
    removePerson,
    addPerson,
    updatePerson,
    payPerson,
  } = usePeople();
  const { address } = router.query;
  const contract = address ? address.toString() : null;

  const [personToUpdate, setPersonToUpdate] = useState<Person>(EMPTY_PERSON);
  const [personToPay, setPersonToPay] = useState<Person>(EMPTY_PERSON);

  useEffect(() => {
    if (contract) {
      getPeople(contract);
    }
  }, [contract]);

  const handleUpdateModalOpen = (person: Person) => () => {
    setPersonToUpdate(person);
    updatePersonModalCtrl.onOpen();
  };

  const handlePayModelOpen = (person: Person) => () => {
    setPersonToPay(person);
    payPersonModalCtrl.onOpen();
  };

  return (
    <Page>
      <Heading as="h3" size="md">
        Your Pinboard
      </Heading>

      <Button onClick={addPersonModalCtrl.onOpen}>Add Person</Button>
      <AddPersonModal
        {...addPersonModalCtrl}
        onSave={(person: Person) => addPerson(contract, person)}
      />

      {/* Modals */}
      <UpdatePersonModal
        {...updatePersonModalCtrl}
        person={personToUpdate}
        onSave={(person: Person) => updatePerson(contract, person)}
      />
      <PayPersonModal
        {...payPersonModalCtrl}
        person={personToPay}
        onSave={(hours: number) => payPerson(contract, personToPay, hours)}
      />
      {/* Modals */}

      <Table variant="simple" size="sm" mt={6}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Role</Th>
            <Th>Wallet</Th>
            <Th isNumeric>Rate</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {people.map((person: Person) => (
            <Tr key={person.wallet}>
              <Td>{person.name}</Td>
              <Td>{person.role}</Td>
              <Td>{person.wallet}</Td>
              <Td isNumeric>{person.rate}</Td>
              <Td>
                <Button
                  size="xs"
                  onClick={() => {
                    removePerson(contract, person);
                  }}
                >
                  Remove
                </Button>
                <Button
                  size="xs"
                  ml={1}
                  onClick={handleUpdateModalOpen(person)}
                >
                  Update
                </Button>
                <Button size="xs" ml={1} onClick={handlePayModelOpen(person)}>
                  Pay
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Page>
  );
};

export default Home;
