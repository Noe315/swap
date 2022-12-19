import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { tokenList } from '../../utils/data';


export default function TokenList (props) {
  if (props.isInputExist) {
    return (
      <ListGroup as="ul">
        <ListGroup.Item
          as="button"
          action="true"
          onClick={
            () => props.setToken(props.tokenAddress, props.tokenName, props.tokenSymbol)
          }
        >
          <div>{props.tokenName}</div>
          <div>{props.tokenAddress}</div>
        </ListGroup.Item>
      </ListGroup>
    )
  }

  return (
    <ListGroup as="ul">
      {tokenList.map(token => {
        return(
          <ListGroup.Item
            as="button"
            action="true"
            // onClick={
            //   () => props.setToken(token.address, token.name, token.symbol)
            // }
            onClick={
              () => !token.address && token.symbol === 'KAI'
                ? props.setNativeToken()
                : props.setToken(token.address, token.name, token.symbol)
            }
            key={token.address}
          >
            <div>{token.name}</div>
            <div>{token.address}</div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}