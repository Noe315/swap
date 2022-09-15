import React, { useState } from 'react';
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import BoxInput from './BoxInput';
import BoxWrapper from './BoxWrapper'
import TableHeader from './TableHeader';
import BoxInfo from './BoxInfo';

export default function Liquidity () {
  const [tokenIn, setTokenIn] = useState('KAI');
  const [tokenOut, setTokenOut] = useState('USDC');
  const [isInfo, setIsInfo] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [outputValue, setOutputValue] = useState();
  const [disabled, setDisabled] = useState(true);

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
      <TableHeader action='provide' />
      <Row>
        <BoxInput
          action='provide'
          value={inputValue}
          onChange={inputOnChange}
          name='inputToken'
          token={tokenIn}
        />
      </Row>
      <Row>
        <BoxInput
          action='provide'
          value={outputValue}
          onChange={outputOnChange}
          name='outputToken'
          token={tokenOut}
        />
      </Row>
      <Row>
        <BoxInfo action='provide' isInfo={isInfo}/>
      </Row>
      <Row>
        <Button disabled={disabled}>Provide Liquidity</Button>
      </Row>
    </BoxWrapper>
  );
}

const Row = styled.div`
  padding: 1vw;
`;
