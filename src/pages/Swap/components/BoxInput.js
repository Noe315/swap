import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  Input,
  SwapBoxInput,
  SwapBoxInputArea,
  SwapBoxInputTitle,
  SwapBoxInputWrapper
} from '../../../components/styles';
import { Contracts } from '../../../constants/address';
import { getWeb3, getWeb3Data } from '../../../utils/connectWallet';
import SelectToken from './SelectToken/index';

// export default function BoxInput (props) {
const BoxInput = forwardRef((props, _ref) => {
  const token = useRef();
  // const [tokenSymbol, setTokenSymbol] = useState();
  const [web3, setWeb3] = useState();
  const [web3Data, setWeb3Data] = useState();
  const [balance, setBalance] = useState();
  // const balance = useRef();
  const [isSelectToken, setIsSelectToken] = useState();
  const [tokenInfo, setTokenInfo] = useState();

  useEffect(() => {
    const _web3 = getWeb3();
    setWeb3(_web3);
    _getWeb3Data();
    getBalance();
  }, []);

  useImperativeHandle(_ref, () => ({
    getTokenInfo: () => {
      return tokenInfo;
    }
  }));

  const _getWeb3Data = async () => {
    const _web3Data = await getWeb3Data();
    setWeb3Data(_web3Data);
  }

  const getBalance = async (address) => {
    if (web3) {
      const tokenContract = new web3.eth.Contract(Contracts.erc20.abi, address);
      let _balance = await tokenContract.methods.balanceOf(web3Data.address).call();
      const decimals = await tokenContract.methods.decimals().call();
      _balance = _balance / (10 ** decimals);
      setBalance(_balance);

      setTokenInfo(currentTokenInfo => {
        currentTokenInfo.balance = _balance;
        currentTokenInfo.decimal = decimals;
        return currentTokenInfo;
      });
    }
  };

  // const setPair = async () => {
  //   await getBalance();
  //   // await props.checkPairAndGetRate();
  // }

  const setToken = async (_token) => {
    setTokenInfo(_token);
    await getBalance(_token.address);
    props.onTokenSelect();
  }

  const showSelectToken = () => {
    setIsSelectToken(!isSelectToken);
  };
  return (
    <div>
      <SelectToken
        show={isSelectToken}
        handleClose={() => setIsSelectToken(false)}
        // pair={props.pair}
        // pair={pair}
        // tokenInfo={tokenInfo}
        // setPair={setPair}
        setTokenInfo={setTokenInfo}
        setToken={setToken}
        token={token}
        // setTokenSymbol={setTokenSymbol}
        name={props.name}
        // shouldApproveButtonDisabled={props.shouldApproveButtonDisabled}
      />
      <SwapBoxInputWrapper>
        <SwapBoxInput>
          <SwapBoxInputTitle>
            <div>Balance: {balance ? balance : '0'}</div>
            {/* <div>Balance: {tokenInfo ? tokenInfo.balance : '0'}</div> */}
          </SwapBoxInputTitle>

          <SwapBoxInputArea>
            <Input
              // type='number'
              placeholder='0.00'
              onChange={props.onChange}
              // name={props.name}
              value={props.value}
              // value={props.value.current}
              // value={props.inputValueState}
            />
            <Button
              style={{ marginLeft: 'auto' }}
              onClick={showSelectToken}
            >
              {token.current ? token.current : 'Select Token'}
              {/* {tokenSymbol ? tokenSymbol : 'Select Token'} */}
              {/* {tokenInfo ? tokenInfo.name : 'Select Token'} */}
            </Button>
          </SwapBoxInputArea>
        </SwapBoxInput>
      </SwapBoxInputWrapper>
    </div>
  );
});
// }

export default BoxInput;