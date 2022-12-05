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
  const [isInfo, setIsInfo] = useState(false);
  const [inputValueState, setInputValueState] = useState();
  const [outputValueState, setOutputValueState] = useState();
  const inputValue = useRef();
  const outputValue = useRef();
  const [isModalSlippage, setIsModalSlippage] = useState(false);
  const slippageAndDeadline = useRef();
  const tokenIn = useRef();
  const tokenOut = useRef();
  const [disableSwap, setDisableSwap] = useState(true);
  const [disableApprove, setDisableApprove] = useState(true);
  const [isAddressSame, setIsAddressSame] = useState(false);
  const isInputValid = useRef();
  const isOutputValid = useRef();

  const inputOnChange = (event) => {
    const value = event.target.value;
    const valueNumber = value.replace(/[^(0-9).]/gm, '');
    inputValue.current = valueNumber;
    checkInputAgainstBalance(valueNumber);
    shouldApproveButtonDisabled();
    setInputValueState(valueNumber);

    // if (value) {
    //   setIsInfo(true);
    //   setOutputValue(4);
    //   setDisabled(false);
    // } else {
    //   setIsInfo(false);
    //   setOutputValue('');
    //   setDisabled(true);
    // }
    // setInputValue();
  };

  const outputOnChange = (event) => {
    const value = event.target.value;
    const valueNumber = value.replace(/[^(0-9).]/gm, '');
    outputValue.current = valueNumber;
    checkOutputAgainstBalance(valueNumber);
    shouldApproveButtonDisabled();
    setOutputValueState(valueNumber);
    // if (value) {
    //   setIsInfo(true);
    //   setInputValue(3);
    //   setDisabled(false);
    // } else {
    //   setIsInfo(false);
    //   setInputValue('');
    //   setDisabled(true);
    // }
    // setOutputValue();
  }

  const checkInputAgainstBalance = (value) => {
    const infoTokenIn = tokenIn.current.getTokenInfo();

    if (value > infoTokenIn.balance) {
      isInputValid.current = false;
    } else {
      if (value > 0) {
        isInputValid.current = true;
      } else {
        isInputValid.current = false;
      }
    }
  };

  const checkOutputAgainstBalance = (value) => {
    const infoTokenOut = tokenOut.current.getTokenInfo();
    if (value > infoTokenOut.balance) {
      isOutputValid.current = false;
    } else {
      if (value > 0) {
        isOutputValid.current = true;
      } else {
        isOutputValid.current = false;
      }
    }
  };

  // const checkInputsAgainstBalance = (infoTokenIn, infoTokenOut) => {
  //   // const infoTokenIn = tokenIn.current.getTokenInfo();
  //   if (inputValue.current > infoTokenIn.balance) {
  //     isInputValid.current = false;
  //   } else {
  //     isInputValid.current = true;
  //   }
  //   // const infoTokenOut = tokenOut.current.getTokenInfo();
  //   if (outputValue.current > infoTokenOut.balance) {
  //     isOutputValid.current = false;
  //   } else {
  //     isOutputValid.current = true;
  //   }
  // };

  const shouldApproveButtonDisabled = () => {
    const infoTokenOut = tokenOut.current.getTokenInfo();
    const infoTokenIn = tokenIn.current.getTokenInfo();
    // checkInputsAgainstBalance(infoTokenIn, infoTokenOut);
    setDisableSwap(true);
    console.log(
      'isInputValid.current: ',
      isInputValid.current,
      ' isOutputValid.current: ',
      isOutputValid.current,
      ' inputValue.current: ',
      inputValue.current,
      ' outputValue.current: ',
      outputValue.current,
      ' infoTokenOut: ',
      infoTokenOut,
      ' infoTokenOut.balance: ',
      infoTokenOut.balance,
      ' infoTokenIn: ',
      infoTokenIn,
      ' outputValue.current > infoTokenOut.balance: ',
      outputValue.current > infoTokenOut.balance,
    );
    if (isInputValid.current && isOutputValid.current && inputValue.current && outputValue.current) {
    // if (isInputValid.current && isOutputValid.current && inputValue && outputValue) {
      setDisableApprove(false);
    } else {
      setDisableApprove(true);
    }
    if (infoTokenIn.address === infoTokenOut.address) {
      setDisableApprove(true);
      setIsAddressSame(true);
    } else {
      if (isInputValid.current && isOutputValid.current && inputValue.current && outputValue.current) {
      // if (isInputValid.current && isOutputValid.current && inputValue && outputValue) {
        setDisableApprove(false);
      }
      setIsAddressSame(false);
    }
  };

  const onTokenSelect = () => {
    resetInputs();
    const infoTokenIn = tokenIn.current.getTokenInfo();
    const infoTokenOut = tokenOut.current.getTokenInfo();
    if (infoTokenIn && infoTokenOut) {
      if (infoTokenIn.address === infoTokenOut.address) {
        setIsAddressSame(true);
      } else {
        setIsAddressSame(false);
      }
    }
    // shouldApproveButtonDisabled();
  };

  const resetInputs = () => {
    inputValue.current = '';
    outputValue.current = '';
    setInputValueState('');
    setOutputValueState('');
    shouldApproveButtonDisabled();
  }

  return (
    <BoxWrapper>
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
            'slippage: ',
            slippageAndDeadline.current.getSlippage(),
            ' deadline: ',
            slippageAndDeadline.current.getDeadline(),
            // ' pair: ',
            // pair.current.getPair(),
            ' tokenIn: ',
            tokenIn.current.getTokenInfo(),
            ' tokenOut: ',
            tokenOut.current.getTokenInfo(),
            ' disableApprove: ',
            disableApprove,
            ' inputValue: ',
            inputValue,
          ) 
        }
      >
        Test
      </Button>
      <Row>
        <BoxInput
          action='swap'
          value={inputValueState}
          onChange={inputOnChange}
          onTokenSelect={onTokenSelect}
          name='inputToken'
          ref={tokenIn}
        />
      </Row>
      <Row>
        <BoxInput
          action='swap'
          value={outputValueState}
          onChange={outputOnChange}
          onTokenSelect={onTokenSelect}
          name='outputToken'
          ref={tokenOut}
        />
      </Row>
      <Row>
        <BoxInfo action='swap' isInfo={isInfo}/>
      </Row>
      <Row>
        {
          isAddressSame
            ? <div style={{ color: 'red' }}>
                Addresses of input token and output token are the same,
                please use different addresses.
              </div>
            : ''
        }
      </Row>
      <Row>
        <Button disabled={disableApprove}>Approve</Button>
        <Button disabled={disableSwap}>Swap</Button>
      </Row>
    </BoxWrapper>
  );
}

const Row = styled.div`
  padding: 1vw;
`;
