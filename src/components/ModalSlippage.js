import { forwardRef, useImperativeHandle, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { InputNumber, Invalid, ModalSlippageBody, ModalSlippageBodyRow, ModalSlippageHeader, Warning } from './styles';
import { DEFAULT_DEADLINE, DEFAULT_SLIPPAGE } from '../constants/address';
import { blockInvalidChar } from '../utils/helpers';

const ModalSlippage = forwardRef((props, _ref) => {
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const [deadline, setDeadline] = useState(DEFAULT_DEADLINE);
  const [isValidCharacters, setIsValidCharacters] = useState(true);
  const [isFrontrunRisk, setIsFrontrunRisk] = useState();

  const handleCloseSlippage = () => {
    // if (slippage && isValidCharacters && deadline) {
    if (slippage && deadline) {
      const slippageRounded = Math.round(slippage * 100) / 100;
      console.log('slippageRounded: ', slippageRounded);
      setSlippage(slippageRounded);
      setDeadline(deadline);
    } else {
      setSlippage(DEFAULT_SLIPPAGE);
      setDeadline(DEFAULT_DEADLINE);
      setIsValidCharacters(true);
    }
  };

  const slippageOnChange = (event) => {
    const value = event.target.value;
    // setSlippage(value);
    // checkInputSlippage(value);
    const pattern = new RegExp(/^[0-9]+([.][0-9]+)?$/);
    const isValid = pattern.test(value);
    const valueFloat = parseFloat(value);
    if (isValid) {
      if (valueFloat > 50) {
        setSlippage('');
      } else if (valueFloat > 1) {
        setIsFrontrunRisk(true);
        setSlippage(value);
      } else {
        setIsFrontrunRisk(false);
        setSlippage(value);
      }
    } else {
      setSlippage('');
      setIsFrontrunRisk(false);
    }
  };

  const deadlineOnChange = (e) => {
    const value = e.target.value;
    const pattern = new RegExp(/^[0-9]+?$/);
    const isValid = pattern.test(value);
    const valueInt = parseInt(value);
    if (isValid)  {
      setDeadline(valueInt)
    } else {
      setDeadline('');
    }
  }

  // const checkInputSlippage = (input) => {
  //   // const pattern = new RegExp(/^[0-9]+([.,][0-9]+)?$/);
  //   const sanitizeStartingWithZeros = Number(input);
  //   const isPositiveFloat =  !isNaN(sanitizeStartingWithZeros) && Number(sanitizeStartingWithZeros) > 0;
  //   if (isPositiveFloat) {
  //     if (sanitizeStartingWithZeros > 50) {
  //       setIsValidCharacters(false);
  //       return false;
  //     } else if (sanitizeStartingWithZeros > 1) {
  //       setIsValidCharacters(true);
  //       setIsFrontrunRisk(true);
  //       return true;
  //     } else {
  //       setIsValidCharacters(true);
  //       setIsFrontrunRisk(false);
  //       return true;
  //     }
  //   } else {
  //     setIsValidCharacters(false);
  //   }
  // }

  const onHideModal = () => {
    props.handleClose();
    handleCloseSlippage();
  };

  useImperativeHandle(_ref, () => ({
    getSlippage: () => {
      return slippage;
    },
    getDeadline: () => {
      return deadline;
    }
  }));
  
  return (
    <Modal
      show={props.show}
      onHide={onHideModal}
      dialogClassName='modal-79percent-width'
    >
      <ModalSlippageHeader>Transaction Settings</ModalSlippageHeader>
      <ModalSlippageBody>
        {/* <div style={{display: 'flex', flexDirection: 'column'}}> */}
        <ModalSlippageBodyRow>
          <div>Slippage Tolerance (in % and must be less than 50)</div>
          <div style={{display: 'flex'}}>
            <InputNumber
              type='number'
              value={slippage}
              onChange={slippageOnChange}
              onKeyDown={blockInvalidChar}
              style={{flex: '80%'}}
            />
            <Button
              onClick={() => {setSlippage(DEFAULT_SLIPPAGE)}}
              variant='secondary'
              style={{flex: '20%'}}
            >
              Auto
            </Button>
          </div>
          {
            !isValidCharacters
              ? (<Invalid>Invalid input</Invalid>)
                : isFrontrunRisk
                ? (<Warning>Frontrun risk</Warning>)
                : ''
          }
        </ModalSlippageBodyRow>
        {/* </div> */}
      </ModalSlippageBody>
      <ModalSlippageBody style={{borderRadius: '0px 0px 0.5rem 0.5rem'}}>
        {/* <div style={{display: 'flex', flexDirection: 'column'}}> */}
        <ModalSlippageBodyRow>
          <div>Transaction deadline</div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <InputNumber
              type='number'
              value={deadline}
              onChange={deadlineOnChange}
              onKeyDown={blockInvalidChar}
              style={{flex: '80%'}}
            />
            <div style={{flex: '20%'}}>minutes</div>
          </div>
        </ModalSlippageBodyRow>
        {/* </div> */}
      </ModalSlippageBody>
    </Modal>
  );
});

export default ModalSlippage;
