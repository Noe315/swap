import React, { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import styled from 'styled-components/macro';
import { tokenList } from '../../utils/data';


export default function TokenList (props) {
  if (props.isInputExist) {
    return (
      <ListGroup as="ul">
        <ListGroup.Item as="button" action="true" onClick={() => props.setToken(props.tokenAddress, props.tokenSymbol)}>
          <div>{props.tokenSymbol}</div>
          <div>{props.tokenAddress}</div>
        </ListGroup.Item>
      </ListGroup>
    )
  }

  return (
    <ListGroup as="ul">
      {tokenList.map(token => {
        return(
          <ListGroup.Item as="button" action="true" onClick={() => props.setToken(token.address, token.name)}>
            <div>{token.name}</div>
            <div>{token.address}</div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}