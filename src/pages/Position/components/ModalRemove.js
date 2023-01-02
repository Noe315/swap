import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import ModalSlippage from '../../../components/ModalSlippage';
import { TableHeader } from '../../../components/styles';
import { Contracts, DEFAULT_SLIPPAGE, NATIVE_TOKEN_ADDRESS } from '../../../constants/address';
import { getWeb3, getWeb3Data } from '../../../utils/connectWallet';
import InputRemove from './InputRemove';

export default function ModalRemove (props) {
  const position = props.positionState;
  console.log('position: ', position);
  const [address, setAddress] = useState();
  const slippageAndDeadline = useRef();
  const [web3, setWeb3] = useState();
  const [web3Data, setWeb3Data] = useState();
  const [outputTokenAmounts, setOutputTokenAmounts] = useState();
  const [disableApprove, setDisableApprove] = useState(true);
  const [disableConfirm, setDisableConfirm] = useState(true);
  const [isModalSlippage, setIsModalSlippage] = useState(false);
  const inputRef = useRef();

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

    let txRemove;
    if (position.token0Address === NATIVE_TOKEN_ADDRESS && position.token1Address !== NATIVE_TOKEN_ADDRESS) {
      console.log(
        'position.token1Address: ', position.token1Address,
        ' outputTokenAmounts.outputTokenPoolWithDecimal: ', outputTokenAmounts.outputTokenPoolWithDecimal,
        ' amount1Min: ', amount1Min,
        ' amount0Min: ', amount0Min,
        ' address: ', address,
        ' deadline: ', deadline,
      );
      const _shouldUseSupportingFeeOnTransfer = await shouldUseSupportingFeeOnTransfer(
        position.token0Address, outputTokenAmounts.outputTokenPoolWithDecimal, amount0Min, amount1Min, address, deadline
      );
      const returnType = typeof _shouldUseSupportingFeeOnTransfer === 'boolean';
      console.log('_shouldUseSupportingFeeOnTransfer: ', _shouldUseSupportingFeeOnTransfer);
      if (returnType) {
        if (_shouldUseSupportingFeeOnTransfer) {
          txRemove = await routerContract.methods
            .removeLiquidityETHSupportingFeeOnTransferTokens(
              position.token1Address,
              outputTokenAmounts.outputTokenPoolWithDecimal,
              amount1Min,
              amount0Min,
              address,
              deadline
            )
            .send({ from: address });
        } else {
          txRemove = await routerContract.methods
            .removeLiquidityETH(
              position.token1Address,
              outputTokenAmounts.outputTokenPoolWithDecimal,
              amount1Min,
              amount0Min,
              address,
              deadline
            )
            .send({ from: address });
        }
      }
    } else if (position.token0Address !== NATIVE_TOKEN_ADDRESS && position.token1Address === NATIVE_TOKEN_ADDRESS) {
      console.log(
        'position.token0Address: ', position.token0Address,
        ' outputTokenAmounts.outputTokenPoolWithDecimal: ', outputTokenAmounts.outputTokenPoolWithDecimal,
        ' amount1Min: ', amount1Min,
        ' amount0Min: ', amount0Min,
        ' address: ', address,
        ' deadline: ', deadline,
      );
      const _shouldUseSupportingFeeOnTransfer = await shouldUseSupportingFeeOnTransfer(
        position.token0Address, outputTokenAmounts.outputTokenPoolWithDecimal, amount0Min, amount1Min, address, deadline
      );
      const returnType = typeof _shouldUseSupportingFeeOnTransfer === 'boolean';
      console.log('_shouldUseSupportingFeeOnTransfer: ', _shouldUseSupportingFeeOnTransfer);
      if (returnType) {
        if (_shouldUseSupportingFeeOnTransfer) {
          // Passed
          txRemove = await routerContract.methods
            .removeLiquidityETHSupportingFeeOnTransferTokens(
              position.token0Address,
              outputTokenAmounts.outputTokenPoolWithDecimal,
              amount0Min,
              amount1Min,
              address,
              deadline
            )
            .send({ from: address });
        } else {
          txRemove = await routerContract.methods
            .removeLiquidityETH(
              position.token0Address,
              outputTokenAmounts.outputTokenPoolWithDecimal,
              amount0Min,
              amount1Min,
              address,
              deadline
            )
            .send({ from: address });
        }
      }
      console.log('txRemove: ', txRemove);
    } else {
      console.log(
        'position.token0Address: ', position.token0Address,
        ' position.token1Address: ', position.token1Address,
        ' outputTokenAmounts.outputTokenPoolWithDecimal: ', outputTokenAmounts.outputTokenPoolWithDecimal,
        ' amount1Min: ', amount1Min,
        ' amount0Min: ', amount0Min,
        ' address: ', address,
        ' deadline: ', deadline,
      );
      txRemove = await routerContract.methods
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
    }  
    console.log('txRemove: ', txRemove);
  };

  const onHideModal = () => {
    props.handleClose();
    setDisableApprove(true);
    setDisableConfirm(true);
    setOutputTokenAmounts();
  };

  const shouldUseSupportingFeeOnTransfer = async (
    token, liquidity, amountTokenMin, amountETHMin, to, deadline
  ) => {
    const methodVanilla = 'removeLiquidityETH';
    const methodSupportFee = 'removeLiquidityETHSupportingFeeOnTransferTokens';
    let inputs = [{
      type: 'address',
      name: 'token',
    }, {
      type: 'uint256',
      name: 'liquidity',
    }, {
      type: 'uint256',
      name: 'amountTokenMin',
    }, {
      type: 'uint256',
      name: 'amountETHMin',
    }, {
      type: "address",
      name: "to",
    }, {
      type: "uint256",
      name: "deadline",
    }];

    const data = [
      token,
      liquidity,
      amountTokenMin,
      amountETHMin,
      to,
      deadline,
    ];
    
    const encodeVanilla = web3.eth.abi.encodeFunctionCall({
      name: methodVanilla,
      type: 'function',
      inputs: inputs,
    }, data);
    const encodeSupportFee = web3.eth.abi.encodeFunctionCall({
      name: methodSupportFee,
      type: 'function',
      inputs: inputs
    }, data);
    
    let error;
    try {
      console.log(
        'methodVanilla: ', methodVanilla,
        ' data: ', data,
      );
      await web3.eth.estimateGas({
        from: address,
        to: Contracts.router.address,
        data: encodeVanilla,
      });
      return false;
    } catch (err) {
      error = err;
    }
    
    console.log('error: ', error);

    try {
      console.log(
        'methodSupportFee: ', methodSupportFee,
        ' data: ', data,
      );
      await web3.eth.estimateGas({
        from: address,
        to: Contracts.router.address,
        data: encodeSupportFee,
      });
      return true;
    } catch (err) {
      error = err;
    }
    
    console.log('error: ', error);
    return error;
  };

  const resetInput = () => {
    inputRef.current.resetInput();
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
        {/* <ModalHeader
          // setSlippage={setSlippage}
          // setSlippage={checkSlippage}
          // ref={slippage}
          ref={slippageAndDeadline}
        /> */}
        <TableHeader>
          <ModalSlippage
            show={isModalSlippage}
            handleClose={() => setIsModalSlippage(false)}
            ref={slippageAndDeadline}
          />
          <div
            style={{ marginLeft: 'auto', paddingRight: '1vw' }}
            onClick={() => {
              setIsModalSlippage(true);
              resetInput();
            }}
          >
            Slippage {' '}
            {
              slippageAndDeadline.current
              ? slippageAndDeadline.current.getSlippage()
                ? Math.round(slippageAndDeadline.current.getSlippage() * 100) / 100
                : DEFAULT_SLIPPAGE
              : DEFAULT_SLIPPAGE
            } %
          </div>
        </TableHeader>
        <InputRemove
          ref={inputRef}
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
