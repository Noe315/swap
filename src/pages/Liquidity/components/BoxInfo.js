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
