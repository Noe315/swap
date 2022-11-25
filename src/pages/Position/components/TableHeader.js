import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';

export default function TableHeader() {
  return (
    <Header>
      <div>Position Overview</div>
        <NavLink to='/provide-liquidity' style={{ marginLeft: 'auto' }}>
          <Button>
            + New Position
          </Button>
        </NavLink>
    </Header>
  )
}

const Header = styled.div`
  padding: 1vw;
  display: flex;
  flex-direction: row;
`;