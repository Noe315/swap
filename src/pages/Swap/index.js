import React, { useRef, useState } from 'react'
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import BoxInput from '../../components/BoxInput';
import BoxInfo from '../../components/BoxInfo';
import BoxWrapper from '../../components/BoxWrapper';
import { TableHeader } from '../../components/styles';
import ModalSlippage from '../../components/ModalSlippage';
import { DEFAULT_SLIPPAGE } from '../../constants/address';

export default function Swap () {
  const [tokenIn, setTokenIn] = useState('KAI');
  const [tokenOut, setTokenOut] = useState('USDC');
  const [isInfo, setIsInfo] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [outputValue, setOutputValue] = useState();
  const [disabled, setDisabled] = useState(true);
  const [isModalSlippage, setIsModalSlippage] = useState(false);
  const slippageAndDeadline = useRef();
  
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
      {/* <TableHeader ref={slippageAndDeadline} /> */}
      <TableHeader>
        <div>Swap</div>
        <ModalSlippage
          show={isModalSlippage}
          handleClose={() => setIsModalSlippage(false)}
          ref={slippageAndDeadline}
        />
        <div
          style={{ marginLeft: 'auto', paddingRight: '1vw' }}
          onClick={() => setIsModalSlippage(true)}
        >
          Slippage {' '}
          {
            slippageAndDeadline.current
            ? slippageAndDeadline.current.getSlippage()
              ? Math.round(slippageAndDeadline.current.getSlippage() * 100) / 100
              : DEFAULT_SLIPPAGE
            : DEFAULT_SLIPPAGE
          } %
        </div>
      </TableHeader>
      <Button onClick={
          () => console.log(
            'slippageAndDeadline: ',
            slippageAndDeadline.current.getSlippage(),
            ' ',
            slippageAndDeadline.current.getDeadline()
          ) 
        }
      >
        Test
      </Button>
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
