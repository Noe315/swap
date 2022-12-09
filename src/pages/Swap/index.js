import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import BoxInput from '../../components/BoxInput';
import BoxInfo from '../../components/BoxInfo';
import BoxWrapper from '../../components/BoxWrapper';
import { TableHeader } from '../../components/styles';
import ModalSlippage from '../../components/ModalSlippage';
import { DEFAULT_SLIPPAGE, KAI_MAINNET_CHAIN_ID } from '../../constants/address';
import { Fetcher, Fraction, Percent, Route, Token, TokenAmount, Trade, TradeType } from '@uniswap/sdk';
import { Network } from "@ethersproject/networks";
import { ethers } from 'ethers';
import { getWeb3 } from '../../utils/connectWallet';
import JSBI from 'jsbi';

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
  const [web3, setWeb3] = useState();

  useEffect(() => {
    const _web3 = getWeb3();
    setWeb3(_web3);
  }, []);

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

  const getInfo = async () => {
    const BN = web3.utils.BN;
    const tokenA = new Token(KAI_MAINNET_CHAIN_ID, '0xb4D6438ebBB73bfF7Aea4E66d2B98469B6Ae4DEf', 3);
    const tokenB = new Token(KAI_MAINNET_CHAIN_ID, '0xbf35A89559F5e746cb8921F81dcd276612B41387', 3);
    const tokenC = new Token(KAI_MAINNET_CHAIN_ID, '0x72E184cf075EB1CFA861B49eC4E88E2311150a94', 3);
    const tokenD = new Token(KAI_MAINNET_CHAIN_ID, '0x34e4b4994DEF3Df13481E430a4c7Eb0e476e0A25', 3);
    const tokenE = new Token(KAI_MAINNET_CHAIN_ID, '0x7F240E9885E0e1Cc485EBBA51181BB7033b8e7B6', 18);
    const tokenTest = new Token(KAI_MAINNET_CHAIN_ID, '0xeD40c77CEd39E37180357Fd0C7f7A5C98f214B94', 3);

    const network = {
      name: 'KardiaChain',
      chainId: KAI_MAINNET_CHAIN_ID,
      _defaultProvider: (providers) => new providers.JsonRpcProvider('https://rpc.kardiachain.io')
    }
    const provider = ethers.getDefaultProvider(network);

    const pairs = [];

    const pair0 = await Fetcher.fetchPairData(tokenA, tokenB, provider);
    const pair1 = await Fetcher.fetchPairData(tokenA, tokenTest, provider);
    const pair2 = await Fetcher.fetchPairData(tokenD, tokenC, provider);
    const pair3 = await Fetcher.fetchPairData(tokenC, tokenA, provider);
    const pair4 = await Fetcher.fetchPairData(tokenE, tokenA, provider);
    const pair5 = await Fetcher.fetchPairData(tokenC, tokenB, provider);

    pairs[0] = pair0;
    pairs[1] = pair1;
    pairs[2] = pair2;
    pairs[3] = pair3;
    pairs[4] = pair4;
    pairs[5] = pair5;

    const trade = Trade.bestTradeExactIn(pairs, new TokenAmount(tokenA, '1000'), tokenE, { maxNumResults: 3, maxHops: 3 });
    const denominatorBN = new BN(trade[0].priceImpact.denominator).toString();
    const priceImpact = trade[0].priceImpact.toFixed(2, { groupSeparator: ',' });
    // const minOut = trade.minimumAmountOut(new Percent('50', '10000'));
    // const fraction = Fraction(trade[0].priceImpact.numerator, trade[0].priceImpact.denominator).toFixed(2, { groupSeparator: ',' });
    const input = trade[0].inputAmount.toFixed(3, { groupSeparator: ',' });
    const output = trade[0].outputAmount.toFixed(5, { groupSeparator: ',' });
    const inOverOut = input / output;
    const outOverIn = output / input;

    console.log(
      'pairs: ', pairs,
      // ' route: ', route,
      ' trade: ', trade,
      ' denominatorBN: ', denominatorBN,
      ' trade[0].priceImpact.denominator: ', JSON.stringify(trade[0].priceImpact.denominator),
      ' trade[0].priceImpact.numerator: ', JSON.stringify(trade[0].priceImpact.numerator),
      ' priceImpact: ', priceImpact,
      ' outputAmount: ', trade[0].outputAmount.toFixed(5, { groupSeparator: ',' }),
      ' executionPrice: ', trade[0].executionPrice.toFixed(3, { groupSeparator: ',' }),
      ' input: ', input,
      ' output: ', output,
      ' inOverOut: ', inOverOut,
      ' outOverIn: ', outOverIn,
      // ' minOut: ', minOut,
      // ' fraction: ', fraction,
    );
  };

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
      <Button onClick={getInfo}>Get info</Button>
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
