import React, { useState } from 'react';
import {
  BoxInfoSwap,
  BoxInfoSwapRow,
  BoxInfoSwapWrapper,
  BoxInfoSwapTitle,
  Warning,
} from '../../../components/styles';

export default function BoxInfo (props) {
  const { isRouteExist, isInfo, swapInfo } = props;
  const [toggle, setToggle] = useState(true);
  const [toggleCurrency, setToggleCurrency] = useState(true);

  return (
    isRouteExist
      ? isInfo
        ? (
            <BoxInfoSwapWrapper>
              <BoxInfoSwapTitle>
                {
                  toggleCurrency ? (
                    <div onClick={() => setToggleCurrency(!toggleCurrency)}>
                        1 {swapInfo.route[swapInfo.route.length - 1].symbol} = {`${swapInfo.rate.inOverOut} ${swapInfo.route[0].symbol}`}
                    </div>
                  ) : ''
                }
                {
                  !toggleCurrency ? (
                    <div onClick={() => setToggleCurrency(!toggleCurrency)}>
                        1 {swapInfo.route[0].symbol} = {`${swapInfo.rate.outOverIn} ${swapInfo.route[swapInfo.route.length - 1].symbol}`}
                    </div>
                  ) : ''
                }
                <div onClick={() => {setToggle(!toggle)}}>⇅</div>
              </BoxInfoSwapTitle>
              {
                toggle
                  ? (
                    <BoxInfoSwap>
                    <BoxInfoSwapRow>
                      <div>Expected Output</div>
                      <div>{`${swapInfo.amountOut} ${swapInfo.route[swapInfo.route.length - 1].symbol}`}</div>
                    </BoxInfoSwapRow>
                    <BoxInfoSwapRow>
                      <div>Price Impact</div>
                      <div>{swapInfo.priceImpact} %</div>
                    </BoxInfoSwapRow>
                    <BoxInfoSwapRow>
                      <div>{swapInfo.minOut ? 'Minimum received after slippage' : 'Maximum sent after sippage'}</div>
                      <div>
                        {
                          swapInfo.minOut
                            ? `${swapInfo.minOut} ${swapInfo.route[swapInfo.route.length - 1].symbol}`
                            : `${swapInfo.maxIn} ${swapInfo.route[0].symbol}`
                        }
                      </div>
                      {/* <div>{`${swapInfo.minOut} ${swapInfo.route[swapInfo.route.length - 1]}`}</div> */}
                    </BoxInfoSwapRow>
                    <BoxInfoSwapRow>
                      <div>Liquidity provider fee</div>
                      <div>0.30%</div>
                    </BoxInfoSwapRow>
                    <BoxInfoSwapRow>
                      <div>Route</div>
                      <div>
                        {swapInfo.route.map((token, index) => {
                          return (
                            <span key={token}>{index + 1 === swapInfo.route.length ? token.symbol : `${token.symbol} ->`} </span>
                          );
                        })}
                      </div>
                    </BoxInfoSwapRow>
                  </BoxInfoSwap>
                  ) : ''
              }
            </BoxInfoSwapWrapper>
          ) : ''
      : (
        <Warning>Insufficient liquidity</Warning>
      )
  );
}