import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Contracts } from '../../constants/address';
import { getWeb3 } from '../../utils/connectWallet';
import TokenList from './TokenList';
import { Invalid, InputAddress } from '../styles';

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
    props.handleClose();
    if (props.name === 'inputToken') {
      props.pair.current = {
        ...props.pair.current,
        nameTokenIn: _tokenSymbol,
        addressTokenIn: _tokenAddress,
      };
      props.token.current = props.pair.current.nameTokenIn;
    } else {
      props.pair.current = {
        ...props.pair.current,
        nameTokenOut: _tokenSymbol,
        addressTokenOut: _tokenAddress,
      };
      props.token.current = props.pair.current.nameTokenOut;
    }
    props.shouldApproveButtonDisabled();
    setIsInputExist(false);
    await props.setPair();
  }

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Invalid>{isAddressValid ? '' : 'Invalid ERC-20 Token address, please only use Copy and Paste for addresses.'}</Invalid>
        <InputAddress
          placeholder='Enter Token address'
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
