import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  SwapBoxInputWrapper,
  SwapBoxInput,
  SwapBoxInputTitle,
  SwapBoxInputArea,
  Input,
} from '../../../components/styles';
import SelectToken from '../../../components/SelectToken';
import { getWeb3, getWeb3Data } from '../../../utils/connectWallet';
import { Contracts } from '../../../constants/address';

export default function BoxInput (props) {
  const token = useRef();
  const [web3, setWeb3] = useState();
  const [web3Data, setWeb3Data] = useState();
  const [balance, setBalance] = useState();
  const [isSelectToken, setIsSelectToken] = useState();

  useEffect(() => {
    const _web3 = getWeb3();
    setWeb3(_web3);
    _getWeb3Data();
    getBalance();
  }, []);

  const _getWeb3Data = async () => {
    const _web3Data = await getWeb3Data();
    setWeb3Data(_web3Data);
  }

  const getBalance = async () => {
    if (web3) {
      let tokenContract;
      if (props.name === 'inputToken') {
        tokenContract = new web3.eth.Contract(Contracts.erc20.abi, props.pair.current.addressTokenIn);
      } else {
        tokenContract = new web3.eth.Contract(Contracts.erc20.abi, props.pair.current.addressTokenOut);
      }
      let _balance = await tokenContract.methods.balanceOf(web3Data.address).call();
      const decimals = await tokenContract.methods.decimals().call();
      _balance = _balance / (10 ** decimals);
      setBalance(_balance);

      if (props.setBalanceIn) {
        props.setBalanceIn(_balance);
      } else {
        props.setBalanceOut(_balance);
      }
    }
  };

  const setPair = async () => {
    await getBalance();
    await props.checkPairAndGetRate();
  }

  const showSelectToken = () => {
    setIsSelectToken(!isSelectToken);
  };
  return (
    <div>
      <SelectToken
        show={isSelectToken}
        handleClose={() => setIsSelectToken(false)}
        pair={props.pair}
        setPair={setPair}
        token={token}
        name={props.name}
        shouldApproveButtonDisabled={props.shouldApproveButtonDisabled}
      />
      <SwapBoxInputWrapper>
        <SwapBoxInput>
          <SwapBoxInputTitle>
            <div>Balance: {balance ? balance : '0'}</div>
          </SwapBoxInputTitle>

          <SwapBoxInputArea>
            <Input
              type='number'
              placeholder='0.00'
              onChange={props.onChange}
              name={props.name}
              value={props.value}
              // value={props.value.current}
              // value={props.inputValueState}
            />
            <Button
              style={{ marginLeft: 'auto' }}
              onClick={showSelectToken}
            >
              {token.current ? token.current : 'Select Token'}
            </Button>
          </SwapBoxInputArea>
        </SwapBoxInput>
      </SwapBoxInputWrapper>
    </div>
  );
}
