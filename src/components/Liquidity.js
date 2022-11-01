import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import BoxInput from './BoxInput';
import BoxWrapper from './BoxWrapper'
import TableHeader from './TableHeader';
import BoxInfo from './BoxInfo';
import { getAccounts, getWeb3, loadSmartContracts } from '../utils/connectWallet';
import { Contracts } from '../constants/address';

export default function Liquidity () {
  const tokenIn = useRef();
  const tokenOut = useRef();
  const [balanceIn, setBalanceIn] = useState();
  const [balanceOut, setBalanceOut] = useState();
  const inputValue = useRef();
  const outputValue = useRef();
  const [disabled, setDisabled] = useState(true);
  const [disabledApprove, setDisabledApprove] = useState(true);
  const isInputValid = useRef();
  const isOutputValid = useRef();
  const [contracts, setContracts] = useState();
  const [isPairExist, setIsPairExist] = useState(false);
  const pair = useRef({
    nameTokenIn: '',
    nameTokenOut: '',
    addressTokenIn: '',
    addressTokenOut: '',
  });
  const [isAddressSame, setIsAddressSame] = useState(false);
  const pool = useRef();
  const [rate, setRate] = useState();
  const [contractTokenIn, setContractTokenIn] = useState();
  const [contractTokenOut, setContractTokenOut] = useState();
  const [poolBalanceTokenIn, setPoolBalanceTokenIn] = useState();
  const [poolBalanceTokenOut, setPoolBalanceTokenOut] = useState();
  const [shareOfPool, setShareOfPool] = useState(0);
  const [address, setAddress] = useState();
  const [web3, setWeb3] = useState();

  useEffect(() => {
    const _web3 = getWeb3();
    setWeb3(_web3);
  }, []);

  const getWeb3Data = async () => {
    const _contracts = loadSmartContracts([...Object.values(Contracts)]);
    setContracts(_contracts);

    const addresses = await getAccounts();
    setAddress(addresses[0]);
  };

  const checkDisableButton = async () => {
    if (
      pair.current.addressTokenIn &&
      pair.current.addressTokenOut &&
      pair.current.nameTokenIn &&
      pair.current.nameTokenOut
    ) {
      await checkPairExist();
      await getRate();
    }
    
    tokenIn.current = pair.current.nameTokenIn;
    tokenOut.current = pair.current.nameTokenOut;
  }

  const inputOnChange = async (event) => {
  // const inputOnChange = async (value) => {
    const value = event.target.value;

    if (pair.current.addressTokenIn && pair.current.addressTokenOut) {
      if (isPairExist) {
        if (value) {
          const tokenInDecimal = await contractTokenIn.methods.decimals().call();
          const tokenOutDecimal = await contractTokenOut.methods.decimals().call();
          
          const amountInWithDecimal = value * 10 ** tokenInDecimal;
          const amountInPercentage = amountInWithDecimal / (poolBalanceTokenIn + amountInWithDecimal);
          
          const amountOutWithDecimal = (amountInPercentage * poolBalanceTokenOut) / (1 - amountInPercentage);
          const amountOutWithoutDecimal = amountOutWithDecimal / (10 ** tokenOutDecimal);
          console.log('amountInPercentage * 100: ', amountInPercentage * 100);
          setShareOfPool(amountInPercentage * 100);
          inputValue.current = value;
          outputValue.current = amountOutWithoutDecimal;
          checkInputAgainstBalance(value);
          checkOutputAgainstBalance(amountOutWithoutDecimal);
        } else {
          console.log('value: ', value);
          console.log('inputValue.current: ', inputValue.current, ' outputValue.current: ', outputValue.current);
          inputValue.current = '';
          outputValue.current = '';
          console.log('inputValue.current: ', inputValue.current, ' outputValue.current: ', outputValue.current);
          // inputValue.current = null;
          // outputValue.current = null;
        }
      } else {
        if (value) {
          console.log('value: ', value);
          inputValue.current = value;
          // outputValue.current = value;
          getRateWhenPairNotExist();
          setShareOfPool(100);
          console.log('value: ', value);
        } else {
          inputValue.current = null;
          // inputValue.current = '';
          setShareOfPool(0);
          getRateWhenPairNotExist();
        }
      }

      shouldApproveButtonDisabled();
    }
    inputValue.current = value;
  };

  const outputOnChange = async (event) => {
  // const outputOnChange = async (value) => {
    const value = event.target.value;

    if (pair.current.addressTokenIn && pair.current.addressTokenOut) {
      if (isPairExist) {
        if (value) {
          const tokenOutDecimal = await contractTokenOut.methods.decimals().call();
          const tokenInDecimal = await contractTokenIn.methods.decimals().call();
          
          const amountOutWithDecimal = value * 10 ** tokenOutDecimal;
          const amountOutPercentage = amountOutWithDecimal / (poolBalanceTokenOut + amountOutWithDecimal);
          
          const amountInWithDecimal = (amountOutPercentage * poolBalanceTokenIn) / (1 - amountOutPercentage);
          const amountInWithoutDecimal = amountInWithDecimal / (10 ** tokenInDecimal);
          setShareOfPool(amountOutPercentage * 100);
          outputValue.current = value;
          inputValue.current = amountInWithoutDecimal;
          checkOutputAgainstBalance(value);
          checkInputAgainstBalance(amountInWithoutDecimal);
        } else {
          inputValue.current = '';
          outputValue.current = '';
        }
      } else {
        if (value) {
          outputValue.current = value;
          setShareOfPool(100);
          getRateWhenPairNotExist();
          console.log('value: ', value);
        } else {
          outputValue.current = null;
          // outputValue.current = '';
          setShareOfPool(0);
          getRateWhenPairNotExist();
        }
      }

      shouldApproveButtonDisabled();
    }
  }

  const checkInputAgainstBalance = (value) => {
    if (value > balanceIn) {
      isInputValid.current = false;
    } else {
      isInputValid.current = true;
    }
  };

  const checkOutputAgainstBalance = (value) => {
    if (value > balanceOut) {
      isOutputValid.current = false;
    } else {
      isOutputValid.current = true;
    }
  };

  const shouldApproveButtonDisabled = () => {
    setDisabled(true);
    if (isInputValid.current && isOutputValid.current) {
      console.log(
        'isInputValid.current: ',
        isInputValid.current,
        ' isOutputValid.current: ',
        isOutputValid.current,
        ' inputValue.current: ',
        inputValue.current,
        ' outputValue.current: ',
        outputValue.current,
      );
      setDisabledApprove(false);
    } else {
      console.log(
        'isInputValid.current: ',
        isInputValid.current,
        ' isOutputValid.current: ',
        isOutputValid.current
      );
      setDisabledApprove(true);
    }
    if (pair.current.addressTokenIn === pair.current.addressTokenOut) {
      setDisabledApprove(true);
      setIsAddressSame(true);
    } else {
      if (isInputValid.current && isOutputValid.current) {
        setDisabledApprove(false);
        console.log('hello');
      }
      setIsAddressSame(false);
    }
  };

  const approveTokens = async () => {
    const tokenInDecimal = await contractTokenIn.methods.decimals().call();
    const tokenOutDecimal = await contractTokenOut.methods.decimals().call();

    const amountInRounded = Math.round(inputValue.current * 10 ** tokenInDecimal);
    const amountOutRounded = Math.round(outputValue.current * 10 ** tokenOutDecimal);
    
    const transactionApproveTokenIn = await contractTokenIn.methods
      .approve(Contracts.router.address, amountInRounded)
      .send({ from: address});
    // console.log('transactionApproveTokenIn: ', transactionApproveTokenIn);
    const transactionApproveTokenOut = await contractTokenOut.methods
      .approve(Contracts.router.address, amountOutRounded)
      .send({ from: address});

    if (transactionApproveTokenIn.status && transactionApproveTokenOut.status) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }

  const provide = async () => {
    const tokenInDecimal = await contractTokenIn.methods.decimals().call();
    const tokenOutDecimal = await contractTokenOut.methods.decimals().call();

    const amountInRounded = Math.round(inputValue.current * 10 ** tokenInDecimal);
    const amountOutRounded = Math.round(outputValue.current * 10 ** tokenOutDecimal);

    const deadline = (Date.parse(new Date()) / 1000) + (60 * 30);

    console.log(
      'inputValue.current: ',
      inputValue.current,
      ' amountInRounded: ',
      amountInRounded,
      ' outputValue.current: ',
      outputValue.current,
      ' amountOutRounded: ',
      amountOutRounded,
      ' amountInRounded * 0.95: ',
      amountInRounded * 0.95,
      ' amountOutRounded * 0.95: ',
      amountOutRounded * 0.95,
      ' Date.parse(new Date()) / 1000: ',
      Date.parse(new Date()) / 1000,
      ' deadline: ',
      deadline,
    );

    const res = await contracts.router.methods.addLiquidity(
      pair.current.addressTokenIn,
      pair.current.addressTokenOut,
      amountInRounded,
      amountOutRounded,
      amountInRounded * 0.95,
      amountOutRounded * 0.95,
      address,
      deadline
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
      setRate();
      console.log("pair doesn't exist, create?");
    } else {
      setIsPairExist(true);
      pool.current = _pair;
    }
  };

  const getRate = async () => {
    if (web3) {
      const _contractTokenIn = new web3.eth.Contract(Contracts.erc20.abi, pair.current.addressTokenIn);
      const _contractTokenOut = new web3.eth.Contract(Contracts.erc20.abi, pair.current.addressTokenOut);
      setContractTokenIn(_contractTokenIn);
      setContractTokenOut(_contractTokenOut);

      const _poolBalanceTokenIn = await _contractTokenIn.methods.balanceOf(pool.current).call();
      const _poolBalanceTokenOut = await _contractTokenOut.methods.balanceOf(pool.current).call();
      setPoolBalanceTokenIn(parseInt(_poolBalanceTokenIn));
      setPoolBalanceTokenOut(parseInt(_poolBalanceTokenOut));

      const tokenInDecimal = await _contractTokenIn.methods.decimals().call();
      const tokenOutDecimal = await _contractTokenOut.methods.decimals().call();
      
      const poolBalanceTokenInWithoutDecimal = _poolBalanceTokenIn / tokenInDecimal;
      const poolBalanceTokenOutWithoutDecimal = _poolBalanceTokenOut / tokenOutDecimal;

      const _rate = poolBalanceTokenInWithoutDecimal / poolBalanceTokenOutWithoutDecimal;
      if (_rate) {
        setRate(_rate);
      }
    }
  };

  const getRateWhenPairNotExist = () => {
    if (pair.current.addressTokenIn && pair.current.addressTokenOut) {
      const _rate = inputValue.current / outputValue.current;
      console.log(
        '_rate: ',
        _rate,
        ' inputValue.current: ',
        inputValue.current,
        ' outputValue.current: ',
        outputValue.current
      );
      if (_rate && _rate !== Infinity) {
        setRate(_rate);
      } else {
        setRate();
      }
    } else {
      setRate();
    }
  };

  useEffect(() => {
    getWeb3Data();
  },[]);

  return (
    <BoxWrapper>
      <TableHeader action='provide' />
      <Button onClick={() => {console.log('rate: ', rate, 'inputValue: ', inputValue)}}>Test</Button>
      <Row>
        <BoxInput
          action='provide'
          value={inputValue}
          onChange={inputOnChange}
          name='inputToken'
          token={tokenIn}
          pair={pair}
          isPairExist={isPairExist}
          disableButton={checkDisableButton}
          setBalanceIn={setBalanceIn}
          shouldApproveButtonDisabled={shouldApproveButtonDisabled}
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
          isPairExist={isPairExist}
          disableButton={checkDisableButton}
          setBalanceOut={setBalanceOut}
          shouldApproveButtonDisabled={shouldApproveButtonDisabled}
        />
      </Row>
      <Row>
        <BoxInfo
          action='provide'
          isInfo="true"
          rate={rate}
          pair={pair}
          isPairExist={isPairExist}
          shareOfPool={shareOfPool}
        />
      </Row>
      <Row>
        {
          !isPairExist &&
          pair.current.addressTokenIn &&
          pair.current.addressTokenOut ?
            <div>
              When creating a pair you are the first liquidity provider.
              The ratio of tokens you add will set the price of this pool.
              Once you are happy with the rate, click supply to review
            </div> :
            ''
        }
      </Row>
      <Row>
        <Button disabled={disabledApprove} onClick={approveTokens}>Approve Tokens</Button>
        <Button disabled={disabled} onClick={provide}>Provide Liquidity</Button>
        {isAddressSame
          ? <div style={{ color: 'red' }}>
              Addresses of input token and output token are the same,
              please use different addresses.
            </div>
          : ''}
      </Row>
      <Row>
        <div>
          Tip: By adding liquidity you will earn 0.25% of all trades on
          this pair proportional to your share of the pool. Fees are added
          to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
        </div>
      </Row>
    </BoxWrapper>
  );
}

const Row = styled.div`
  padding: 1vw;
`;
