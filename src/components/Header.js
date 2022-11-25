// import React, { useEffect, useRef, useState } from 'react'
import React, { useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { NavLink } from 'react-router-dom';
import { Button, NavDropdown } from 'react-bootstrap';
import { connectToMetamask, getAccounts } from '../utils/connectWallet';
import { shortenAddress } from '../utils/helpers';

export default function Header () {
  const [accountAddress, setAccountAddress] = useState('');
  // const accountAddress = useRef('');
  const [account, setAccount] = useState();
  // const account = useRef();

  const getWeb3Data = async () => {    
    await connectToMetamask();

    const accounts = await getAccounts();
    setAccount(accounts[0]);

    const _accountAddress = account ? shortenAddress(account) : '';
    setAccountAddress(_accountAddress);
  };

  // const setAddress = async () => {
  //   const accounts = await getAccounts();
  //   // setAccount(accounts[0]);
  //   account.current = accounts[0];
  //   const _accountAddress = account.current ? shortenAddress(account.current) : '';
  //   // setAccountAddress(_accountAddress);
  //   accountAddress.current = _accountAddress;
  //   console.log('hello');
  // }

  // const connectWallet = async () => {
  //   console.log('account: ', account, ' accountAddress: ', accountAddress);
  //   await connectToMetamask();
  //   const accounts = await getAccounts();
  //   setAccount(accounts[0]);
  //   const _accountAddress = account ? shortenAddress(account) : '';
  //   setAccountAddress(_accountAddress);
  //   setAddress();
  // };

  useEffect(() => {
    getWeb3Data();
    // setAddress();
  },[]);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Nav className="m-auto">
          <Nav.Link href="swap">Swap</Nav.Link>
          {/* <Nav.Link href="provide-liquidity">Liquidity</Nav.Link> */}
          <NavDropdown title="Liquidity">
            {/* <NavDropdown.Item href="/provide-liquidity">Provide Liquidity</NavDropdown.Item>
            <NavDropdown.Item href="/view-liquidity">View my Positions</NavDropdown.Item> */}
            <NavDropdown.Item>
              <NavLink to='/provide-liquidity'>
                Provide Liquidity
              </NavLink>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <NavLink to='/view-liquidity'>
                View my Positions
              </NavLink>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Button onClick={() => connectToMetamask()}>
        {/* <Button onClick={connectWallet}> */}
            {accountAddress === '' ? 'Connect wallet' : accountAddress}
            {/* {accountAddress.current === '' ? 'Connect wallet' : accountAddress.current} */}
        </Button>
      </Container>
    </Navbar>
  );
}
