import styled from 'styled-components/macro';
import './index.css';

// Components for BoxInput.js
export const SwapBoxInputWrapper = styled.div`
  padding: 1vw;
  border: 1px solid;
  border-radius: 15px;
`;

export const SwapBoxInput = styled.div`
  height: 12vh;
  display: flex;
  flex-direction: column;
  border-radius: 9px;
`;

export const SwapBoxInputTitle = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 1vw;
  justify-content: space-between;
`;

export const SwapBoxInputArea = styled.div`
  border: 1px solid;
  display: flex;
  flex-direction: row;
  border-radius: inherit;
`;

export const Input = styled.input`
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

export const TokenSelect = styled.div`
  margin-left: auto;
  padding-right: 1vw;
  align-self: center;
`;

// Components for BoxInfo.js
export const BoxInfoSwap = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1.5vw;
`;

export const BoxInfoSwapRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const BoxInfoSwapTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  :hover {
    cursor: pointer;
  }
`;

export const BoxInfoSwapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1vw;
  border: 1px solid;
  border-radius: 15px;
`;

// Components for index.js (SelectToken)
export const Invalid = styled.div`
  color: red;
  padding-bottom: 1vw;
`;

export const InputAddress = styled.input`
  width: 100%;
  border-radius: 9px;
`;

// Components for TableHeader.js
export const Warning = styled.div`
  color: #ff8405;
`

// Components for Position (index.js)
export const Row = styled.div`
  padding: 1vw;
  text-align: left;
  border: 1px solid;
  border-radius: inherit;
  margin: 1vw 1vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const RemoveInput = styled.input`
  width: 100%;
  border-radius: 1vw;
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