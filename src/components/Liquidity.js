import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import BoxInput from './BoxInput';
import BoxWrapper from './BoxWrapper'
import TableHeader from './TableHeader';
import BoxInfo from './BoxInfo';
import { loadSmartContracts } from '../utils/connectWallet';
import { Contracts } from '../constants/address';
import SelectToken from './SelectToken';

export default function Liquidity () {
  const [tokenIn, setTokenIn] = useState('KAI');
  const [tokenOut, setTokenOut] = useState('USDC');
  const [isInfo, setIsInfo] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [outputValue, setOutputValue] = useState();
  const [disabled, setDisabled] = useState(true);
  const [contracts, setContracts] = useState();
  const [isPairExist, setIsPairExist] = useState();
  // const [isSelectToken, setIsSelectToken] = useState(false);

  // const showSelectToken = () => {
  //   setIsSelectToken(!isSelectToken);
  // };

  const inputOnChange = (event) => {
    const value = event.target.value;
    if (isPairExist) {
      if (value) {
        setIsInfo(true);
        setOutputValue(4);
        setDisabled(false);
      } else {
        setIsInfo(false);
        setOutputValue('');
        setDisabled(true);
      }
      setInputValue();
    }
  };

  const outputOnChange = (event) => {
    const value = event.target.value;
    if (isPairExist) {
      if (value) {
        setIsInfo(true);
        setInputValue(3);
        setDisabled(false);
      } else {
        setIsInfo(false);
        setInputValue('');
        setDisabled(true);
      }
      setOutputValue();
    }
  }

  const getWeb3Data = () => {
    const _contracts = loadSmartContracts([...Object.values(Contracts)]);
    setContracts(_contracts);
  };

  const provide = async () => {
    const pair = await contracts.factory.methods.getPair(
      '0x2b83cEAA2fE8b905D54504AE0Ea589D6f3102BDa',
      '0x1d247B2704d1546675275729A1473E3e8dBca98c',
    ).call();
    const pairInt = parseInt(pair, 16);
    if (pairInt === 0) {
      setIsPairExist(false);
      console.log("pair doesn't exist, create?");
    } else {
      setIsPairExist(true);
    }
  }

  useEffect(() => {
    getWeb3Data();
  },[]);

  return (
    // <div>
    //   {isSelectToken ? <SelectToken /> : null}
    // </div>
    <BoxWrapper>
      <TableHeader action='provide' />
      <Row>
        <BoxInput
          action='provide'
          value={inputValue}
          onChange={inputOnChange}
          name='inputToken'
          token={tokenIn}
          // setIsSelectToken={showSelectToken}
        />
      </Row>
      <Row>
        <BoxInput
          action='provide'
          value={outputValue}
          onChange={outputOnChange}
          name='outputToken'
          token={tokenOut}
          // setIsSelectToken={showSelectToken}
        />
      </Row>
      <Row>
        <BoxInfo action='provide' isInfo={isInfo}/>
      </Row>
      <Row>
        <Button disabled={disabled} onClick={provide}>Provide Liquidity</Button>
      </Row>
    </BoxWrapper>
  );
}

const Row = styled.div`
  padding: 1vw;
`;
