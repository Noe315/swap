// import React, { useEffect, useRef, useState } from 'react';
// import { Button } from 'react-bootstrap';
// import SelectToken from './SelectToken';
// import { getWeb3, getWeb3Data } from '../utils/connectWallet';
// import { Contracts } from '../constants/address';
// import {
//   SwapBoxInputWrapper,
//   SwapBoxInput,
//   SwapBoxInputTitle,
//   SwapBoxInputArea,
//   Input,
//   TokenSelect,
// } from './styles';

// export default function BoxInput (props) {
//   const token = useRef();
//   const [web3, setWeb3] = useState();
//   const [web3Data, setWeb3Data] = useState();
//   const [balance, setBalance] = useState();
//   const [isSelectToken, setIsSelectToken] = useState();

//   useEffect(() => {
//     const _web3 = getWeb3();
//     setWeb3(_web3);
//     _getWeb3Data();
//     getBalance();
//   }, []);

//   const _getWeb3Data = async () => {
//     const _web3Data = await getWeb3Data();
//     setWeb3Data(_web3Data);
//   }

//   const getBalance = async () => {
//     if (web3) {
//       let tokenContract;
//       if (props.name === 'inputToken') {
//         tokenContract = new web3.eth.Contract(Contracts.erc20.abi, props.pair.current.addressTokenIn);
//       } else {
//         tokenContract = new web3.eth.Contract(Contracts.erc20.abi, props.pair.current.addressTokenOut);
//       }
//       let _balance = await tokenContract.methods.balanceOf(web3Data.address).call();
//       const decimals = await tokenContract.methods.decimals().call();
//       _balance = _balance / (10 ** decimals);
//       setBalance(_balance);

//       if (props.setBalanceIn) {
//         props.setBalanceIn(_balance);
//       } else {
//         props.setBalanceOut(_balance);
//       }
//     }
//   };

//   const setPair = async () => {
//     await getBalance();
//     await props.checkPairAndGetRate();
//   }

//   const showSelectToken = () => {
//     setIsSelectToken(!isSelectToken);
//   };

//   if (props.action === 'swap') {
//     return (
//       <SwapBoxInputWrapper>
//         <SwapBoxInput>
//           <SwapBoxInputTitle>
//             <div>To</div>
//             <div>Balance</div>
//           </SwapBoxInputTitle>

//           <SwapBoxInputArea>
//             <Input
//               type='number'
//               placeholder='0.00'
//               onChange={props.onChange}
//               name={props.name}
//               // value={props.value}
//               value={props.value ? props.value.current : ''}
//             />
//             <TokenSelect>{props.token}</TokenSelect>
//           </SwapBoxInputArea>
//         </SwapBoxInput>
//       </SwapBoxInputWrapper>
//     );
//   } else {
//     return (
//       <div>
//         <SelectToken
//           show={isSelectToken}
//           handleClose={() => setIsSelectToken(false)}
//           pair={props.pair}
//           setPair={setPair}
//           token={token}
//           name={props.name}
//           shouldApproveButtonDisabled={props.shouldApproveButtonDisabled}
//         />
//         <SwapBoxInputWrapper>
//           <SwapBoxInput>
//             <SwapBoxInputTitle>
//               <div>Balance: {balance ? balance : '0'}</div>
//             </SwapBoxInputTitle>

//             <SwapBoxInputArea>
//               <Input
//                 type='number'
//                 placeholder='0.00'
//                 onChange={props.onChange}
//                 name={props.name}
//                 value={props.value}
//                 // value={props.value.current}
//                 // value={props.inputValueState}
//               />
//               <Button
//                 style={{ marginLeft: 'auto' }}
//                 onClick={showSelectToken}
//               >
//                 {token.current ? token.current : 'Select Token'}
//               </Button>
//             </SwapBoxInputArea>
//           </SwapBoxInput>
//         </SwapBoxInputWrapper>
//       </div>
//     );
//   }
// }

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  Input,
  SwapBoxInput,
  SwapBoxInputArea,
  SwapBoxInputTitle,
  SwapBoxInputWrapper
} from './styles';
import { Contracts } from '../constants/address';
import { getWeb3, getWeb3Data } from '../utils/connectWallet';
import SelectToken from './SelectToken/index';

const BoxInput = forwardRef((props, _ref) => {
  const token = useRef();
  const [web3, setWeb3] = useState();
  const [web3Data, setWeb3Data] = useState();
  const [balance, setBalance] = useState();
  const [isSelectToken, setIsSelectToken] = useState();
  const [tokenInfoState, setTokenInfoState] = useState();
  const tokenInfo = useRef();

  useEffect(() => {
    const _web3 = getWeb3();
    setWeb3(_web3);
    _getWeb3Data();
    // getBalance();
  }, []);

  useImperativeHandle(_ref, () => ({
    getTokenInfo: () => {
      return tokenInfo.current;
    }
  }));

  const _getWeb3Data = async () => {
    const _web3Data = await getWeb3Data();
    setWeb3Data(_web3Data);
  }

  // const getBalance = async (address) => {
  //   if (web3) {
  //     const tokenContract = new web3.eth.Contract(Contracts.erc20.abi, address);
  //     let _balance = await tokenContract.methods.balanceOf(web3Data.address).call();
  //     const decimals = await tokenContract.methods.decimals().call();
  //     _balance = _balance / (10 ** decimals);
  //     setBalance(_balance);

  //     setTokenInfo(currentTokenInfo => {
  //       currentTokenInfo.balance = _balance;
  //       currentTokenInfo.decimal = decimals;
  //       return currentTokenInfo;
  //     });
  //   }
  // };

  const setToken = async (_token) => {
    tokenInfo.current = _token;
    setTokenInfoState(_token);
    // await getBalance(_token.address);
    await props.onTokenSelect();
  }

  const showSelectToken = () => {
    setIsSelectToken(!isSelectToken);
  };
  return (
    <div>
      <SelectToken
        show={isSelectToken}
        handleClose={() => setIsSelectToken(false)}
        setTokenInfo={setTokenInfoState}
        setToken={setToken}
        token={token}
        name={props.name}
      />
      <SwapBoxInputWrapper>
        <SwapBoxInput>
          <SwapBoxInputTitle>
            {/* <div>Balance: {balance ? balance : '0'}</div> */}
            <div>Balance: {tokenInfo.current ? tokenInfo.current.balance : '0'}</div>
          </SwapBoxInputTitle>

          <SwapBoxInputArea>
            <Input
              placeholder='0.00'
              onChange={props.onChange}
              value={props.value}
            />
            <Button
              style={{ marginLeft: 'auto' }}
              onClick={showSelectToken}
            >
              {/* {token.current ? token.current : 'Select Token'} */}
              {tokenInfo.current ? tokenInfo.current.symbol : 'Select Token'}
            </Button>
          </SwapBoxInputArea>
        </SwapBoxInput>
      </SwapBoxInputWrapper>
    </div>
  );
});
// }

export default BoxInput;