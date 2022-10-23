import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import BoxInput from './BoxInput';
import BoxWrapper from './BoxWrapper'
import TableHeader from './TableHeader';
import BoxInfo from './BoxInfo';
import { getAccounts, getWeb3, loadSmartContracts } from '../utils/connectWallet';
import { Contracts } from '../constants/address';
import SelectToken from './SelectToken';

export default function Liquidity () {
  // const [tokenIn, setTokenIn] = useState();
  // const [tokenOut, setTokenOut] = useState();
  const tokenIn = useRef();
  const tokenOut = useRef();
  const [isInfo, setIsInfo] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [outputValue, setOutputValue] = useState();
  const [disabled, setDisabled] = useState(true);
  const [contracts, setContracts] = useState();
  const [isPairExist, setIsPairExist] = useState();
  const pair = useRef({
    nameTokenIn: '',
    nameTokenOut: '',
    addressTokenIn: '',
    addressTokenOut: '',
  });
  const [amountADesired, setAmountADesired] = useState();
  const [amountBDesired, setAmountBDesired] = useState();
  // const [pool, setPool] = useState();
  const pool = useRef();
  const [rate, setRate] = useState();
  // const rate = useRef();
  const [address, setAddress] = useState();
  const [web3, setWeb3] = useState();

  useEffect(() => {
    const _web3 = getWeb3();
    setWeb3(_web3);
  }, []);
  // const [isSelectToken, setIsSelectToken] = useState(false);

  // const showSelectToken = () => {
  //   setIsSelectToken(!isSelectToken);
  // };
  const checkDisableButton = async () => {
    if (
      pair.current.addressTokenIn &&
      pair.current.addressTokenOut &&
      pair.current.nameTokenIn &&
      pair.current.nameTokenOut
    )
    {
      setDisabled(false);
      await checkPairExist();
      await getRate();
      setIsInfo(true);
    }

    if (pair.current.addressTokenIn !== pair.current.addressTokenOut) {
      setDisabled(false)
    } else {
      setDisabled(true);
    }
    // setTokenIn(pair.current.nameTokenIn);
    // setTokenOut(pair.current.nameTokenOut);
    
    tokenIn.current = pair.current.nameTokenIn;
    tokenOut.current = pair.current.nameTokenOut;
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
    const res = await contracts.router.methods.addLiquidity(
      pair.current.addressTokenIn,
      pair.current.addressTokenOut,
      amountADesired,
      amountBDesired,
      amountADesired * 0.95,
      amountBDesired * 0.95,
      address,
      1666539600
    ).send({ from: address });
    console.log('res: ', res);
  }
  
  const checkPairExist = async () => {
    const _pair = await contracts.factory.methods.getPair(
      pair.current.addressTokenIn,
      pair.current.addressTokenOut,
    ).call();
    const pair1Int = parseInt(_pair, 16);
    if (pair1Int === 0) {
      setIsPairExist(false);
      console.log("pair doesn't exist, create?");
    } else {
      setIsPairExist(true);
      // setPool(_pair);
      pool.current = _pair;
    }
  };

  const getRate = async () => {
    if (web3) {
      const contractTokenIn = new web3.eth.Contract(Contracts.erc20.abi, pair.current.addressTokenIn);
      const contractTokenOut = new web3.eth.Contract(Contracts.erc20.abi, pair.current.addressTokenOut);

      const poolTokenIn = await contractTokenIn.methods.balanceOf(pool.current).call();
      const poolTokenOut = await contractTokenOut.methods.balanceOf(pool.current).call();

      const tokenInDecimal = await contractTokenIn.methods.decimals().call();
      const tokenOutDecimal = await contractTokenOut.methods.decimals().call();
      
      const poolBalanceTokenInWithoutDecimal = poolTokenIn / tokenInDecimal;
      const poolBalanceTokenOutWithoutDecimal = poolTokenOut / tokenOutDecimal;

      const _rate = poolBalanceTokenInWithoutDecimal / poolBalanceTokenOutWithoutDecimal;
      if (_rate) {
        setRate(_rate);
      }
    }
  };

  const test = () => {
    console.log(pair);
  }

  useEffect(() => {
    getWeb3Data();
  },[]);

  return (
    <BoxWrapper>
      <TableHeader action='provide' />
      {/* <Button onClick={test}>Test</Button> */}
      <Row>
        <BoxInput
          action='provide'
          value={inputValue}
          onChange={inputOnChange}
          name='inputToken'
          token={tokenIn}
          pair={pair}
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
          pair={pair}
          disableButton={checkDisableButton}
        />
      </Row>
      <Row>
        <BoxInfo
          action='provide'
          // isInfo={isInfo}
          isInfo="true"
          rate={rate}
          pair={pair}
          isPairExist={isPairExist}
        />
      </Row>
      <Row>
        {
          isPairExist ?
            '' :
            <div>
              When creating a pair you are the first liquidity provider. The ratio of tokens you add will set the price of this pool. Once you are happy with the rate, click supply to review
            </div>
        }
      </Row>
      <Row>
        <Button>Approve</Button>
        <Button disabled={disabled} onClick={provide}>Provide Liquidity</Button>
        {disabled ? <div>same address</div> : ''}
      </Row>
    </BoxWrapper>
  );
}

const Row = styled.div`
  padding: 1vw;
`;
