import { forwardRef, useImperativeHandle, useState } from 'react';
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import { Invalid, Warning } from '../../../components/styles';
import { DEFAULT_DEADLINE, DEFAULT_SLIPPAGE } from '../../../constants/address';
import Slippage from '../../../components/ModalSlippage';

const TableHeader = forwardRef((props, _ref) => {
  const [toggleSlippage, setToggleSlippage] = useState(false);
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const [slippageDisplay, setSlippageDisplay] = useState(DEFAULT_SLIPPAGE);
  const [deadline, setDeadline] = useState(DEFAULT_DEADLINE);
  const [isValidCharacters, setIsValidCharacters] = useState(true);
  const [isFrontrunRisk, setIsFrontrunRisk] = useState();

  const handleCloseSlippage = () => {
    setToggleSlippage(!toggleSlippage);
    if (slippage && isValidCharacters && deadline) {
      setSlippage(slippage);
      setSlippageDisplay(slippage);
      setDeadline(deadline);
    } else {
      setSlippage(DEFAULT_SLIPPAGE);
      setSlippageDisplay(DEFAULT_SLIPPAGE);
      setDeadline(DEFAULT_DEADLINE);
      setIsValidCharacters(true);
    }
  };

  const slippageOnChange = (event) => {
    const value = event.target.value;
    setSlippage(value);
    checkInputSlippage(value);
  };

  const checkInputSlippage = (input) => {
    // const pattern = new RegExp(/^[0-9]+([.,][0-9]+)?$/);
    const sanitizeStartingWithZeros = Number(input);
    const isPositiveFloat =  !isNaN(sanitizeStartingWithZeros) && Number(sanitizeStartingWithZeros) > 0;
    if (isPositiveFloat) {
      if (sanitizeStartingWithZeros > 50) {
        setIsValidCharacters(false);
        return false;
      } else if (sanitizeStartingWithZeros > 1) {
        setIsValidCharacters(true);
        setIsFrontrunRisk(true);
        return true;
      } else {
        setIsValidCharacters(true);
        setIsFrontrunRisk(false);
        return true;
      }
    } else {
      setIsValidCharacters(false);
    }
  }

  useImperativeHandle(_ref, () => ({
    getSlippage: () => {
      return slippage;
    },
    getDeadline: () => {
      return deadline;
    }
  }));

  const Swap = () => {
    return (
      <>
        <div>Swap</div>
        <div style={{ marginLeft: 'auto', paddingRight: '1vw' }}>
          Slippage
        </div>
        <div
          style={{ width: '5vw' }}
          onClick={handleCloseSlippage}
        >
          {slippageDisplay} %
        </div>
        {/* {toggleSlippage &&
          <Popover>
            <Popover.Header>Transaction Settings</Popover.Header>
            <Popover.Body>
              <div>Slippage tolerance (%)</div>
              <input onChange={slippageOnChange} value={slippage} autoFocus/>
              <Button onClick={() => {setSlippage(DEFAULT_SLIPPAGE)}}>Auto</Button>
              {
                !isValidCharacters
                  ? (<Invalid>Invalid input</Invalid>)
                    : isFrontrunRisk
                    ? (<Warning>Frontrun risk</Warning>)
                    : ''
              }
              <div>Transaction deadline</div>
              <input />
              minutes
            </Popover.Body>
          </Popover>
        } */}
        <Slippage

        />
      </>
    )
  }
  
  return (
    <Header>
      <Swap />
    </Header>
  );
});

export default TableHeader;

const Header = styled.div`
  padding: 1vw;
  display: flex;
  flex-direction: row;
`;
