import React, { useState } from 'react'
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import BoxInput from './BoxInput';
import BoxInfo from './BoxInfo';
import BoxWrapper from './BoxWrapper';
import TableHeader from './TableHeader';

export default function Swap () {
  const [tokenIn, setTokenIn] = useState('KAI');
  const [tokenOut, setTokenOut] = useState('USDC');
  const [isInfo, setIsInfo] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [outputValue, setOutputValue] = useState();
  const [disabled, setDisabled] = useState(true);
  
  const swapToken = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
  };

  const inputOnChange = (event) => {
    const value = event.target.value;
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
  };

  const outputOnChange = (event) => {
    const value = event.target.value;
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

  return (
    <BoxWrapper>
      <TableHeader action='swap' />
      <Row>
        <BoxInput
          action='swap'
          value={inputValue}
          onChange={inputOnChange}
          name='inputToken'
          token={tokenIn}
        />
      </Row>
      <Row>
        <Button onClick={swapToken}>⇅ Swap</Button>
      </Row>
      <Row>
        <BoxInput
          action='swap'
          value={outputValue}
          onChange={outputOnChange}
          name='outputToken'
          token={tokenOut}
        />
      </Row>
      <Row>
        <BoxInfo action='swap' isInfo={isInfo}/>
      </Row>
      <Row>
        <Button disabled={disabled}>Swap</Button>
      </Row>
    </BoxWrapper>
  );
}

const Row = styled.div`
  padding: 1vw;
`;
