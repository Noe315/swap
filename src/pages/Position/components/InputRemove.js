// import React, { useEffect, useState } from 'react';
// import { RemoveInput } from '../../../components/styles';
// import { getWeb3 } from '../../../utils/connectWallet';

// export default function InputRemove (props) {
//   const position = props.position;
//   console.log('position: ', position);
//   const [web3, setWeb3] = useState();
//   const [inputValue, setInputValue] = useState();

//   useEffect(() => {
//     const _web3 = getWeb3();
//     setWeb3(_web3);
//   }, []);

//   const checkInput = (e) => {
//     const value = e.target.value;
//     const pattern = new RegExp(/^[0-9]+?$/);
//     const isValid = pattern.test(value);
//     if (value > 0 && value <= 100 && isValid) {
//       calculateOutput(value);
//       setInputValue(value);
//       // props.setInputValue(parseInt(value));
//       props.setDisableApprove(false);
//     } else {
//       console.log('value: ', value);
//       // setInputValue(value.substring(0, value.length - 1));
//       setInputValue('');
//       // props.setInputValue();
//       props.setOutputTokenAmounts();
//       props.setDisableApprove(true);
//     }
//     props.setDisableConfirm(true);
//   };

//   const calculateOutput = (value) => {
//     const BN = web3.utils.BN;
//     console.log('value: ', value);

//     // const outputToken0AmountWithDecimal = parseInt((position.token0AmountWithDecimal * value * 100) / 10000);
//     // const outputToken1AmountWithDecimal = parseInt((position.token1AmountWithDecimal * value * 100) / 10000);
//     const outputToken0AmountWithDecimal = new BN(position.token0AmountWithDecimal)
//       .mul(new BN((value * 100).toString()))
//       .div(new BN(10000))
//       .toString();
//     const outputToken1AmountWithDecimal = new BN(position.token1AmountWithDecimal)
//       .mul(new BN((value * 100).toString()))
//       .div(new BN(10000))
//       .toString();
//     const outputTokenPoolWithDecimal = new BN(position.poolAmount)
//       .mul(new BN((value * 100).toString()))
//       .div(new BN(10000))
//       .toString();
//     const outputToken0AmountWithoutDecimal = outputToken0AmountWithDecimal / (10 ** position.token0Decimal);
//     const outputToken1AmountWithoutDecimal = outputToken1AmountWithDecimal / (10 ** position.token1Decimal);
//     props.setOutputTokenAmounts(
//       {
//         outputToken0AmountWithDecimal,
//         outputToken0AmountWithoutDecimal,
//         outputToken1AmountWithDecimal,
//         outputToken1AmountWithoutDecimal,
//         outputTokenPoolWithDecimal
//       }
//     );
//     console.log(
//       'outputToken0AmountWithDecimal: ',
//       outputToken0AmountWithDecimal,
//       ' outputToken1AmountWithDecimal: ',
//       outputToken1AmountWithDecimal,
//       ' outputToken0AmountWithoutDecimal: ',
//       outputToken0AmountWithoutDecimal,
//       ' outputToken1AmountWithoutDecimal: ',
//       outputToken1AmountWithoutDecimal,
//       ' outputTokenPoolWithDecimal: ',
//       outputTokenPoolWithDecimal,
//     );
//   };

//   return (
//     <>
//       <div>Percent to remove (whole number from 1 to 100)</div>
//       <RemoveInput
//         type='number'
//         placeholder='0'
//         value={inputValue}
//         onChange={checkInput}
//       />
//     </>
//   );
// }

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { RemoveInput } from '../../../components/styles';
import { getWeb3 } from '../../../utils/connectWallet';

const InputRemove = forwardRef((props, _ref) => {
  const position = props.position;
  console.log('position: ', position);
  const [web3, setWeb3] = useState();
  const [inputValue, setInputValue] = useState();

  useEffect(() => {
    const _web3 = getWeb3();
    setWeb3(_web3);
  }, []);

  useImperativeHandle(_ref, () => ({
    resetInput: () => {
      console.log('reset');
      setInputValue('');
      props.setDisableApprove(true);
      props.setDisableConfirm(true);
    },
  }));

  const checkInput = (e) => {
    const value = e.target.value;
    const pattern = new RegExp(/^[0-9]+?$/);
    const isValid = pattern.test(value);
    if (value > 0 && value <= 100 && isValid) {
      calculateOutput(value);
      setInputValue(value);
      // props.setInputValue(parseInt(value));
      props.setDisableApprove(false);
    } else {
      console.log('value: ', value);
      // setInputValue(value.substring(0, value.length - 1));
      setInputValue('');
      // props.setInputValue();
      props.setOutputTokenAmounts();
      props.setDisableApprove(true);
    }
    props.setDisableConfirm(true);
  };

  const calculateOutput = (value) => {
    const BN = web3.utils.BN;
    console.log('value: ', value);

    // const outputToken0AmountWithDecimal = parseInt((position.token0AmountWithDecimal * value * 100) / 10000);
    // const outputToken1AmountWithDecimal = parseInt((position.token1AmountWithDecimal * value * 100) / 10000);
    const outputToken0AmountWithDecimal = new BN(position.token0AmountWithDecimal)
      .mul(new BN((value * 100).toString()))
      .div(new BN(10000))
      .toString();
    const outputToken1AmountWithDecimal = new BN(position.token1AmountWithDecimal)
      .mul(new BN((value * 100).toString()))
      .div(new BN(10000))
      .toString();
    const outputTokenPoolWithDecimal = new BN(position.poolAmount)
      .mul(new BN((value * 100).toString()))
      .div(new BN(10000))
      .toString();
    const outputToken0AmountWithoutDecimal = outputToken0AmountWithDecimal / (10 ** position.token0Decimal);
    const outputToken1AmountWithoutDecimal = outputToken1AmountWithDecimal / (10 ** position.token1Decimal);
    props.setOutputTokenAmounts(
      {
        outputToken0AmountWithDecimal,
        outputToken0AmountWithoutDecimal,
        outputToken1AmountWithDecimal,
        outputToken1AmountWithoutDecimal,
        outputTokenPoolWithDecimal
      }
    );
    console.log(
      'outputToken0AmountWithDecimal: ',
      outputToken0AmountWithDecimal,
      ' outputToken1AmountWithDecimal: ',
      outputToken1AmountWithDecimal,
      ' outputToken0AmountWithoutDecimal: ',
      outputToken0AmountWithoutDecimal,
      ' outputToken1AmountWithoutDecimal: ',
      outputToken1AmountWithoutDecimal,
      ' outputTokenPoolWithDecimal: ',
      outputTokenPoolWithDecimal,
    );
  };

  return (
    <>
      <div>Percent to remove (whole number from 1 to 100)</div>
      <RemoveInput
        type='number'
        placeholder='0'
        value={inputValue}
        onChange={checkInput}
      />
    </>
  );
});

export default InputRemove;