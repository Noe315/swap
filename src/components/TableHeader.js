import { useState } from 'react';
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';

export default function TableHeader(props) {
  const [toggleSlippage, setToggleSlippage] = useState(false);
  const [slippage, setSlippage] = useState(0.5);

  const handleCloseSlippage = () => {
    setToggleSlippage(!toggleSlippage);
    setSlippage(slippage);
  };

  const slippageOnChange = (event) => {
    const value = event.target.value;
    if (value) {
      setSlippage(value);
    } else {
      setSlippage(0.5);
    }
  };

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
            {slippage} %
          </div>
          {toggleSlippage &&
            <Popover>
              <Popover.Header>Transaction Settings</Popover.Header>
              <Popover.Body>
                <div>Slippage tolerance (%)</div>
                <input onChange={slippageOnChange} />
                <Button onClick={() => {setSlippage(0.5)}}>Auto</Button>
                <div>Transaction deadline</div>
                <input />
                minutes
              </Popover.Body>
            </Popover>
          }
      </>
    );
  };

  const Liquidity = () => {
    return (
      <>
        <div>Provide Liquidity</div>
        <div style={{ marginLeft: 'auto', paddingRight: '1vw' }}>
          Slippage
        </div>
        <div
          style={{ width: '5vw' }}
          onClick={handleCloseSlippage}
        >
          {slippage} %
        </div>
        {toggleSlippage &&
          <Popover>
            <Popover.Header>Transaction Settings</Popover.Header>
            <Popover.Body>
              <div>Slippage tolerance (%)</div>
              <input onChange={slippageOnChange} />
              <Button onClick={() => {setSlippage(0.5)}}>Auto</Button>
              <div>Transaction deadline</div>
              <input />
              minutes
            </Popover.Body>
          </Popover>
        }
      </>
    )
  }

  const Position = () => {
    return (
      <>
        <div>Position Overview</div>
        <Button style={{ marginLeft: 'auto' }}>+ New Position</Button>
      </>
    )
  }

  if (props.action === 'swap') {
    return (
      <Header>
        <Swap />
      </Header>
    );
  } else if (props.action === 'provide') {
    return (
      <Header>
        <Liquidity />
      </Header>
    );
  } else {
    return (
      <Header>
        <Position />
      </Header>
    )
  }
}

const Header = styled.div`
  padding: 1vw;
  display: flex;
  flex-direction: row;
`;