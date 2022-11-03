import React from 'react'
import BoxWrapper from '../components/BoxWrapper';
import TableHeader from '../components/TableHeader';
import styled from 'styled-components/macro';
import { Button } from 'react-bootstrap';

export default function Position () {
  function createData(tokenUSDC, tokenKAI, poolShare) {
    return { tokenUSDC, tokenKAI, poolShare };
  }

  const rows = [
    createData(0.123, 0.456, 0.01),
    createData(0.234, 0.567, 0.02),
    createData(0.345, 0.678, 0.03),
  ];

  return (
    <BoxWrapper style={{ width: '55vw' }}>
      <TableHeader action="position" />
      {rows.map(row => {
        return (
          <Row>
            <div>
              <h5>USDC - KAI</h5>
              <div>{row.tokenUSDC} USDC | {row.tokenKAI} KAI | Pool share: {row.poolShare}</div>
            </div>
            <Button style={{ height: '3vw' }}>Remove</Button>
          </Row>
        );
      })}
    </BoxWrapper>
  );
}

const Row = styled.div`
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
