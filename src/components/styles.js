import { Modal } from 'react-bootstrap';
import styled from 'styled-components/macro';
import './index.css';

// Components for BoxInput.js
export const SwapBoxInputWrapper = styled.div`
  padding: 1vw;
  border: 1px solid;
  border-radius: 15px;
  border-color: gray;
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
  color: white;
`;

export const SwapBoxInputArea = styled.div`
  border: 1px solid;
  display: flex;
  flex-direction: row;
  border-radius: inherit;
`;

export const Input = styled.input`
  width: 40vw;
  padding-left: 1vw;
  border-radius: inherit;
  border: 1px solid;
  border-color: gray;
  color: white;
  background-color: #747373;

  ::placeholder {
    color: #c3c3c3;
  }

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
  color: #c3c3c3;
  border-color: gray
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
  color: #ff0000;
`

// Components for Position (index.js)
export const Row = styled.div`
  padding: 1vw;
  text-align: left;
  border: 1px solid;
  border-radius: inherit;
  border-color: gray;
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

// General components
export const TableHeader = styled.div`
  padding: 1vw;
  display: flex;
  flex-direction: row;
`;

export const InputNumber = styled.input`
  height: 2.7vw;
  border-radius: 9px;
  border: 1px solid;
  border-color: gray;
  color: white;
  background-color: #747373;
  ::placeholder {
    color: #c3c3c3;
  }
  ::-webkit-inner-spin-button{
      -webkit-appearance: none; 
      margin: 0; 
  }
  ::-webkit-outer-spin-button{
      -webkit-appearance: none; 
      margin: 0; 
  }
`;

export const Text = styled.div`
  color: #c3c3c3;
`;

// Component for ModalSlippage
export const ModalSlippageHeader = styled(Modal.Header)`
  background-color: rgba(33, 37, 41);
  color: #c3c3c3;
`

export const ModalSlippageBody = styled(Modal.Body)`
  background-color: rgba(70, 74, 78);
  color: #c3c3c3;
`;

export const ModalSlippageBodyRow = styled.div`
  display: flex;
  flex-direction: column;
`;