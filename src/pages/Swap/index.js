import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import BoxInput from '../../components/BoxInput';
import BoxInfo from './components/BoxInfo';
import BoxWrapper from '../../components/BoxWrapper';
import { TableHeader } from '../../components/styles';
import ModalSlippage from '../../components/ModalSlippage';
import { Contracts, DECIMAL_PLACES, DEFAULT_SLIPPAGE, KAI_MAINNET_CHAIN_ID, NATIVE_TOKEN_ADDRESS, PROVIDER } from '../../constants/address';
import { Fetcher, Percent, Token, TokenAmount, Trade } from '@uniswap/sdk';
import { getWeb3, getWeb3Data } from '../../utils/connectWallet';
import { sanitizeInput } from '../../utils/helpers';

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
  const web3 = useRef();
  const web3Data = useRef();
  const run = useRef(true);
  const pairs = useRef();
  const [isRouteExist, setIsRouteExist] = useState(true);
  // const [swapInfo, setSwapInfo] = useState();
  const swapInfo = useRef();
  const [isWrap, setIsWrap] = useState(false);
  // const isWrap = useRef(false);
  const [disableWrap, setDisableWrap] = useState(true);

  useEffect(() => {
    const _web3 = getWeb3();
    web3.current = _web3;
    
    const _getWeb3Data = async () => {
      const _web3Data = await getWeb3Data();
      web3Data.current = _web3Data
    };

    const _getPairs = async () => {
      const _pairs = await getPairs();
      pairs.current = _pairs;
    };

    _getWeb3Data().then(() => _getPairs());
  }, []);

  const getPairs = async () => {
    if (run.current) {
      run.current = false;
      const factoryContract = web3Data.current.contracts.factory;
      
      const _pairs = [];
      const allPairsLength = await factoryContract.methods.allPairsLength().call();
      for (let i = 0; i < allPairsLength; i++) {
        const pair = await factoryContract.methods.allPairs(i).call();
        const pairObject = await getPairInfo(pair);
        console.log('pairObject: ', pairObject);
        _pairs.push(pairObject);
      }

      return _pairs;
    }
  };

  const getPairInfo = async (pair) => {
    const _web3 = web3.current;

    const pairContract = new _web3.eth.Contract(Contracts.uniswapV2Pair.abi, pair);
    
    const token0Address = await pairContract.methods.token0().call();
    const token1Address = await pairContract.methods.token1().call();

    const token0Contract = new _web3.eth.Contract(Contracts.erc20.abi, token0Address);
    const token1Contract = new _web3.eth.Contract(Contracts.erc20.abi, token1Address);

    const token0Name = await token0Contract.methods.name().call();
    const token1Name = await token1Contract.methods.name().call();

    const token0Symbol = await token0Contract.methods.symbol().call();
    const token1Symbol = await token1Contract.methods.symbol().call();

    const token0 = await Fetcher
      .fetchTokenData(KAI_MAINNET_CHAIN_ID, token0Address, PROVIDER, token0Symbol, token0Name);
    const token1 = await Fetcher
      .fetchTokenData(KAI_MAINNET_CHAIN_ID, token1Address, PROVIDER, token1Symbol, token1Name);
    
    const _pair = await Fetcher.fetchPairData(token0, token1, PROVIDER);

    return _pair;
  };

  const inputOnChange = async (event) => {
    const value = event.target.value;
    // const valueNumber = value.replace(/[^(0-9).]/gm, '');
    inputValue.current = value;
    setInputValueState(value);
    checkInputAgainstBalance(value);
    
    // const infoTokenIn = tokenIn.current.getTokenInfo();
    // const infoTokenOut = tokenOut.current.getTokenInfo();
    const infoTokenIn = tokenIn.current.getTokenInfo() ? tokenIn.current.getTokenInfo() : tokenIn.current.getNativeTokenInfo();
    const infoTokenOut = tokenOut.current.getTokenInfo() ? tokenOut.current.getTokenInfo() : tokenOut.current.getNativeTokenInfo();
    // const _isWrap = isWrap.current;
    const _isWrap = isWrap;
    
    if (infoTokenIn && infoTokenOut) {
      if (_isWrap) {
        outputValue.current = inputValue.current;
        setOutputValueState(inputValue.current);
        shouldWrapButtonDisabled();
      } else {
        shouldApproveButtonDisabled();
        const trade = findRoute('in', value * 10 ** infoTokenIn.decimals);
        let tradeInfo = {};
  
        if (value) {
          setIsInfo(true);
  
          if (trade.length) {
            setIsRouteExist(true);
  
            tradeInfo.priceImpact = trade[0].priceImpact.toFixed(2);
            tradeInfo.route = trade[0].route.path.map(token => {
              // return {symbol: token.symbol, address: token.address};
              return token;
            });
            tradeInfo.amountOut = trade[0].outputAmount.toFixed(
              trade[0].outputAmount.currency.decimals <= DECIMAL_PLACES
                ? parseInt(trade[0].outputAmount.currency.decimals)
                : DECIMAL_PLACES
            );
            tradeInfo.amountIn = trade[0].inputAmount.toFixed(
              trade[0].inputAmount.currency.decimals <= DECIMAL_PLACES
                ? parseInt(trade[0].inputAmount.currency.decimals)
                : DECIMAL_PLACES
            );
            tradeInfo.rate = {
              // inOverOut: parseInt((tradeInfo.amountIn / tradeInfo.amountOut) * 10 ** infoTokenIn.decimals) / (10 ** infoTokenIn.decimals),
              // outOverIn: parseInt((tradeInfo.amountOut / tradeInfo.amountIn) * 10 ** infoTokenOut.decimals) / (10 ** infoTokenOut.decimals),
              inOverOut: parseInt((tradeInfo.amountIn / tradeInfo.amountOut) * 10 ** 3) / (10 ** 3),
              outOverIn: parseInt((tradeInfo.amountOut / tradeInfo.amountIn) * 10 ** 3) / (10 ** 3),
            };
            tradeInfo.minOut = trade[0]
              .minimumAmountOut(new Percent(
                (slippageAndDeadline.current.getSlippage() * 100).toString(),
                '10000'
              ))
              .toFixed(
                trade[0].outputAmount.currency.decimals <= DECIMAL_PLACES
                  ? trade[0].outputAmount.currency.decimals
                  : DECIMAL_PLACES
              );
            console.log(
              'trade: ', trade,
              ' tradeInfo: ', tradeInfo,
            );
            // setSwapInfo(tradeInfo);
            swapInfo.current = tradeInfo;
  
            setOutputValueState(tradeInfo.amountOut);
            outputValue.current = tradeInfo.amountOut;
          } else {
            setIsRouteExist(false);
          }
          checkOutputAgainstBalance(tradeInfo ? tradeInfo.amountOut : '');
        } else {
          setInputValueState('');
          inputValue.current = '';
          setOutputValueState('');
          outputValue.current = '';
          swapInfo.current = '';
          setIsInfo(false);
        }
  
        shouldApproveButtonDisabled();
      }

    }
  };

  const outputOnChange = async (event) => {
    const value = event.target.value;
    // const valueNumber = value.replace(/[^(0-9).]/gm, '');
    outputValue.current = value;
    setOutputValueState(value);
    checkOutputAgainstBalance(value);
    
    // const infoTokenIn = tokenIn.current.getTokenInfo();
    // const infoTokenOut = tokenOut.current.getTokenInfo();
    const infoTokenIn = tokenIn.current.getTokenInfo() ? tokenIn.current.getTokenInfo() : tokenIn.current.getNativeTokenInfo();
    const infoTokenOut = tokenOut.current.getTokenInfo() ? tokenOut.current.getTokenInfo() : tokenOut.current.getNativeTokenInfo();
    // const _isWrap = isWrap.current;
    const _isWrap = isWrap;
    
    if (infoTokenIn && infoTokenOut) {
      if (_isWrap) {
        inputValue.current = outputValue.current;
        setInputValueState(outputValue.current);
        shouldWrapButtonDisabled();
      } else {
        shouldApproveButtonDisabled();
        const trade = findRoute('out', value * 10 ** infoTokenOut.decimals);
        let tradeInfo = {};
  
        if (value) {
          setIsInfo(true);
          
          if (trade.length) {
            setIsRouteExist(true);
  
            tradeInfo.priceImpact = trade[0].priceImpact.toFixed(2);
            tradeInfo.route = trade[0].route.path.map(token => {
              // return token.symbol;
              return token;
            });
            tradeInfo.amountOut = trade[0].outputAmount.toFixed(
              trade[0].outputAmount.currency.decimals <= DECIMAL_PLACES
                ? parseInt(trade[0].outputAmount.currency.decimals)
                : DECIMAL_PLACES
            );
            tradeInfo.amountIn = trade[0].inputAmount.toFixed(
              trade[0].inputAmount.currency.decimals <= DECIMAL_PLACES
                ? parseInt(trade[0].inputAmount.currency.decimals)
                : DECIMAL_PLACES
            );
            tradeInfo.rate = {
              // inOverOut: parseInt((tradeInfo.amountIn / tradeInfo.amountOut) * 10 ** infoTokenIn.decimals) / (10 ** infoTokenIn.decimals),
              // outOverIn: parseInt((tradeInfo.amountOut / tradeInfo.amountIn) * 10 ** infoTokenOut.decimals) / (10 ** infoTokenOut.decimals),
              inOverOut: parseInt((tradeInfo.amountIn / tradeInfo.amountOut) * 10 ** 3) / (10 ** 3),
              outOverIn: parseInt((tradeInfo.amountOut / tradeInfo.amountIn) * 10 ** 3) / (10 ** 3),
            };
            tradeInfo.maxIn = trade[0]
              .maximumAmountIn(new Percent(
                (slippageAndDeadline.current.getSlippage() * 100).toString(),
                '10000'
              ))
              .toFixed(
                trade[0].inputAmount.currency.decimals <= DECIMAL_PLACES
                  ? trade[0].inputAmount.currency.decimals
                  : DECIMAL_PLACES
              );
            console.log(
              'trade: ', trade,
              ' tradeInfo: ', tradeInfo,
            );
            // setSwapInfo(tradeInfo);
            swapInfo.current = tradeInfo;
  
            setInputValueState(tradeInfo.amountIn);
            inputValue.current = tradeInfo.amountIn;
          } else {
            setIsRouteExist(false);
          }
          checkInputAgainstBalance(tradeInfo ? tradeInfo.maxIn : '');
        } else {
          setInputValueState('');
          inputValue.current = '';
          setOutputValueState('');
          outputValue.current = '';
          swapInfo.current = '';
          setIsInfo(false);
        }
  
        shouldApproveButtonDisabled();
      }
    }
  }

  const checkInputAgainstBalance = (value) => {
    // const infoTokenIn = tokenIn.current.getTokenInfo();
    const infoTokenIn = tokenIn.current.getTokenInfo() ? tokenIn.current.getTokenInfo() : tokenIn.current.getNativeTokenInfo();

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
    if (value > 0) {
      isOutputValid.current = true;
    } else {
      isOutputValid.current = false;
    }
  };

  const shouldApproveButtonDisabled = () => {
    // const infoTokenOut = tokenOut.current.getTokenInfo();
    // const infoTokenIn = tokenIn.current.getTokenInfo();
    const infoTokenIn = tokenIn.current.getTokenInfo() ? tokenIn.current.getTokenInfo() : tokenIn.current.getNativeTokenInfo();
    const infoTokenOut = tokenOut.current.getTokenInfo() ? tokenOut.current.getTokenInfo() : tokenOut.current.getNativeTokenInfo();
    const _swapInfo = swapInfo.current;
    setDisableSwap(true);
    // console.log(
    //   'isInputValid.current: ',
    //   isInputValid.current,
    //   ' isOutputValid.current: ',
    //   isOutputValid.current,
    //   ' inputValue.current: ',
    //   inputValue.current,
    //   ' outputValue.current: ',
    //   outputValue.current,
    //   ' infoTokenOut: ',
    //   infoTokenOut,
    //   ' infoTokenIn: ',
    //   infoTokenIn,
    // );

    // if (isInputValid.current && isOutputValid.current && inputValue.current && outputValue.current) {
    // // if (isInputValid.current && isOutputValid.current && inputValue && outputValue) {
    //   if (_swapInfo && _swapInfo.priceImpact >= 15) {
    //     console.log('_swapInfo: ', _swapInfo);
    //     setDisableApprove(true);
    //   } else {
    //     setDisableApprove(false);
    //   }
    //   // setDisableApprove(false);
    // } else {
    //   setDisableApprove(true);
    // }

    const addressIn = infoTokenIn.address ? infoTokenIn.address : NATIVE_TOKEN_ADDRESS;
    const addressOut = infoTokenOut.address ? infoTokenOut.address : NATIVE_TOKEN_ADDRESS;

    if (addressIn === addressOut) {
      setDisableApprove(true);
      setIsAddressSame(true);
    } else {
      if (isInputValid.current && isOutputValid.current && inputValue.current && outputValue.current) {
        if (infoTokenIn.address) {
          // if (isInputValid.current && isOutputValid.current && inputValue && outputValue) {
          if (_swapInfo && _swapInfo.priceImpact >= 15) {
            console.log('_swapInfo: ', _swapInfo);
            setDisableApprove(true);
          } else {
            setDisableApprove(false);
          }
          // setDisableApprove(false);
        } else {
          setDisableApprove(true);
          setDisableSwap(false);
        }
      } else {
        setDisableApprove(true);
      }
      setIsAddressSame(false);
    }
  };

  const shouldWrapButtonDisabled = () => {
    const infoTokenIn = tokenIn.current.getTokenInfo() ? tokenIn.current.getTokenInfo() : tokenIn.current.getNativeTokenInfo();
    const infoTokenOut = tokenOut.current.getTokenInfo() ? tokenOut.current.getTokenInfo() : tokenOut.current.getNativeTokenInfo();

    if (infoTokenIn && infoTokenOut) {
      if (inputValue.current && inputValue.current <= infoTokenIn.balance) {
        if (!infoTokenIn.address && !infoTokenOut.address) {
          setDisableWrap(true);
        } else {
          setDisableWrap(false);
        }
      } else {
        setDisableWrap(true);
      }
    }
  };

  const onTokenSelect = () => {
    // const infoTokenIn = tokenIn.current.getTokenInfo();
    // const infoTokenOut = tokenOut.current.getTokenInfo();
    const infoTokenIn = tokenIn.current.getTokenInfo() ? tokenIn.current.getTokenInfo() : tokenIn.current.getNativeTokenInfo();
    const infoTokenOut = tokenOut.current.getTokenInfo() ? tokenOut.current.getTokenInfo() : tokenOut.current.getNativeTokenInfo();

    if (infoTokenIn && infoTokenOut) {
      if (infoTokenIn.address && infoTokenOut.address) {
        setIsWrap(false);
        // isWrap.current = false;
        if (infoTokenIn.address === infoTokenOut.address) {
          setIsAddressSame(true);
        } else {
          setIsAddressSame(false);
        }
      } else if (infoTokenIn.address && !infoTokenOut.address) {    // From WKAI to KAI
        // isWrap.current = infoTokenIn.address === NATIVE_TOKEN_ADDRESS;
        setIsWrap(infoTokenIn.address === NATIVE_TOKEN_ADDRESS);
        setIsAddressSame(false);
      } else if (!infoTokenIn.address && infoTokenOut.address) {    // From KAI to WKAI
        // isWrap.current = infoTokenOut.address === NATIVE_TOKEN_ADDRESS;
        setIsWrap(infoTokenOut.address === NATIVE_TOKEN_ADDRESS);
        setIsAddressSame(false);
      } else {
        // isWrap.current = false;
        setIsWrap(false);
        setIsAddressSame(true);
      }
    }
    
    resetInputs();
  };

  const resetInputs = () => {
    inputValue.current = '';
    outputValue.current = '';
    setInputValueState('');
    setOutputValueState('');
    // if (isWrap.current) {
      shouldApproveButtonDisabled();
    // }
    setIsInfo(false);
  }

  const findRoute = (type, value) => {
    const _pairs = pairs.current;
    // const infoTokenIn = tokenIn.current.getTokenInfo();
    // const infoTokenOut = tokenOut.current.getTokenInfo();
    const infoTokenIn = tokenIn.current.getTokenInfo() ? tokenIn.current.getTokenInfo() : tokenIn.current.getNativeTokenInfo();
    const infoTokenOut = tokenOut.current.getTokenInfo() ? tokenOut.current.getTokenInfo() : tokenOut.current.getNativeTokenInfo();
    const addressIn = infoTokenIn.address ? infoTokenIn.address : NATIVE_TOKEN_ADDRESS;
    const addressOut = infoTokenOut.address ? infoTokenOut.address : NATIVE_TOKEN_ADDRESS;
    const nativeInSymbol = infoTokenIn.address
      ? infoTokenIn.address === NATIVE_TOKEN_ADDRESS
        ? 'WKAI'
        : infoTokenIn.symbol
      : 'WKAI';
    const nativeOutSymbol = infoTokenOut.address
      ? infoTokenOut.address === NATIVE_TOKEN_ADDRESS
        ? 'WKAI'
        : infoTokenOut.symbol
      : 'WKAI';
    
    const _tokenIn = new Token(
      KAI_MAINNET_CHAIN_ID,
      // infoTokenIn.address,
      addressIn,
      infoTokenIn.decimals,
      // infoTokenIn.symbol,
      nativeInSymbol,
      infoTokenIn.name
    );
    const _tokenOut = new Token(
      KAI_MAINNET_CHAIN_ID,
      // infoTokenOut.address,
      addressOut,
      infoTokenOut.decimals,
      // infoTokenOut.symbol,
      nativeOutSymbol,
      infoTokenOut.name
    );

    // console.log(
    //   'type: ', type,
    //   ' value: ', value,
    //   ' _tokenIn: ', _tokenIn,
    //   ' _tokenOut: ', _tokenOut,
    //   ' pairs: ', pairs,
    // );

    let trade;
    if (type === 'in') {
      try {
        trade = Trade
          .bestTradeExactIn(_pairs, new TokenAmount(_tokenIn, value), _tokenOut, { maxNumResults: 3, maxHops: 3 });
        
      } catch (err) {
        console.log('error: ', err);
      }
    } else {
      try {
        trade = Trade
          .bestTradeExactOut(_pairs, _tokenIn, new TokenAmount(_tokenOut, value), { maxNumResults: 3, maxHops: 3 });
      } catch (err) {
        console.log('error: ', err);
      }
    }
    console.log('trade: ', trade);
    return trade;
  };

  const getInfo = async () => {
    const tokenA = new Token(KAI_MAINNET_CHAIN_ID, '0xb4D6438ebBB73bfF7Aea4E66d2B98469B6Ae4DEf', 3);
    const tokenB = new Token(KAI_MAINNET_CHAIN_ID, '0xbf35A89559F5e746cb8921F81dcd276612B41387', 3);
    const tokenC = new Token(KAI_MAINNET_CHAIN_ID, '0x72E184cf075EB1CFA861B49eC4E88E2311150a94', 3);
    const tokenD = new Token(KAI_MAINNET_CHAIN_ID, '0x34e4b4994DEF3Df13481E430a4c7Eb0e476e0A25', 3);
    const tokenE = new Token(KAI_MAINNET_CHAIN_ID, '0x7F240E9885E0e1Cc485EBBA51181BB7033b8e7B6', 18);
    const tokenTest = new Token(KAI_MAINNET_CHAIN_ID, '0xeD40c77CEd39E37180357Fd0C7f7A5C98f214B94', 3);

    const pairs = [];

    const pair0 = await Fetcher.fetchPairData(tokenA, tokenB, PROVIDER);
    const pair1 = await Fetcher.fetchPairData(tokenA, tokenTest, PROVIDER);
    const pair2 = await Fetcher.fetchPairData(tokenD, tokenC, PROVIDER);
    const pair3 = await Fetcher.fetchPairData(tokenC, tokenA, PROVIDER);
    const pair4 = await Fetcher.fetchPairData(tokenE, tokenA, PROVIDER);
    const pair5 = await Fetcher.fetchPairData(tokenC, tokenB, PROVIDER);

    pairs[0] = pair0;
    pairs[1] = pair1;
    pairs[2] = pair2;
    pairs[3] = pair3;
    pairs[4] = pair4;
    pairs[5] = pair5;

    const trade = Trade.bestTradeExactIn(pairs, new TokenAmount(tokenA, '1000'), tokenE, { maxNumResults: 3, maxHops: 3 });
    // const trade = Trade
    //       .bestTradeExactOut(pairs, tokenB, new TokenAmount(tokenA, '123000'), { maxNumResults: 4, maxHops: 4 });
    // const minReceive = trade[0].minimumAmountOut(new Percent('5', '1000')).toFixed(3);
    // const denominatorBN = new BN(trade[0].priceImpact.denominator).toString();
    // const priceImpact = trade[0].priceImpact.toFixed(2, { groupSeparator: ',' });
    // const input = trade[0].inputAmount.toFixed(3, { groupSeparator: ',' });
    // const output = trade[0].outputAmount.toFixed(3, { groupSeparator: ',' });
    // const inOverOut = input / output;
    // const outOverIn = output / input;

    console.log(
      'pairs: ', pairs,
      ' trade: ', trade,
      // ' trade[0].outputAmount.toFixed(3): ', trade[0].outputAmount.toFixed(3),
      // ' trade[1].outputAmount.toFixed(3): ', trade[1].outputAmount.toFixed(3),
      // ' trade[2].outputAmount.toFixed(3): ', trade[2].outputAmount.toFixed(3),
      // ' denominatorBN: ', denominatorBN,
      // ' trade[0].priceImpact.denominator: ', JSON.stringify(trade[0].priceImpact.denominator),
      // ' trade[0].priceImpact.numerator: ', JSON.stringify(trade[0].priceImpact.numerator),
      // // ' priceImpact: ', priceImpact,
      // ' outputAmount: ', trade[0].outputAmount.toFixed(3, { groupSeparator: ',' }),
      // ' executionPrice: ', trade[0].executionPrice.toFixed(3, { groupSeparator: ',' }),
      // ' input: ', input,
      // ' output: ', output,
      // ' inOverOut: ', inOverOut,
      // ' outOverIn: ', outOverIn,
      // ' minReceive: ', minReceive,
    );
  };

  const approveTokens = async () => {
    // const infoTokenIn = tokenIn.current.getTokenInfo();
    const infoTokenIn = tokenIn.current.getTokenInfo() ? tokenIn.current.getTokenInfo() : tokenIn.current.getNativeTokenInfo();
    const _web3 = web3.current;
    const _web3Data = web3Data.current;
    const BN = _web3.utils.BN;

    const amountInBN = new BN((inputValue.current * 10 ** infoTokenIn.decimals).toString())
      .mul(new BN(10)
      .pow(new BN(infoTokenIn.decimals)))
      .div(new BN((10 ** infoTokenIn.decimals).toString()))
      .toString();

    console.log(
      'amountInBN: ',
      amountInBN,
      ' amountInBN / (10 ** infoTokenIn.decimals): ',
      amountInBN / (10 ** infoTokenIn.decimals),
    );
    
    if (infoTokenIn.address) {
      const contractTokenIn = new _web3.eth.Contract(Contracts.erc20.abi, infoTokenIn.address);
      const transactionApproveTokenIn = await contractTokenIn.methods
        .approve(Contracts.router.address, amountInBN)
        .send({ from: _web3Data.address });
        if (transactionApproveTokenIn.status) {
          setDisableSwap(false);
        } else {
          setDisableSwap(true);
        }
    }
  }

  const swap = async () => {
    const infoTokenIn = tokenIn.current.getTokenInfo() ? tokenIn.current.getTokenInfo() : tokenIn.current.getNativeTokenInfo();
    const infoTokenOut = tokenOut.current.getTokenInfo() ? tokenOut.current.getTokenInfo() : tokenOut.current.getNativeTokenInfo();
    const _web3Data = web3Data.current;
    const BN = web3.current.utils.BN;
    const _swapInfo = swapInfo.current;
    const routerContract = _web3Data.contracts.router;
    console.log('_swapInfo: ', _swapInfo);
    
    const path = _swapInfo.route.map(token => {
      return token.address;
    });
    const to = _web3Data.address;
    const deadline = (Date.parse(new Date()) / 1000) + (60 * slippageAndDeadline.current.getDeadline());

    // Exact in
    const amountIn = (_swapInfo.amountIn * 10 ** _swapInfo.route[0].decimals).toString();
    const amountInBN = new BN(amountIn).toString();

    const amountOutMin =
      _swapInfo && _swapInfo.minOut
        ? (_swapInfo.minOut * 10 ** _swapInfo.route[_swapInfo.route.length - 1].decimals).toString()
        : '';
    const amountOutMinBN = amountOutMin ? new BN(amountOutMin).toString() : '';

    // Exact out
    const amountOut = (_swapInfo.amountOut * 10 ** _swapInfo.route[_swapInfo.route.length - 1].decimals).toString();
    const amountOutBN = new BN(amountOut).toString();

    const amountInMax =
      _swapInfo && _swapInfo.maxIn
        ? (_swapInfo.maxIn * 10 ** _swapInfo.route[0].decimals).toString()
        : '';
    const amountInMaxBN = new BN(amountInMax).toString();
    
    console.log(
      'amountIn: ', amountIn,
      ' amountOutMin: ', amountOutMin,
      ' path: ', path,
      ' to: ', to,
      ' deadline: ', deadline,
      ' amountInBN: ', amountInBN,
      ' amountOutMinBN: ', amountOutMinBN,
      ' amountOutBN: ', amountOutBN,
      ' amountInMaxBN: ', amountInMaxBN,
    );
    if (_swapInfo && _swapInfo.minOut) {
      let txSwapExactIn;
      if (!infoTokenIn.address && infoTokenOut.address) {
        const _shouldUseSupportingFeeOnTransfer = await shouldUseSupportingFeeOnTransfer(
          3, amountInBN, amountOutMinBN, path, to, deadline
        );
        const returnType = typeof _shouldUseSupportingFeeOnTransfer === 'boolean';
        console.log('_shouldUseSupportingFeeOnTransfer: ', _shouldUseSupportingFeeOnTransfer);
        if (returnType) {
          if (_shouldUseSupportingFeeOnTransfer) {
            // Passed
            txSwapExactIn = await routerContract.methods
              .swapExactETHForTokensSupportingFeeOnTransferTokens(
                amountOutMinBN,
                path,
                to,
                deadline,
              )
              .send({ from: _web3Data.address, value: amountInBN });
          } else {
            txSwapExactIn = await routerContract.methods
              .swapExactETHForTokens(
                amountOutMinBN,
                path,
                to,
                deadline,
              )
              .send({ from: _web3Data.address, value: amountInBN });
          }
        }
      } else if (infoTokenIn.address && !infoTokenOut.address) {
        const _shouldUseSupportingFeeOnTransfer = await shouldUseSupportingFeeOnTransfer(
          2, amountInBN, amountOutMinBN, path, to, deadline
        );
        const returnType = typeof _shouldUseSupportingFeeOnTransfer === 'boolean';
        console.log('_shouldUseSupportingFeeOnTransfer: ', _shouldUseSupportingFeeOnTransfer);
        if (returnType) {
          if (_shouldUseSupportingFeeOnTransfer) {
            // Passed
            txSwapExactIn = await routerContract.methods
              .swapExactTokensForETHSupportingFeeOnTransferTokens(
                amountInBN,
                amountOutMinBN,
                path,
                to,
                deadline,
              )
              .send({ from: _web3Data.address });
          } else {
            txSwapExactIn = await routerContract.methods
              .swapExactTokensForETH(
                amountInBN,
                amountOutMinBN,
                path,
                to,
                deadline,
              )
              .send({ from: _web3Data.address });
          }
        }
      } else if (infoTokenIn.address && infoTokenOut.address) {
        const _shouldUseSupportingFeeOnTransfer = await shouldUseSupportingFeeOnTransfer(
          1, amountInBN, amountOutMinBN, path, to, deadline
        );
        const returnType = typeof _shouldUseSupportingFeeOnTransfer === 'boolean';
        console.log('_shouldUseSupportingFeeOnTransfer: ', _shouldUseSupportingFeeOnTransfer);
        if (returnType) {
          if (_shouldUseSupportingFeeOnTransfer) {
            // Passed
            txSwapExactIn = await routerContract.methods
              .swapExactTokensForTokensSupportingFeeOnTransferTokens(
                amountInBN,
                amountOutMinBN,
                path,
                to,
                deadline,
              )
              .send({ from: _web3Data.address });
          } else {
            txSwapExactIn = await routerContract.methods
              .swapExactTokensForTokens(
                amountInBN,
                amountOutMinBN,
                path,
                to,
                deadline,
              )
              .send({ from: _web3Data.address });
          }
        }
      }
      console.log('txSwapExactIn: ', txSwapExactIn);
    } else if (_swapInfo && _swapInfo.maxIn) {
      let txExactOut;
      if (!infoTokenIn.address && infoTokenOut.address) {
        // Passed
        txExactOut = await routerContract.methods
          .swapETHForExactTokens(
            amountOutBN,
            path,
            to,
            deadline,
          )
          .send({ from : _web3Data.address, value: amountInMaxBN });
      } else if (infoTokenIn.address && !infoTokenOut.address) {
        // Passed
        txExactOut = await routerContract.methods
          .swapTokensForExactETH(
            amountOutBN,
            amountInMaxBN,
            path,
            to,
            deadline,
          )
          .send({ from : _web3Data.address });
      } else if (infoTokenIn.address && infoTokenOut.address) {
        txExactOut = await routerContract.methods
          .swapTokensForExactTokens(
            amountOutBN,
            amountInMaxBN,
            path,
            to,
            deadline,
          )
          .send({ from : _web3Data.address });
      }
      console.log('txExactOut: ', txExactOut);
    }
  };

  const sendKAI = async () => {
    const _web3 = web3.current;
    const _web3Data = web3Data.current;
    const wkaiContract = new _web3.eth.Contract(Contracts.wkai.abi, Contracts.wkai.address);
    
    // Send KAI
    // const tx = await _web3.eth.sendTransaction({
    //     to: '0x007DBdc4FCA732d28dA8e60494d0B2273f19fe0e',
    //     from: _web3Data.address,
    //     value: _web3.utils.toWei('1', 'ether'),
    //   }
    // );
    
    // Wrap KAI (convert KAI to WKAI)
    // const txWrap = await wkaiContract.methods.deposit().send({
    //   from: _web3Data.address,
    //   value: _web3.utils.toWei('1', 'ether'),
    // });
    // console.log('txWrap: ', txWrap);

    // Unwrap KAI (convert WKAI to KAI)
    const txUnwrap = await wkaiContract.methods
      .withdraw(_web3.utils.toWei('1', 'ether'))
      .send({ from: _web3Data.address});
    console.log('txUnwrap: ', txUnwrap);
  };

  const wrapOrUnwrap = async () => {
    const _web3 = web3.current;
    const _web3Data = web3Data.current;
    const wkaiContract = new _web3.eth.Contract(Contracts.wkai.abi, Contracts.wkai.address);
    const infoTokenIn = tokenIn.current.getTokenInfo() ? tokenIn.current.getTokenInfo() : tokenIn.current.getNativeTokenInfo();

    if (infoTokenIn.address) {
      const txUnwrap = await wkaiContract.methods
        .withdraw(_web3.utils.toWei(inputValue.current, 'ether'))
        .send({ from: _web3Data.address});
      console.log('txWrap: ', txUnwrap);
    } else {
      const txWrap = await wkaiContract.methods.deposit().send({
        from: _web3Data.address,
        value: _web3.utils.toWei(inputValue.current, 'ether'),
      });
      console.log('txWrap: ', txWrap);
    }
  };

  const web3Call = async () => {
    const _web3 = web3.current;
    const _web3Data = web3Data.current;
    const encode = _web3.eth.abi.encodeFunctionCall({
      // name: 'swapExactETHForTokens',
      name: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
      type: 'function',
      inputs: [{
        type: 'uint256',
        name: 'amountOutMin',
      }, {
        type: 'address[]',
        name: 'path',
      }, {
        name: "to",
				type: "address",
      }, {
        name: "deadline",
				type: "uint256",
      }]
    }, [
      '9388850000000000000',
      ['0xAF984E23EAA3E7967F3C5E007fbe397D8566D23d', '0x3271b574766459a63e811c771fbdA91be08b553e'],
      '0xb330Ba271c3719a496135011899837612ADA5Bfc',
      '1672168363',
    ]);

    const txCall = await _web3.eth.estimateGas({
      from: _web3Data.address,
      to: '0xcaA3AF1b19166277dAC631948b5FE94f6A4eD4e8',
      data: encode,
      value: '1000000000000000000',
    });

    console.log('txCall: ', txCall);
  };

  const shouldUseSupportingFeeOnTransfer = async (
    type, amountInBN, amountOutMinBN, path, to, deadline
  ) => {
    const _web3 = web3.current;
    const _web3Data = web3Data.current;
    let methodVanilla, methodSupportFee;
    let isExactTokens;
    switch (type) {
      case 1:
        methodVanilla = 'swapExactTokensForTokens';
        methodSupportFee = 'swapExactTokensForTokensSupportingFeeOnTransferTokens';
        isExactTokens = true;
        break;
      case 2:
        methodVanilla = 'swapExactTokensForETH';
        methodSupportFee = 'swapExactTokensForETHSupportingFeeOnTransferTokens';
        isExactTokens = true;
        break;
      case 3:
        methodVanilla = 'swapExactETHForTokens';
        methodSupportFee = 'swapExactETHForTokensSupportingFeeOnTransferTokens';
        isExactTokens = false;
        break;
      default:
        methodVanilla = undefined;
        methodSupportFee = undefined;
        isExactTokens = undefined;
        break;
    };
    let inputsExactTokens = [], inputsExactETH = [];
    if (isExactTokens) {
      inputsExactTokens = [{
        type: 'uint256',
        name: 'amountIn',
      }, {
        type: 'uint256',
        name: 'amountOutMin',
      }, {
        type: 'address[]',
        name: 'path',
      }, {
        name: "to",
				type: "address",
      }, {
        name: "deadline",
				type: "uint256",
      }];
    } else {
      inputsExactETH = [{
        type: 'uint256',
        name: 'amountOutMin',
      }, {
        type: 'address[]',
        name: 'path',
      }, {
        name: "to",
				type: "address",
      }, {
        name: "deadline",
				type: "uint256",
      }];
    }
    const data = isExactTokens ? [
      amountInBN,
      amountOutMinBN,
      path,
      to,
      deadline,
    ] : [
      amountOutMinBN,
      path,
      to,
      deadline,
    ];
    const encodeVanilla = _web3.eth.abi.encodeFunctionCall({
      name: methodVanilla,
      type: 'function',
      inputs: isExactTokens ? inputsExactTokens : inputsExactETH,
    }, data);
    const encodeSupportFee = _web3.eth.abi.encodeFunctionCall({
      name: methodSupportFee,
      type: 'function',
      inputs: isExactTokens ? inputsExactTokens : inputsExactETH,
    }, data);
    let error;
    try {
      console.log(
        'methodVanilla: ', methodVanilla,
        ' isExactTokens: ', isExactTokens,
        ' data: ', data,
      );
      const txEstimateGas = await _web3.eth.estimateGas({
        from: _web3Data.address,
        to: Contracts.router.address,
        data: encodeVanilla,
        value: isExactTokens ? undefined : amountInBN,
      });
      console.log('txEstimateGas: ', txEstimateGas);
      return false;
    } catch (err) {
      error = err;
    }
    
    console.log('error: ', error);

    try {
      console.log(
        'methodSupportFee: ', methodSupportFee,
        ' isExactTokens: ', isExactTokens,
        ' data: ', data,
      );
      await _web3.eth.estimateGas({
        from: _web3Data.address,
        to: Contracts.router.address,
        data: encodeSupportFee,
        value: isExactTokens ? undefined : amountInBN,
      });
      return true;
    } catch (err) {
      error = err;
    }
    
    console.log('error: ', error);
    return error;
  };

  return (
    <BoxWrapper>
      <TableHeader>
        <div>Swap</div>
        <ModalSlippage
          show={isModalSlippage}
          handleClose={() => {
            setIsModalSlippage(false);
            resetInputs();
          }}
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
      <Button onClick={() => console.log('pairs: ', pairs.current)}>Pairs</Button>
      <Button onClick={getInfo}>Get info</Button>
      <Button onClick={
          () => console.log(
            'slippage: ',
            (slippageAndDeadline.current.getSlippage()).toString(),
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
      <Button onClick={sendKAI}>Send KAI</Button>
      <Button onClick={web3Call}>Web3Call</Button>
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
        <BoxInfo
          isInfo={isInfo}
          isRouteExist={isRouteExist}
          swapInfo={swapInfo.current}
        />
      </Row>
      <Row>
        {
          /* isAddressSame && !isWrap.current */
          isAddressSame && !isWrap
          ? (
            <div style={{ color: 'red' }}>
              Addresses of input token and output token are the same,
              please use different addresses.
            </div>
          ) : ''
        }
      </Row>
      <Row>
        <Button
          // disabled={isWrap.current ? true : disableApprove}
          disabled={isWrap ? true : disableApprove}
          onClick={approveTokens}
        >
          Approve
        </Button>
        <Button
          // disabled={isWrap.current ? disableWrap : disableSwap}
          disabled={
            // isWrap.current
            isWrap
            ? disableWrap
            : swapInfo.current
              ? swapInfo.current.priceImpact >= 15
                ? true
                : false
              : true
          }
          // onClick={isWrap.current ? wrapOrUnwrap : swap}
          onClick={isWrap ? wrapOrUnwrap : swap}
        >
          {
            /* isWrap.current */
            isWrap
            ? 'Wrap/Unwrap'
            : swapInfo.current
              ? swapInfo.current.priceImpact >= 15
                ? 'Price impact too high'
                : swapInfo.current.priceImpact >= 5
                  ? 'Swap anyway'
                  : 'Swap'
              : 'Swap'
          }
        </Button>
      </Row>
    </BoxWrapper>
  );
}

const Row = styled.div`
  padding: 1vw;
`;
