import React from 'react';
import styled from 'styled-components/macro';
import './index.css';

export default function BoxInput (props) {
  if (props.action === 'swap') {
    return (
      <SwapBoxInputWrapper>
        <SwapBoxInput>
          <SwapBoxInputTitle>
            <div>To</div>
            <div>Balance</div>
          </SwapBoxInputTitle>

          <SwapBoxInputArea>
            <Input
              type='number'
              placeholder='0.00'
              onChange={props.onChange}
              name={props.name}
              value={props.value}
            />
            <TokenSelect>{props.token}</TokenSelect>
          </SwapBoxInputArea>
        </SwapBoxInput>
      </SwapBoxInputWrapper>
    );
  } else {
    return (
      <SwapBoxInputWrapper>
        <SwapBoxInput>
          <SwapBoxInputTitle>
            <div>To</div>
            <div>Balance</div>
          </SwapBoxInputTitle>

          <SwapBoxInputArea>
            <Input
              type='number'
              placeholder='0.00'
              onChange={props.onChange}
              name={props.name}
              value={props.value}
            />
            <TokenSelect>{props.token}</TokenSelect>
          </SwapBoxInputArea>
        </SwapBoxInput>
      </SwapBoxInputWrapper>
    );
  }
}

const SwapBoxInputWrapper = styled.div`
  padding: 1vw;
  border: 1px solid;
  border-radius: 15px;
`;

const SwapBoxInput = styled.div`
  height: 12vh;
  display: flex;
  flex-direction: column;
  border-radius: 9px;
`;

const SwapBoxInputTitle = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 1vw;
  justify-content: space-between;
`;

const SwapBoxInputArea = styled.div`
  border: 1px solid;
  display: flex;
  flex-direction: row;
  border-radius: inherit;
`;

const Input = styled.input`
  width: 40vw;
  border-radius: inherit;
  border: none;
  padding-left: 1vw;

  ::-webkit-inner-spin-button{
      -webkit-appearance: none; 
      margin: 0; 
  }
  ::-webkit-outer-spin-button{
      -webkit-appearance: none; 
      margin: 0; 
  }
`;

const TokenSelect = styled.div`
  margin-left: auto;
  padding-right: 1vw;
  align-self: center;
`;
