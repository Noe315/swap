import React, { useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { Button } from 'react-bootstrap';
import { connectToMetamask, getAccounts } from '../utils/connectWallet';

export default function Header () {
  const [accountAddress, setAccountAddress] = useState('');

  useEffect(() => {
    const account = async () => {
      const accounts = await getAccounts();
      const accountShortened =
        accounts[0].substring(0, 6) +
        '...' +
        accounts[0].substring(accounts[0].length - 4, accounts[0].length);
      setAccountAddress(accountShortened);
    };
    account();
  }, [accountAddress]);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Nav className="m-auto">
          <Nav.Link href="swap">Swap</Nav.Link>
          <Nav.Link href="provide-liquidity">Provide liquidity</Nav.Link>
        </Nav>
        <Button onClick={() => connectToMetamask()}>
            {accountAddress === '' ? 'Connect wallet' : accountAddress}
          </Button>
      </Container>
    </Navbar>
  );
}
