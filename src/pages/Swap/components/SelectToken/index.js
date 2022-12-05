import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import TokenList from './TokenList';
import { Contracts } from '../../../../constants/address';
import { getWeb3, getWeb3Data } from '../../../../utils/connectWallet';
import { InputAddress, Invalid } from '../../../../components/styles';

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

  // const setToken = async (_tokenAddress, _tokenSymbol) => {
  //   props.handleClose();
  //   if (props.name === 'inputToken') {
  //     props.pair.current = {
  //       ...props.pair.current,
  //       nameTokenIn: _tokenSymbol,
  //       addressTokenIn: _tokenAddress,
  //     };
  //     props.token.current = props.pair.current.nameTokenIn;
  //   } else {
  //     props.pair.current = {
  //       ...props.pair.current,
  //       nameTokenOut: _tokenSymbol,
  //       addressTokenOut: _tokenAddress,
  //     };
  //     props.token.current = props.pair.current.nameTokenOut;
  //   }
  //   props.shouldApproveButtonDisabled();
  //   setIsInputExist(false);
  //   await props.setPair();
  // }

  const setToken = async (_tokenAddress, _tokenSymbol) => {
    props.handleClose();
    // const info = await getBalance(_tokenAddress);
    if (props.name === 'inputToken') {
      // props.setPair({
      //   ...props.pair,
      //   nameTokenIn: _tokenSymbol,
      //   addressTokenIn: _tokenAddress,
      // });

      // props.setTokenInfo({
      //   name: _tokenSymbol,
      //   address: _tokenAddress,
      // })

      await props.setToken({
        name: _tokenSymbol,
        address: _tokenAddress,
        // balance: info.balance,
        // decimal: info.decimal,
      });
    } else {
      // props.setPair({
      //   ...props.pair,
      //   nameTokenOut: _tokenSymbol,
      //   addressTokenOut: _tokenAddress,
      // });

      // props.setTokenInfo({
      //   name: _tokenSymbol,
      //   address: _tokenAddress,
      // });

      await props.setToken({
        name: _tokenSymbol,
        address: _tokenAddress,
        // balance: info.balance,
        // decimal: info.decimal,
      });
    }
    props.token.current = _tokenSymbol;
    // props.setTokenSymbol(_tokenSymbol);
    // props.shouldApproveButtonDisabled();
    //   setIsInputExist(false);
    //   await props.setPair();
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
