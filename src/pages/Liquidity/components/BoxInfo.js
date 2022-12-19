import React, { useState } from 'react';
import {
  BoxInfoSwapRow,
  BoxInfoSwapWrapper,
  BoxInfoSwapTitle,
} from '../../../components/styles';

export default function BoxInfo (props) {
  const [toggleCurrency, setToggleCurrency] = useState(true);

  return (
    <BoxInfoSwapWrapper>
      <BoxInfoSwapTitle>
        <div>Rate</div>
        {
          toggleCurrency &&
          <div onClick={() => setToggleCurrency(!toggleCurrency)}>
              {
                props.isPairExist
                  ? `1 ${
                    props.tokenIn.current.getTokenInfo()
                      ? props.tokenIn.current.getTokenInfo().symbol
                      : props.tokenIn.current.getNativeTokenInfo().symbol
                  } = ${Math.round(props.rate * 10000) / 10000}
                  ${
                    props.tokenOut.current.getTokenInfo()
                      ? props.tokenOut.current.getTokenInfo().symbol
                      : props.tokenOut.current.getNativeTokenInfo().symbol
                  }`
                  : props.rate
                    ? `1 ${
                      props.tokenIn.current.getTokenInfo()
                        ? props.tokenIn.current.getTokenInfo().symbol
                        : props.tokenIn.current.getNativeTokenInfo().symbol
                    } = ${Math.round(props.rate * 10000) / 10000}
                    ${
                      props.tokenOut.current.getTokenInfo()
                        ? props.tokenOut.current.getTokenInfo().symbol
                        : props.tokenOut.current.getNativeTokenInfo().symbol
                    }`
                    : '1 undefined = undefined'
              }
          </div>
        }
        {
          !toggleCurrency &&
          <div onClick={() => setToggleCurrency(!toggleCurrency)}>
              {
                props.isPairExist
                ? `1 ${
                    props.tokenOut.current.getTokenInfo()
                      ? props.tokenOut.current.getTokenInfo().symbol
                      : props.tokenOut.current.getNativeTokenInfo().symbol
                    } = ${Math.round((1 / props.rate) * 10000) / 10000}
                    ${
                      props.tokenIn.current.getTokenInfo()
                        ? props.tokenIn.current.getTokenInfo().symbol
                        : props.tokenIn.current.getNativeTokenInfo().symbol
                    }`
                : props.rate
                    ? `1 ${
                      props.tokenOut.current.getTokenInfo()
                        ? props.tokenOut.current.getTokenInfo().symbol
                        : props.tokenOut.current.getNativeTokenInfo().symbol
                          } = ${Math.round((1 / props.rate) * 10000) / 10000}
                          ${
                            props.tokenIn.current.getTokenInfo()
                              ? props.tokenIn.current.getTokenInfo().symbol
                              : props.tokenIn.current.getNativeTokenInfo().symbol
                          }`
                    : '1 undefined = undefined'
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
