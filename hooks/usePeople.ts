import { useState } from 'react';
import { ethers } from 'ethers';
import { Person } from 'models/person';
import pinboardContract from 'contracts/pinboard.abi.json';

export function usePeople() {
  const [people, setPeople] = useState([]);

  const { ethereum } =
    typeof window !== 'undefined' ? window : { ethereum: '' };

  const addPerson = async (address: string | null, person: Person) => {
    if (!address) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract: any = new ethers.Contract(
      address ? address.toString() : '',
      pinboardContract.abi,
      signer,
    );

    const { name, role, wallet, rate } = person;
    const preparedRate = ethers.utils.parseEther(`${rate}`);

    await contract.addPerson(name, role, wallet, preparedRate.toString());
  };

  const removePerson = async (address: string | null, person: Person) => {
    if (!address) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract: any = new ethers.Contract(
      address ? address.toString() : '',
      pinboardContract.abi,
      signer,
    );

    await contract.removePerson(person.wallet);
  };

  const updatePerson = async (address: string | null, person: Person) => {
    if (!address) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract: any = new ethers.Contract(
      address ? address.toString() : '',
      pinboardContract.abi,
      signer,
    );

    const { name, role, wallet, rate } = person;
    const preparedRate = ethers.utils.parseEther(`${rate}`);

    await contract.updatePerson(name, role, wallet, preparedRate);
  };

  const getPeople = async (address: string) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract: any = new ethers.Contract(
      address ? address.toString() : '',
      pinboardContract.abi,
      signer,
    );

    const data = await contract.listPeople();

    const prepared = data
      .map((p: Person) => ({
        name: p.name,
        role: p.role,
        wallet: p.wallet,
        rate: ethers.utils.formatEther(p.rate),
      }))
      .filter(
        (p: Person) =>
          p.wallet !== '0x0000000000000000000000000000000000000000',
      );

    setPeople(prepared);
  };

  const payPerson = async (
    address: string | null,
    person: Person,
    hours: number,
  ) => {
    if (!address) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract: any = new ethers.Contract(
      address,
      pinboardContract.abi,
      signer,
    );

    const receive = hours * person.rate;
    const fees = receive * 0.01;
    const total = receive + fees;

    const priceObj = ethers.utils.parseEther(`${total}`);
    const gasPrice = await provider.getGasPrice();

    await contract.payOne(person.wallet, hours, {
      value: priceObj,
      gasLimit: 80000,
      gasPrice: gasPrice.toNumber(),
    });
  };

  return {
    people,
    addPerson,
    removePerson,
    updatePerson,
    getPeople,
    payPerson,
  };
}
