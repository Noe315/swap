import React, { useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { Button, NavDropdown } from 'react-bootstrap';
import { connectToMetamask, getAccounts, loadSmartContracts } from '../utils/connectWallet';
import { Contracts } from '../constants/address';
import { shortenAddress } from '../utils/helpers';

export default function Header () {
  const [accountAddress, setAccountAddress] = useState('');
  const [contracts, setContracts] = useState();
  const [account, setAccount] = useState();

  const getWeb3Data = async () => {
    const _contracts = loadSmartContracts([...Object.values(Contracts)]);
    setContracts(_contracts);
    
    await connectToMetamask();

    const accounts = await getAccounts();
    setAccount(accounts[0]);

    const _accountAddress = shortenAddress(account);
    setAccountAddress(_accountAddress);
  };

  const getPrice = async () => {
    const price = await contracts.oracle.methods.getLatestPrice().call();
    console.log('price: ', price);
  };

  useEffect(() => {
    getWeb3Data();
  }, []);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Nav className="m-auto">
          <Nav.Link href="swap">Swap</Nav.Link>
          {/* <Nav.Link href="provide-liquidity">Liquidity</Nav.Link> */}
          <NavDropdown title="Liquidity">
            <NavDropdown.Item href="/provide-liquidity">Provide Liquidity</NavDropdown.Item>
            <NavDropdown.Item href="/view-liquidity">View my Positions</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Button onClick={() => connectToMetamask()}>
            {accountAddress === '' ? 'Connect wallet' : accountAddress}
        </Button>
        <Button onClick={getPrice}>
          Test
        </Button>
      </Container>
    </Navbar>
  );
}
