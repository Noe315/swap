import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import BoxInput from './components/BoxInput';
import BoxWrapper from '../../components/BoxWrapper'
import BoxInfo from './components/BoxInfo';
import { getAccounts, getWeb3, loadSmartContracts } from '../../utils/connectWallet';
import { Contracts, DECIMAL_PLACES } from '../../constants/address';
import TableHeader from './components/TableHeader';

export default function Liquidity () {
  const pool = useRef();
  const tokenIn = useRef();
  const tokenOut = useRef();
  const inputValue = useRef();
  const outputValue = useRef();
  const isInputValid = useRef();
  const isOutputValid = useRef();
  const pair = useRef({
    nameTokenIn: '',
    nameTokenOut: '',
    addressTokenIn: '',
    addressTokenOut: '',
  });
  const [address, setAddress] = useState();
  const [contracts, setContracts] = useState();
  const [balanceIn, setBalanceIn] = useState();
  const [balanceOut, setBalanceOut] = useState();
  const [inputValueState, setInputValueState] = useState();
  const [outputValueState, setOutputValueState] = useState();
  const [disableProvide, setDisableProvide] = useState(true);
  const [disableApprove, setDisableApprove] = useState(true);
  const [isPairExist, setIsPairExist] = useState(false);
  const [isAddressSame, setIsAddressSame] = useState(false);
  const [rate, setRate] = useState();
  const [contractTokenIn, setContractTokenIn] = useState();
  const [contractTokenOut, setContractTokenOut] = useState();
  const [poolBalanceTokenIn, setPoolBalanceTokenIn] = useState();
  const [poolBalanceTokenOut, setPoolBalanceTokenOut] = useState();
  const [shareOfPool, setShareOfPool] = useState(0);
  const [web3, setWeb3] = useState();
  // const [slippage, setSlippage] = useState();
  const slippageAndDeadline = useRef();

  useEffect(() => {
    getWeb3Data();
    const _web3 = getWeb3();
    setWeb3(_web3);
  }, []);

  const getWeb3Data = async () => {
    const _contracts = loadSmartContracts([...Object.values(Contracts)]);
    setContracts(_contracts);

    const addresses = await getAccounts();
    setAddress(addresses[0]);
  };

  const inputOnChange = async (event) => {
    const value = event.target.value;
    checkInputAgainstBalance(value);

    if (pair.current.addressTokenIn && pair.current.addressTokenOut) {
      if (isPairExist) {
        if (value) {
          const tokenInDecimal = await contractTokenIn.methods.decimals().call();
          const tokenOutDecimal = await contractTokenOut.methods.decimals().call();
          
          const amountInWithDecimal = value * 10 ** tokenInDecimal;
          const amountInPercentage = amountInWithDecimal / (poolBalanceTokenIn + amountInWithDecimal);
          
          const amountOutWithDecimal = (amountInPercentage * poolBalanceTokenOut) / (1 - amountInPercentage);
          const amountOutWithoutDecimal = amountOutWithDecimal / (10 ** tokenOutDecimal);
          // const amountOutWithoutDecimalRounded = Math.round(amountOutWithoutDecimal * 10 ** tokenOutDecimal) / (10 ** tokenOutDecimal);
          // const amountOutWithoutDecimalRounded = parseFloat(amountOutWithoutDecimal.toFixed(tokenOutDecimal));
          let amountOutWithoutDecimalRounded;
          if (tokenOutDecimal > DECIMAL_PLACES) {
            amountOutWithoutDecimalRounded = parseInt(amountOutWithoutDecimal * 10 ** DECIMAL_PLACES) / (10 ** DECIMAL_PLACES);
          } else {
            amountOutWithoutDecimalRounded = parseInt(amountOutWithoutDecimal * 10 ** tokenOutDecimal) / (10 ** tokenOutDecimal);
          }
          setShareOfPool(amountInPercentage * 100);
          inputValue.current = value;
          // outputValue.current = amountOutWithoutDecimal;
          // setOutputValueState(amountOutWithoutDecimal);
          outputValue.current = amountOutWithoutDecimalRounded;
          setOutputValueState(amountOutWithoutDecimalRounded);
          // checkOutputAgainstBalance(amountOutWithoutDecimal);
          checkOutputAgainstBalance(amountOutWithoutDecimalRounded);
        } else {
          outputValue.current = '';
          inputValue.current = '';
          setOutputValueState('');
        }
      } else {
        if (value) {
          inputValue.current = value;
          getRateWhenPairNotExist();
          setShareOfPool(100);
        } else {
          inputValue.current = null;
          setShareOfPool(0);
          getRateWhenPairNotExist();
        }
      }
      shouldApproveButtonDisabled();
    }
    setInputValueState(value);
  };

  const outputOnChange = async (event) => {
    const value = event.target.value;
    checkOutputAgainstBalance(value);

    if (pair.current.addressTokenIn && pair.current.addressTokenOut) {
      if (isPairExist) {
        if (value) {
          const tokenOutDecimal = await contractTokenOut.methods.decimals().call();
          const tokenInDecimal = await contractTokenIn.methods.decimals().call();
          
          const amountOutWithDecimal = value * 10 ** tokenOutDecimal;
          const amountOutPercentage = amountOutWithDecimal / (poolBalanceTokenOut + amountOutWithDecimal);
          
          const amountInWithDecimal = (amountOutPercentage * poolBalanceTokenIn) / (1 - amountOutPercentage);
          const amountInWithoutDecimal = amountInWithDecimal / (10 ** tokenInDecimal);
          // const amountInWithoutDecimalRounded = Math.round(amountInWithoutDecimal * 10 ** tokenInDecimal) / (10 ** tokenInDecimal);
          // const amountInWithoutDecimalRounded = parseFloat(amountInWithoutDecimal.toFixed(tokenInDecimal));
          let amountInWithoutDecimalRounded;
          if (tokenInDecimal > DECIMAL_PLACES) {
            amountInWithoutDecimalRounded = parseInt(amountInWithoutDecimal * 10 ** DECIMAL_PLACES) / (10 ** DECIMAL_PLACES);
          } else {
            amountInWithoutDecimalRounded = parseInt(amountInWithoutDecimal * 10 ** tokenInDecimal) / (10 ** tokenInDecimal);
          }
          setShareOfPool(amountOutPercentage * 100);
          outputValue.current = value;
          // inputValue.current = amountInWithoutDecimal;
          // setInputValueState(amountInWithoutDecimal);
          inputValue.current = amountInWithoutDecimalRounded;
          setInputValueState(amountInWithoutDecimalRounded);
          // checkInputAgainstBalance(amountInWithoutDecimal);
          checkInputAgainstBalance(amountInWithoutDecimalRounded);
        } else {
          inputValue.current = '';
          outputValue.current = '';
          setInputValueState('');
        }
      } else {
        if (value) {
          outputValue.current = value;
          setShareOfPool(100);
          getRateWhenPairNotExist();
        } else {
          outputValue.current = null;
          setShareOfPool(0);
          getRateWhenPairNotExist();
        }
      }
      shouldApproveButtonDisabled();
    }
    setOutputValueState(value);
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
    setDisableProvide(true);
    if (isInputValid.current && isOutputValid.current && inputValue.current && outputValue.current) {
      setDisableApprove(false);
    } else {
      setDisableApprove(true);
    }
    if (pair.current.addressTokenIn === pair.current.addressTokenOut) {
      setDisableApprove(true);
      setIsAddressSame(true);
    } else {
      if (isInputValid.current && isOutputValid.current && inputValue.current && outputValue.current) {
        setDisableApprove(false);
      }
      setIsAddressSame(false);
    }
  };
  
  const checkPairAndGetRate = async () => {
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
      
      const poolBalanceTokenInWithoutDecimal = _poolBalanceTokenIn / (10 ** tokenInDecimal);
      const poolBalanceTokenOutWithoutDecimal = _poolBalanceTokenOut / (10 ** tokenOutDecimal);

      // const _rate = poolBalanceTokenInWithoutDecimal / poolBalanceTokenOutWithoutDecimal;
      const _rate = poolBalanceTokenOutWithoutDecimal / poolBalanceTokenInWithoutDecimal;
      if (_rate) {
        setRate(_rate);
      }
    }
  };

  const getRateWhenPairNotExist = () => {
    if (pair.current.addressTokenIn && pair.current.addressTokenOut) {
      const _rate = inputValue.current / outputValue.current;
      if (_rate && _rate !== Infinity) {
        setRate(_rate);
      } else {
        setRate();
      }
    } else {
      setRate();
    }
  };

  const approveTokens = async () => {
    const BN = web3.utils.BN;
    const tokenInDecimal = await contractTokenIn.methods.decimals().call();
    const tokenOutDecimal = await contractTokenOut.methods.decimals().call();

    // const amountInRounded = Math.round(inputValue.current * 10 ** tokenInDecimal);
    // const amountOutRounded = Math.round(outputValue.current * 10 ** tokenOutDecimal);
    const amountInBN = new BN((inputValue.current * 10 ** tokenInDecimal).toString())
      .mul(new BN(10)
      .pow(new BN(tokenInDecimal)))
      .div(new BN((10 ** tokenInDecimal).toString()))
      .toString();
    const amountOutBN = new BN((outputValue.current * 10 ** tokenOutDecimal).toString())
      .mul(new BN(10)
      .pow(new BN(tokenOutDecimal)))
      .div(new BN((10 ** tokenOutDecimal).toString()))
      .toString();

    // console.log('amountInRounded: ', amountInRounded, ' amountOutRounded: ', amountOutRounded);
    console.log(
      'amountInBN: ',
      amountInBN,
      ' amountOutBN: ',
      amountOutBN,
      ' amountInBN / (10 ** tokenInDecimal): ',
      amountInBN / (10 ** tokenInDecimal),
      ' amountOutBN / (10 ** tokenOutDecimal): ',
      amountOutBN / (10 ** tokenOutDecimal)
    );
    
    const transactionApproveTokenIn = await contractTokenIn.methods
      // .approve(Contracts.router.address, amountInRounded)
      // .approve(Contracts.router.address, new BN((amountInBN / (10 ** tokenInDecimal)).toString()))
      .approve(Contracts.router.address, amountInBN)
      .send({ from: address});
    const transactionApproveTokenOut = await contractTokenOut.methods
      // .approve(Contracts.router.address, amountOutRounded)
      // .approve(Contracts.router.address, new BN((amountOutBN / (10 ** tokenOutDecimal)).toString()))
      .approve(Contracts.router.address, amountOutBN)
      .send({ from: address});

    if (transactionApproveTokenIn.status && transactionApproveTokenOut.status) {
      setDisableProvide(false);
    } else {
      setDisableProvide(true);
    }
  }

  const provide = async () => {
    const BN = web3.utils.BN;
    const tokenInDecimal = await contractTokenIn.methods.decimals().call();
    const tokenOutDecimal = await contractTokenOut.methods.decimals().call();
    const _slippage = slippageAndDeadline.current.getSlippage();

    // const amountInRounded = Math.round(inputValue.current * 10 ** tokenInDecimal);
    // const amountOutRounded = Math.round(outputValue.current * 10 ** tokenOutDecimal);
    const amountIn = new BN(inputValue.current).mul(new BN(10).pow(new BN(tokenInDecimal))).toString();
    const amountOut = new BN(outputValue.current).mul(new BN(10).pow(new BN(tokenOutDecimal))).toString();
    // const amountInMinBN = amountInBN.mul(new BN(10000).sub(new BN(_slippage * 10000))).div(new BN(10000));
    // const amountOutMinBN = amountOutBN.mul(new BN(10000).sub(new BN(_slippage * 10000))).div(new BN(10000));
    const amountInMin = new BN(amountIn)
      .sub(new BN(amountIn)
        .mul(new BN((_slippage * 100).toString()))
        .div(new BN(10000)))
      .toString();
    const amountOutMin = new BN(amountOut)
      .sub(new BN(amountOut)
        .mul(new BN((_slippage * 100).toString()))
        .div(new BN(10000)))
      .toString();

    const deadline = (Date.parse(new Date()) / 1000) + (60 * slippageAndDeadline.current.getDeadline());

    console.log(
      'amountIn: ',
      amountIn,
      ' amountOut: ',
      amountOut,
      ' amountInMin: ',
      amountInMin,
      ' amountOutMin: ',
      amountOutMin,
      ' deadline: ',
      deadline,
      ' _slippage: ',
      _slippage,
      ' slippage * 10000: ',
      _slippage * 10000,
    );

    await contracts.router.methods.addLiquidity(
      pair.current.addressTokenIn,
      pair.current.addressTokenOut,
      // amountInRounded,
      // amountOutRounded,
      // amountInRounded * (1 - slippage),
      // amountOutRounded * (1 - slippage),
      amountIn,
      amountOut,
      amountInMin,
      amountOutMin,
      address,
      deadline
    ).send({ from: address });
  }

  return (
    <BoxWrapper>
      {/* <TableHeader setSlippage={setSlippage} /> */}
      <TableHeader ref={slippageAndDeadline} />
      <Row>
        <BoxInput
          value={inputValueState}
          // value={inputValue}
          // inputValueState={inputValueState}
          onChange={inputOnChange}
          name='inputToken'
          token={tokenIn}
          pair={pair}
          isPairExist={isPairExist}
          checkPairAndGetRate={checkPairAndGetRate}
          setBalanceIn={setBalanceIn}
          shouldApproveButtonDisabled={shouldApproveButtonDisabled}
        />
      </Row>
      <Row>
        <BoxInput
          value={outputValueState}
          // value={outputValue}
          // outputValueState={outputValueState}
          onChange={outputOnChange}
          name='outputToken'
          token={tokenOut}
          pair={pair}
          isPairExist={isPairExist}
          checkPairAndGetRate={checkPairAndGetRate}
          setBalanceOut={setBalanceOut}
          shouldApproveButtonDisabled={shouldApproveButtonDisabled}
        />
      </Row>
      <Row>
        <BoxInfo
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
        <Button
          disabled={disableApprove}
          onClick={approveTokens}
        >
          Approve Tokens
        </Button>
        <Button
          disabled={disableProvide}
          onClick={provide}
        >
          Provide Liquidity
        </Button>
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
