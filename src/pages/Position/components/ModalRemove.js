import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Contracts } from '../../../constants/address';
import { getWeb3, getWeb3Data } from '../../../utils/connectWallet';
import InputRemove from './InputRemove';
import ModalHeader from './ModalHeader';

export default function ModalRemove (props) {
  const position = props.positionState;
  const [address, setAddress] = useState();
  const slippageAndDeadline = useRef();
  const [web3, setWeb3] = useState();
  const [web3Data, setWeb3Data] = useState();
  const [outputTokenAmounts, setOutputTokenAmounts] = useState();
  const [disableApprove, setDisableApprove] = useState(true);
  const [disableConfirm, setDisableConfirm] = useState(true);

  useEffect(() => {
    const _web3 = getWeb3();
    setWeb3(_web3);
    const _getWeb3Data = async () => {
      const _web3Data = await getWeb3Data();
      setAddress(_web3Data.address);
      setWeb3Data(_web3Data.contracts);
    };
    _getWeb3Data();
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
    const BN = web3.utils.BN;
    const routerContract = web3Data.router;
    const _slippage = slippageAndDeadline.current.getSlippage();

    const amount0Min = new BN(outputTokenAmounts.outputToken0AmountWithDecimal)
      .sub(new BN(outputTokenAmounts.outputToken0AmountWithDecimal)
        .mul(new BN((_slippage * 100).toString()))
        .div(new BN(10000)))
      .toString();
    const amount1Min = new BN(outputTokenAmounts.outputToken1AmountWithDecimal)
    .sub(new BN(outputTokenAmounts.outputToken1AmountWithDecimal)
      .mul(new BN((_slippage * 100).toString()))
      .div(new BN(10000)))
    .toString();
    const deadline = (Date.parse(new Date()) / 1000) + (60 * slippageAndDeadline.current.getDeadline());
    
    console.log(
      'amount0Min: ',
      amount0Min,
      ' amount1Min: ',
      amount1Min,
      ' deadline: ',
      deadline,
    );
    
    const txRemove = await routerContract.methods
      .removeLiquidity(
        position.token0Address,
        position.token1Address,
        outputTokenAmounts.outputTokenPoolWithDecimal,
        amount0Min,
        amount1Min,
        address,
        deadline
      )
      .send({ from: address });
    console.log('txRemove: ', txRemove);
  };

  const onHideModal = () => {
    props.handleClose();
    setDisableApprove(true);
    setDisableConfirm(true);
    setOutputTokenAmounts();
  };

  return (
    <Modal
      show={props.show}
      // onHide={props.handleClose}
      onHide={onHideModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div>Remove Liquidity</div>
          <div>Pool {position ? position.token0Name : ''} - {position ? position.token1Name : ''}</div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <ModalHeader
          // setSlippage={setSlippage}
          // setSlippage={checkSlippage}
          // ref={slippage}
          ref={slippageAndDeadline}
        />
        <InputRemove
          position={position}
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
          onClick={remove}
          disabled={disableConfirm}
        >
          Confirm
        </Button>
      </Modal.Body>
    </Modal>
  );
}
