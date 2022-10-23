import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import './index.css';
import { Button } from 'react-bootstrap';
import SelectToken from './SelectToken';
import { getWeb3, getWeb3Data } from '../utils/connectWallet';
import { Contracts } from '../constants/address';

export default function BoxInput (props) {
  // const [token, setToken] = useState();
  const token = useRef();
  // const [tokenAddress, setTokenAddress] = useState(
  //   props.name === 'inputToken' ?
  //   props.pair.current.addressTokenIn :
  //   props.pair.current.addressTokenOut
  // );
  const [isSelectToken, setIsSelectToken] = useState();
  const [balance, setBalance] = useState();
  const [web3, setWeb3] = useState();
  const [web3Data, setWeb3Data] = useState();

  const getBalance = async () => {
    if (web3) {
      let tokenContract;
      if (props.name === 'inputToken') {
        // tokenContract = new web3.eth.Contract(Contracts.erc20.abi, props.pair.current.addressTokenIn);
        console.log('props.pair.addressTokenIn: ', props.pair.addressTokenIn);
        console.log('props.pair: ', props.pair);
        tokenContract = new web3.eth.Contract(Contracts.erc20.abi, props.pair.addressTokenIn);
      } else {
        // tokenContract = new web3.eth.Contract(Contracts.erc20.abi, props.pair.current.addressTokenOut);
        tokenContract = new web3.eth.Contract(Contracts.erc20.abi, props.pair.addressTokenOut);
      }
      let _balance = await tokenContract.methods.balanceOf(web3Data.address).call();
      const decimals = await tokenContract.methods.decimals().call();
      _balance = _balance / (10 ** decimals);
      setBalance(_balance);
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
    console.log('props.pair: ', props.pair, ' props.token: ', props.token);
    props.disableButton();
    await getBalance();
  }

  const showSelectToken = () => {
    console.log('token: ', token);
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
              value={props.value}
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
          setPairLiquidity={props.setPair}
          // setToken={setToken}
          token={token}
          name={props.name}
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
              />
              <Button onClick={() => {
                console.log('props.token: ', props.token, ' token: ', token);
              }}>
                Test
              </Button>
              <Button
                style={{ marginLeft: 'auto' }}
                onClick={showSelectToken}
              >
                {/* {props.token.current ? props.token.current : 'Select Token'} */}
                {/* {token ? token : 'Select Token'} */}
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
