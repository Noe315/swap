import React, { useState } from 'react';
import {
  BoxInfoSwap,
  BoxInfoSwapRow,
  BoxInfoSwapWrapper,
  BoxInfoSwapTitle,
} from './styles';

export default function BoxInfo (props) {
  const [toggle, setToggle] = useState(true);
  const [toggleCurrency, setToggleCurrency] = useState(true);

  if (props.action === 'swap' && props.isInfo) {
    return (
      <BoxInfoSwapWrapper>
        <BoxInfoSwapTitle>
          {
            toggleCurrency &&
            <div onClick={() => setToggleCurrency(!toggleCurrency)}>
                1 USDC = 108.7 KAI ($1)
            </div>
          }
          {
            !toggleCurrency &&
            <div onClick={() => setToggleCurrency(!toggleCurrency)}>
                1 KAI = 0.008188 USDC ($0.00816338)
            </div>
          }
          <div onClick={() => {setToggle(!toggle)}}>⇅</div>
        </BoxInfoSwapTitle>
        {toggle && 
          <BoxInfoSwap>
            <BoxInfoSwapRow>
              <div>Expected Output</div>
              <div>122.131 KAI</div>
            </BoxInfoSwapRow>
            <BoxInfoSwapRow>
              <div>Price Impact</div>
              <div>0.30%</div>
            </BoxInfoSwapRow>
            <BoxInfoSwapRow>
              <div>Minimum received after slippage (0.50%)</div>
              <div>121.524 KAI</div>
            </BoxInfoSwapRow>
            <BoxInfoSwapRow>
              <div>Liquidity provider fee</div>
              <div>0.30%</div>
            </BoxInfoSwapRow>
          </BoxInfoSwap>
        }
      </BoxInfoSwapWrapper>
    );
  } else if (props.action === 'provide' && props.isInfo) {
    return (
      <BoxInfoSwapWrapper>
        <BoxInfoSwapTitle>
          <div>Rate</div>
          {
            toggleCurrency &&
            <div onClick={() => setToggleCurrency(!toggleCurrency)}>
                {
                  props.isPairExist ?
                  `1 ${props.pair.current.nameTokenIn} =
                    ${Math.round(props.rate * 10000) / 10000}
                    ${props.pair.current.nameTokenOut}` :
                      props.rate ?
                        `1 ${props.pair.current.nameTokenIn} =
                          ${Math.round(props.rate * 10000) / 10000}
                          ${props.pair.current.nameTokenOut}` :
                            '1 undefined = undefined'
                }
            </div>
          }
          {
            !toggleCurrency &&
            <div onClick={() => setToggleCurrency(!toggleCurrency)}>
                {
                  props.isPairExist ?
                    `1 ${props.pair.current.nameTokenOut} =
                      ${Math.round((1 / props.rate) * 10000) / 10000}
                      ${props.pair.current.nameTokenIn}` :
                        props.rate ?
                          `1 ${props.pair.current.nameTokenOut} =
                            ${Math.round((1 / props.rate) * 10000) / 10000}
                            ${props.pair.current.nameTokenIn}` :
                              '1 undefined = undefined'
                }
            </div>
          }
        </BoxInfoSwapTitle> 
        <BoxInfoSwapRow>
          <div>Share of pool</div>
          <div>{Math.round(props.shareOfPool * 100) / 100}%</div>
        </BoxInfoSwapRow>
      </BoxInfoSwapWrapper>
    );
  }
}
