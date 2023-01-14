import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import { Text } from '../../../components/styles';

export default function TableHeader() {
  return (
    <Header>
      <Text>Position Overview</Text>
        <NavLink to='/provide-liquidity' style={{ marginLeft: 'auto' }}>
          <Button variant='success'>
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