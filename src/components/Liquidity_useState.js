import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import BoxInput from './BoxInput';
import BoxWrapper from './BoxWrapper'
import TableHeader from './TableHeader';
import BoxInfo from './BoxInfo';
import { getAccounts, loadSmartContracts } from '../utils/connectWallet';
import { Contracts } from '../constants/address';
import SelectToken from './SelectToken';

export default function Liquidity () {
  const [tokenIn, setTokenIn] = useState();
  const [tokenOut, setTokenOut] = useState();
  const [isInfo, setIsInfo] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [outputValue, setOutputValue] = useState();
  const [disabled, setDisabled] = useState(true);
  const [contracts, setContracts] = useState();
  const [isPairExist, setIsPairExist] = useState();
  const [pair, setPair] = useState({
    nameTokenIn: '',
    nameTokenOut: '',
    addressTokenIn: '',
    addressTokenOut: '',
  });
  // const [nameTokenIn, setNameTokenIn] = useState();
  // const [nameTokenOut, setNameTokenOut] = useState();
  // const [addressTokenIn, setAddressTokenIn] = useState();
  // const [addressTokenOut, setAddressTokenOut] = useState();
  const [amountADesired, setAmountADesired] = useState();
  const [amountBDesired, setAmountBDesired] = useState();
  const [address, setAddress] = useState();
  // const [isSelectToken, setIsSelectToken] = useState(false);

  // const showSelectToken = () => {
  //   setIsSelectToken(!isSelectToken);
  // };
  const checkDisableButton = () => {
    console.log('pair.addressTokenIn: ', pair.addressTokenIn, ' pair.addressTokenOut: ', pair.addressTokenOut);
    if (
      pair.addressTokenIn &&
      pair.addressTokenOut &&
      pair.nameTokenIn &&
      pair.nameTokenOut &&
      pair.addressTokenIn !== pair.addressTokenOut
    )
    // if (addressTokenIn && addressTokenOut && nameTokenIn && nameTokenOut) {
    {
      setDisabled(false);
    }

    setTokenIn(pair.nameTokenIn)
    setTokenOut(pair.nameTokenOut)
    
    // setTokenIn(nameTokenIn);
    // setTokenOut(nameTokenOut);
  }

  const inputOnChange = (event) => {
    const value = event.target.value;
    setAmountADesired(value);
    // if (isPairExist) {
    //   if (value) {
    //     setIsInfo(true);
    //     // setOutputValue(4);
    //     setDisabled(false);
    //   } else {
    //     setIsInfo(false);
    //     setOutputValue('');
    //     setDisabled(true);
    //   }
    //   setInputValue();
    // }
  };

  const outputOnChange = (event) => {
    const value = event.target.value;
    setAmountBDesired(value);
    // if (isPairExist) {
    //   if (value) {
    //     setIsInfo(true);
    //     // setInputValue(3);
    //     setDisabled(false);
    //   } else {
    //     setIsInfo(false);
    //     setInputValue('');
    //     setDisabled(true);
    //   }
    //   setOutputValue();
    // }
  }

  const getWeb3Data = async () => {
    const _contracts = loadSmartContracts([...Object.values(Contracts)]);
    setContracts(_contracts);

    const addresses = await getAccounts();
    setAddress(addresses[0]);
  };

  const provide = async () => {
    const _pair1 = await contracts.factory.methods.getPair(
      pair.addressTokenIn,
      pair.addressTokenOut,
      // addressTokenIn,
      // addressTokenOut
    ).call();
    const _pair2 = await contracts.factory.methods.getPair(
      pair.addressTokenOut,
      pair.addressTokenIn,
      // addressTokenOut,
      // addressTokenIn,
    ).call();
    const pair1Int = parseInt(_pair1, 16);
    const pair2Int = parseInt(_pair2, 16);
    // if (pair1Int === 0 && pair2Int === 0) {
    //   setIsPairExist(false);
    //   console.log("pair doesn't exist, create?");
    // } else {
    //   setIsPairExist(true);
    // }

    const res = await contracts.router.methods.addLiquidity(
      pair.addressTokenIn,
      pair.addressTokenOut,
      // addressTokenIn,
      // addressTokenOut,
      amountADesired,
      amountBDesired,
      amountADesired * 0.95,
      amountBDesired * 0.95,
      address,
      1666032518
    ).send({ from: address });
    console.log('res: ', res);
  }

  const test = () => {
    // console.log(
    //   'nameTokenIn: ',
    //   nameTokenIn,
    //   ' addressTokenIn: ',
    //   addressTokenIn,
    //   ' nameTokenOut: ',
    //   nameTokenOut,
    //   ' addressTokenOut: ',
    //   addressTokenOut
    // );
    console.log(pair);
  }

  useEffect(() => {
    getWeb3Data();
  },[]);

  return (
    <BoxWrapper>
      <TableHeader action='provide' />
      <Button onClick={test}>Test</Button>
      <Row>
        <BoxInput
          action='provide'
          value={inputValue}
          onChange={inputOnChange}
          name='inputToken'
          token={tokenIn}
          setPair={setPair}
          // setNameTokenIn={setNameTokenIn}
          // setNameTokenOut={setNameTokenOut}
          // setAddressTokenIn={setAddressTokenIn}
          // setAddressTokenOut={setAddressTokenOut}
          pair={pair}
          // nameTokenIn={nameTokenIn}
          // nameTokenOut={nameTokenOut}
          // addressTokenIn={addressTokenIn}
          // addressTokenOut={addressTokenOut}
          disableButton={checkDisableButton}
        />
      </Row>
      <Row>
        <BoxInput
          action='provide'
          value={outputValue}
          onChange={outputOnChange}
          name='outputToken'
          token={tokenOut}
          setPair={setPair}
          // setNameTokenIn={setNameTokenIn}
          // setNameTokenOut={setNameTokenOut}
          // setAddressTokenIn={setAddressTokenIn}
          // setAddressTokenOut={setAddressTokenOut}
          pair={pair}
          // nameTokenIn={nameTokenIn}
          // nameTokenOut={nameTokenOut}
          // addressTokenIn={addressTokenIn}
          // addressTokenOut={addressTokenOut}
          disableButton={checkDisableButton}
        />
      </Row>
      <Row>
        <BoxInfo action='provide' isInfo={isInfo}/>
      </Row>
      <Row>
        <Button disabled={disabled} onClick={provide}>Provide Liquidity</Button>
        {disabled ? <div>same address</div> : ''}
      </Row>
    </BoxWrapper>
  );
}

const Row = styled.div`
  padding: 1vw;
`;
