// import React, { useState } from 'react';
// import Modal from 'react-bootstrap/Modal';
// import { Contracts } from '../../constants/address';
// import { getWeb3 } from '../../utils/connectWallet';
// import TokenList from './TokenList';
// import { Invalid, InputAddress } from '../styles';

// export default function SelectToken (props) {
//   const web3 = getWeb3();
//   const [isAddressValid, setIsAddressValid] = useState(false);
//   const [tokenSymbol, setTokenSymbol] = useState();
//   const [tokenAddress, setTokenAddress] = useState();
//   const [isInputExist, setIsInputExist] = useState(false);
  
//   const checkAddress = async (e) => {
//     const addressValue = e.target.value;
//     if (addressValue) {
//       setIsInputExist(true);
//     } else {
//       setIsInputExist(false);
//     }

//     const _isAddressValid = web3.utils.isAddress(addressValue);
//     if (_isAddressValid) {
//       setIsAddressValid(true);
//       const tokenContract = new web3.eth.Contract(Contracts.erc20.abi, addressValue);
//       const tokenName = await tokenContract.methods.symbol().call();
//       setTokenSymbol(tokenName);
//       setTokenAddress(addressValue);
//     } else {
//       setIsAddressValid(false);
//     }
//   }

//   const setToken = async (_tokenAddress, _tokenSymbol) => {
//     props.handleClose();
//     if (props.name === 'inputToken') {
//       props.pair.current = {
//         ...props.pair.current,
//         nameTokenIn: _tokenSymbol,
//         addressTokenIn: _tokenAddress,
//       };
//       props.token.current = props.pair.current.nameTokenIn;
//     } else {
//       props.pair.current = {
//         ...props.pair.current,
//         nameTokenOut: _tokenSymbol,
//         addressTokenOut: _tokenAddress,
//       };
//       props.token.current = props.pair.current.nameTokenOut;
//     }
//     props.shouldApproveButtonDisabled();
//     setIsInputExist(false);
//     await props.setPair();
//   }

//   return (
//     <Modal show={props.show} onHide={props.handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>Modal heading</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Invalid>{isAddressValid ? '' : 'Invalid ERC-20 Token address, please only use Copy and Paste for addresses.'}</Invalid>
//         <InputAddress
//           placeholder='Enter Token address'
//           onChange={checkAddress}
//         />
//       </Modal.Body>
//       <Modal.Body>
//         <TokenList
//           tokenAddress={tokenAddress}
//           tokenSymbol={tokenSymbol}
//           isInputExist={isInputExist}
//           setToken={setToken}
//         />
//       </Modal.Body>
//     </Modal>
//   );
// }

import React, { useEffect, useReducer, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import TokenList from './TokenList';
import { Contracts } from '../../constants/address';
import { getWeb3, getWeb3Data } from '../../utils/connectWallet';
import { InputAddress, Invalid } from '../styles';

export default function SelectToken (props) {
  const web3 = getWeb3();
  const web3Data = useRef();
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [tokenSymbol, setTokenSymbol] = useState();
  const [tokenName, setTokenName] = useState();
  const [tokenAddress, setTokenAddress] = useState();
  const [isInputExist, setIsInputExist] = useState(false);

  useEffect(() => {
    const _getWeb3Data = async () => {
      const _web3Data = await getWeb3Data();
      web3Data.current = _web3Data;
    };

    _getWeb3Data();
  }, []);
  
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
      
      const _tokenName = await tokenContract.methods.name().call();
      setTokenName(_tokenName);
      
      const _tokenSymbol = await tokenContract.methods.symbol().call();
      setTokenSymbol(_tokenSymbol);
      
      setTokenAddress(addressValue);
    } else {
      setIsAddressValid(false);
    }
  }

  const getBalance = async (address) => {
    const _web3Data = web3Data.current;
    if (web3) {
      const tokenContract = new web3.eth.Contract(Contracts.erc20.abi, address);
      let _balance = await tokenContract.methods.balanceOf(_web3Data.address).call();
      const decimals = await tokenContract.methods.decimals().call();
      _balance = _balance / (10 ** decimals);
      // setBalance(_balance);

      // setTokenInfo(currentTokenInfo => {
      //   currentTokenInfo.balance = _balance;
      //   currentTokenInfo.decimal = decimals;
      //   return currentTokenInfo;
      // });

      return {balance: _balance, decimals: decimals};
    }
  };

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

  const setToken = async (_tokenAddress, _tokenName, _tokenSymbol) => {
    // props.handleClose();
    handleCloseModal();
    // const info = await getBalance(_tokenAddress);
    const info = await getBalance(_tokenAddress);
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
        name: _tokenName,
        address: _tokenAddress,
        symbol: _tokenSymbol,
        balance: info.balance,
        decimals: info.decimals,
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
        name: _tokenName,
        address: _tokenAddress,
        symbol: _tokenSymbol,
        balance: info.balance,
        decimals: info.decimals,
      });
    }
    props.token.current = _tokenSymbol;
    // props.setTokenSymbol(_tokenSymbol);
    // props.shouldApproveButtonDisabled();
    //   setIsInputExist(false);
    //   await props.setPair();
  };

  const handleCloseModal = () => {
    props.handleClose();
    setIsInputExist(false);
  };

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
          tokenName={tokenName}
          isInputExist={isInputExist}
          setToken={setToken}
        />
      </Modal.Body>
    </Modal>
  );
}
