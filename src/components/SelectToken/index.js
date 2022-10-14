import React, { useState } from 'react';
import styled from 'styled-components/macro';
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Contracts } from '../../constants/address';
import { getWeb3 } from '../../utils/connectWallet';
import TokenList from './TokenList';

export default function SelectToken (props) {
  const web3 = getWeb3();
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [tokenSymbol, setTokenSymbol] = useState();
  const [tokenAddress, setTokenAddress] = useState();
  const [isInputExist, setIsInputExist] = useState(false);
  
  const checkAddress = async (e) => {
    const addressValue = e.target.value;
    if (addressValue) {
      setIsInputExist(true);
    } else {
      setIsInputExist(false);
    }

    const _isAddressValid = web3.utils.isAddress(addressValue);
    if (_isAddressValid) {
      setIsAddressValid(true);
      const tokenContract = new web3.eth.Contract(Contracts.erc20.abi, addressValue);
      const tokenName = await tokenContract.methods.symbol().call();
      setTokenSymbol(tokenName);
      setTokenAddress(addressValue);
    } else {
      setIsAddressValid(false);
    }
  }

  const setToken = (_tokenAddress, _tokenSymbol) => {
    props.handleClose();
    // props.setToken(tokenSymbol ? tokenSymbol : _tokenSymbol);
    props.setToken(_tokenSymbol);
    props.setTokenAddress(_tokenAddress);
    setIsInputExist(false);
    // setTokenAddress();
  }

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Invalid>{isAddressValid ? '' : 'Invalid ERC-20 Token address, please only use Copy and Paste for addresses.'}</Invalid>
        <Input
          placeholder='Enter Token address'
          // placeholder={
          //   tokenSymbol ?
          //   tokenAddress :
          //   "Enter Token address"
          // }
          onChange={checkAddress}
        />
        {/* <div>{tokenSymbol}</div> */}
      </Modal.Body>
      <Modal.Body>
        <TokenList
          tokenAddress={tokenAddress}
          tokenSymbol={tokenSymbol}
          isInputExist={isInputExist}
          setToken={setToken}
        />
      </Modal.Body>
    </Modal>
  );
}

const Input = styled.input`
  width: 100%;
  border-radius: 9px;
`;

const Invalid = styled.div`
  color: red;
  padding-bottom: 1vw;
`;