import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import './index.css';
import { Button } from 'react-bootstrap';
import SelectToken from './SelectToken';
import { getWeb3, getWeb3Data } from '../utils/connectWallet';
import { Contracts } from '../constants/address';

export default function BoxInput (props) {
  const token = useRef();
  const [isSelectToken, setIsSelectToken] = useState();
  const [balance, setBalance] = useState();
  // const balance = useRef();
  const [web3, setWeb3] = useState();
  const [web3Data, setWeb3Data] = useState();

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
      // balance.current = _balance;
    }
  };

  const _getWeb3Data = async () => {
    const _web3Data = await getWeb3Data();
    setWeb3Data(_web3Data);
  }

  useEffect(() => {
    const _web3 = getWeb3();
    setWeb3(_web3);
    _getWeb3Data();
    getBalance();
  }, []);

  const setPair = async () => {
    await getBalance();
    await props.disableButton();
  }

  const showSelectToken = () => {
    setIsSelectToken(!isSelectToken);
  };

  if (props.action === 'swap') {
    return (
      <SwapBoxInputWrapper>
        <SwapBoxInput>
          <SwapBoxInputTitle>
            <div>To</div>
            <div>Balance</div>
          </SwapBoxInputTitle>

          <SwapBoxInputArea>
            <Input
              type='number'
              placeholder='0.00'
              onChange={props.onChange}
              name={props.name}
              // value={props.value}
              value={props.value ? props.value.current : ''}
            />
            <TokenSelect>{props.token}</TokenSelect>
          </SwapBoxInputArea>
        </SwapBoxInput>
      </SwapBoxInputWrapper>
    );
  } else {
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
              {/* <div>Balance: {balance.current ? balance.current : '0'}</div> */}
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
              {/* <Button onClick={() => {
                console.log('props.token: ', props.token, ' token: ', token);
              }}>
                Test
              </Button> */}
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
}

const SwapBoxInputWrapper = styled.div`
  padding: 1vw;
  border: 1px solid;
  border-radius: 15px;
`;

const SwapBoxInput = styled.div`
  height: 12vh;
  display: flex;
  flex-direction: column;
  border-radius: 9px;
`;

const SwapBoxInputTitle = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 1vw;
  justify-content: space-between;
`;

const SwapBoxInputArea = styled.div`
  border: 1px solid;
  display: flex;
  flex-direction: row;
  border-radius: inherit;
`;

const Input = styled.input`
  width: 40vw;
  border-radius: inherit;
  border: none;
  padding-left: 1vw;

  ::-webkit-inner-spin-button{
      -webkit-appearance: none; 
      margin: 0; 
  }
  ::-webkit-outer-spin-button{
      -webkit-appearance: none; 
      margin: 0; 
  }
`;

const TokenSelect = styled.div`
  margin-left: auto;
  padding-right: 1vw;
  align-self: center;
`;
