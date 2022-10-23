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

  const setToken = async (_tokenAddress, _tokenSymbol) => {
  // const setToken = (_tokenAddress, _tokenSymbol) => {
    props.handleClose();
    let pair = props.pair;
    if (props.name === 'inputToken') {
      // if (_tokenAddress === props.pair.current.addressTokenOut) {
      if (_tokenAddress === props.pair.addressTokenOut) {
        // props.pair.current = {
        //   nameTokenIn: _tokenSymbol,
        //   addressTokenIn: _tokenAddress,
        //   nameTokenOut: props.pair.current.nameTokenIn,
        //   addressTokenOut: props.pair.current.addressTokenIn,
        // };

        pair = {
          nameTokenIn: _tokenSymbol,
          addressTokenIn: _tokenAddress,
          nameTokenOut: props.pair.nameTokenIn,
          addressTokenOut: props.pair.addressTokenIn,
        };
        console.log('pair: ', pair);
        props.setPair(pair);

        // props.setPair({
        //   nameTokenIn: _tokenSymbol,
        //   addressTokenIn: _tokenAddress,
        //   nameTokenOut: props.pair.nameTokenIn,
        //   addressTokenOut: props.pair.addressTokenIn,
        // });
      } else {
        // props.pair.current = {
        //   ...props.pair.current,
        //   nameTokenIn: _tokenSymbol,
        //   addressTokenIn: _tokenAddress,
        // };

        pair = {
          nameTokenIn: _tokenSymbol,
          addressTokenIn: _tokenAddress,
          nameTokenOut: props.pair.nameTokenIn,
          addressTokenOut: props.pair.addressTokenIn,
        };
        console.log('pair: ', pair);
        props.setPair(pair);

        // props.setPair({
        //   ...props.pair,
        //   nameTokenIn: _tokenSymbol,
        //   addressTokenIn: _tokenAddress,
        // });
      }
      // const _token = props.pair.current.nameTokenIn;
      // props.setToken(props.pair.current.nameTokenIn);
      console.log('props.token.current: ', props.token.current);
      // props.token.current = props.pair.current.nameTokenIn;
      
      props.token.current = props.pair.nameTokenIn;
      console.log('props.token.current: ', props.token.current);
    } else {
      // if (_tokenAddress === props.pair.current.addressTokenIn) {
      if (_tokenAddress === props.pair.addressTokenIn) {
        // props.pair.current = {
        //   nameTokenIn: props.pair.current.nameTokenOut,
        //   addressTokenIn: props.pair.current.addressTokenOut,
        //   nameTokenOut: _tokenSymbol,
        //   addressTokenOut: _tokenAddress,
        // };

        props.setPair({
          nameTokenIn: props.pair.nameTokenOut,
          addressTokenIn: props.pair.addressTokenOut,
          nameTokenOut: _tokenSymbol,
          addressTokenOut: _tokenAddress,
        });
      } else {
        // props.pair.current = {
        //   ...props.pair.current,
        //   nameTokenOut: _tokenSymbol,
        //   addressTokenOut: _tokenAddress,
        // };

        props.setPair({
          ...props.pair,
          nameTokenOut: _tokenSymbol,
          addressTokenOut: _tokenAddress,
        });
      }
      // const _token = props.pair.current.nameTokenOut;
      // props.setToken(props.pair.current.nameTokenOut);
      console.log('props.token.current: ', props.token.current);
      // props.token.current = props.pair.current.nameTokenOut;
      
      props.token.current = props.pair.nameTokenOut;
      console.log('props.token.current: ', props.token.current);
    }
    await props.setPair();
    setIsInputExist(false);
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