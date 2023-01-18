import React, { useEffect, useRef, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { Button } from 'react-bootstrap';
import { connectToMetamask, getAccounts } from '../utils/connectWallet';
import { shortenAddress } from '../utils/helpers';
import { NavLinkStyled } from './styles';

export default function Header () {
  const [accountAddress, setAccountAddress] = useState('');
  const account = useRef();

  const getWeb3Data = async () => {    
    await connectToMetamask();

    const accounts = await getAccounts();
    account.current = accounts[0];

    const _accountAddress = account.current ? shortenAddress(account.current) : '';
    setAccountAddress(_accountAddress);
  };

  useEffect(() => {
    getWeb3Data();
  },[]);

  return (
    <Navbar bg="dark" variant="dark">
      <Container style={{marginLeft: '31vw', marginRight: '7vw'}}>
        <Nav style={{gap: '3vw'}}>
          <NavLinkStyled to='/swap'>
            <Button variant='secondary'>
              Swap
            </Button>
          </NavLinkStyled>
          <NavLinkStyled to='/provide-liquidity'>
            <Button variant='secondary'>
              Provide Liquidity
            </Button>
          </NavLinkStyled>
          <NavLinkStyled to='/view-liquidity'>
            <Button variant='secondary'>
              View my Positions
            </Button>
          </NavLinkStyled>
        </Nav>
        <Button onClick={() => connectToMetamask()}>
          {accountAddress === '' ? 'Connect wallet' : accountAddress}
        </Button>
      </Container>
    </Navbar>
  );
}
