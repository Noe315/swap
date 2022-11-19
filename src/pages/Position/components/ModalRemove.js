import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Contracts } from '../../../constants/address';
import { getAccounts, getWeb3 } from '../../../utils/connectWallet';
import InputRemove from './InputRemove';
import TableHeader from './TableHeader';

export default function ModalRemove (props) {
  const position = props.positionState;
  const [address, setAddress] = useState();
  const [slippage, setSlippage] = useState();
  // const [inputValue, setInputValue] = useState();
  const [web3, setWeb3] = useState();
  const [outputTokenAmounts, setOutputTokenAmounts] = useState();
  const [disableApprove, setDisableApprove] = useState(true);
  const [disableConfirm, setDisableConfirm] = useState(true);

  useEffect(() => {
    const _web3 = getWeb3();
    setWeb3(_web3);
    const _getAccounts = async () => {
      const addresses = await getAccounts();
      setAddress(addresses[0]);
    };
    _getAccounts();
  }, []);

  const approve = async () => {
    const tokenPoolContract = new web3.eth.Contract(Contracts.uniswapV2Pair.abi, position.poolAddress);

    const txApproveTokenPool = await tokenPoolContract.methods
      .approve(Contracts.router.address, outputTokenAmounts.outputTokenPoolWithDecimal)
      .send({ from: address });
    if (txApproveTokenPool.status) {
      setDisableConfirm(false);
    } else {
      setDisableConfirm(true);
    }
  };

  const remove = async () => {
    
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div>Remove Liquidity</div>
          <div>Pool {position ? position.token0Name : ''} - {position ? position.token1Name : ''}</div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <TableHeader setSlippage={setSlippage} />
        <InputRemove
          position={position}
          // setInputValue={setInputValue}
          setOutputTokenAmounts={setOutputTokenAmounts}
          setDisableApprove={setDisableApprove}
          setDisableConfirm={setDisableConfirm}
        />
      </Modal.Body>

      <Modal.Body>
        <div>Total receive</div>
        <div>
          {outputTokenAmounts ? outputTokenAmounts.outputToken0AmountWithoutDecimal : 0} {' '}
          {position ? position.token0Name : ''}
        </div>
        <div>
          {outputTokenAmounts ? outputTokenAmounts.outputToken1AmountWithoutDecimal : 0} {' '}
          {position ? position.token1Name : ''}
        </div>
      </Modal.Body>
      
      <Modal.Body>
        <Button
          onClick={approve}
          disabled={disableApprove}
        >
          Approve
        </Button>
        <Button
          onClick={() => console.log('outputTokenAmounts: ', outputTokenAmounts)}
          disabled={disableConfirm}
        >
          Confirm
        </Button>
      </Modal.Body>
    </Modal>
  );
}
