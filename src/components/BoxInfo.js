import React, { useState } from 'react';
import styled from 'styled-components/macro';
import './index.css';

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
                1 USDC = 108.7 KAI ($1)
            </div>
          }
          {
            !toggleCurrency &&
            <div onClick={() => setToggleCurrency(!toggleCurrency)}>
                1 KAI = 0.008188 USDC ($0.00816338)
            </div>
          }
        </BoxInfoSwapTitle> 
        <BoxInfoSwapRow>
          <div>Share of pool</div>
          <div>{'<'}0.01%</div>
        </BoxInfoSwapRow>
      </BoxInfoSwapWrapper>
    );
  }
}

const BoxInfoSwap = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1.5vw;
`;

const BoxInfoSwapRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const BoxInfoSwapTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  :hover {
    cursor: pointer;
  }
`;

const BoxInfoSwapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1vw;
  border: 1px solid;
  border-radius: 15px;
`;