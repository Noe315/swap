import { forwardRef, useImperativeHandle, useState } from 'react';
import styled from 'styled-components/macro';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import { Invalid, Warning } from '../../../components/styles';
import { DEFAULT_SLIPPAGE } from '../../../constants/address';

// export default function TableHeader(props) {
//   const DEFAULT_SLIPPAGE = 0.5;
//   const [toggleSlippage, setToggleSlippage] = useState(false);
//   const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
//   const [slippageDisplay, setSlippageDisplay] = useState(DEFAULT_SLIPPAGE);
//   // const slippage = useRef();
//   // const isValidCharacters = useRef();
//   // const isFrontrunRisk = useRef();
//   const [isValidCharacters, setIsValidCharacters] = useState(true);
//   const [isFrontrunRisk, setIsFrontrunRisk] = useState();

//   useEffect(() => {
//     props.setSlippage(DEFAULT_SLIPPAGE / 100);
//   })

//   const handleCloseSlippage = () => {
//     setToggleSlippage(!toggleSlippage);
//     // if (slippage && isValidCharacters.current) {
//     // if (slippage.current && isValidCharacters.current) {
//     // if (slippage.current && isValidCharacters) {
//     if (slippage && isValidCharacters) {
//       // props.setSlippage(slippage);
//       const slippageRounded = Math.round(slippage * 100) / 10000;
//       const slippageDisplayRounded = Math.round(slippage * 100) / 100;
//       console.log('slippageRounded: ', slippageRounded);
      
//       props.setSlippage(slippageRounded);
//       setSlippageDisplay(slippageDisplayRounded);
//       // props.setSlippage(slippage.current);
//     } else {
//       props.setSlippage(DEFAULT_SLIPPAGE / 100);
//       setSlippage(DEFAULT_SLIPPAGE);
//       setSlippageDisplay(DEFAULT_SLIPPAGE);
//     }
//   };

//   const slippageOnChange = (event) => {
//     const value = event.target.value;
//     // slippage.current = value;
//     setSlippage(value);
//     checkInputSlippage(value);
//     // const isInputCheckValid = checkInputSlippage(value);
//     // console.log('isInputCheckValid: ', isInputCheckValid, ' isValidCharacters: ', isValidCharacters);
//     // if (value && isInputCheckValid) {
//     //   props.setSlippage(value);
//     // } else {
//     //   setSlippage(DEFAULT_SLIPPAGE);
//     //   props.setSlippage(DEFAULT_SLIPPAGE);
//     // }
//   };

//   const checkInputSlippage = (input) => {
//     // const pattern = new RegExp(/^[0-9]+([.,][0-9]+)?$/);
//     // const isMatchRegex = pattern.test(input);
//     // if (isMatchRegex) {
//       //   if (input > 50) {
//     //     isValidCharacters.current = true;
//     //   } else {
//     //     isValidCharacters.current = false;
//     //   }
//     // }
//     // const patternStartingWithZeros = new RegExp(/[0]+/);
//     // const sanitizeStartingWithZeros = input.replace(patternStartingWithZeros, '');
//     const sanitizeStartingWithZeros = Number(input);
//     const isPositiveFloat =  !isNaN(sanitizeStartingWithZeros) && Number(sanitizeStartingWithZeros) > 0;
//     if (isPositiveFloat) {
//       if (sanitizeStartingWithZeros > 50) {
//         // isValidCharacters.current = false;
//         setIsValidCharacters(false);
//         return false;
//       } else if (sanitizeStartingWithZeros > 1) {
//         // isValidCharacters.current = true;
//         // isFrontrunRisk.current = true;
//         setIsValidCharacters(true);
//         setIsFrontrunRisk(true);
//         return true;
//       } else {
//         setIsValidCharacters(true);
//         setIsFrontrunRisk(false);
//         // isValidCharacters.current = true;
//         // isFrontrunRisk.current = false;
//         return true;
//       }
//     }
//   }

//   const ModalHeader = () => {
//     return (
//       <>
//         <div style={{ marginLeft: 'auto', paddingRight: '1vw' }}>
//           Slippage
//         </div>
//         <div
//           style={{ width: '5vw' }}
//           onClick={handleCloseSlippage}
//         >
//           {slippageDisplay} %
//           {/* {slippage.current} % */}
//         </div>
//         {toggleSlippage &&
//           <Popover>
//             <Popover.Header>Transaction Settings</Popover.Header>
//             <Popover.Body>
//               <div>Slippage tolerance (%)</div>
//               {/* <input onChange={slippageOnChange} autoFocus/> */}
//               <input onChange={slippageOnChange} value={slippage} autoFocus/>
//               {/* <input onChange={slippageOnChange} value={slippage.current} autoFocus /> */}
//               <Button onClick={() => {setSlippage(DEFAULT_SLIPPAGE)}}>Auto</Button>
//               {/* <Button onClick={() => {slippage.current = DEFAULT_SLIPPAGE}}>Auto</Button> */}
//               {
//                 !isValidCharacters
//                 // !(isValidCharacters.current)
//                   ? (<Invalid>Invalid input</Invalid>)
//                     : isFrontrunRisk
//                   // : isFrontrunRisk.current
//                     ? (<Warning>Frontrun risk</Warning>)
//                     : ''
//               }
//               <div>Transaction deadline</div>
//               <input />
//               minutes
//             </Popover.Body>
//           </Popover>
//         }
//       </>
//     )
//   }
  
//   return (
//     <Header>
//       <ModalHeader />
//     </Header>
//   );
// };

const TableHeader = forwardRef((props, _ref) => {
  const [toggleSlippage, setToggleSlippage] = useState(false);
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const [slippageDisplay, setSlippageDisplay] = useState(DEFAULT_SLIPPAGE);
  const [isValidCharacters, setIsValidCharacters] = useState(true);
  const [isFrontrunRisk, setIsFrontrunRisk] = useState();

  const handleCloseSlippage = () => {
    setToggleSlippage(!toggleSlippage);
    if (slippage && isValidCharacters) {
      setSlippage(slippage);
      setSlippageDisplay(slippage);
    } else {
      setSlippage(DEFAULT_SLIPPAGE);
      setSlippageDisplay(DEFAULT_SLIPPAGE);
    }
  };

  const slippageOnChange = (event) => {
    const value = event.target.value;
    setSlippage(value);
    checkInputSlippage(value);
  };

  const checkInputSlippage = (input) => {
    const sanitizeStartingWithZeros = Number(input);
    const isPositiveFloat =  !isNaN(sanitizeStartingWithZeros) && Number(sanitizeStartingWithZeros) > 0;
    if (isPositiveFloat) {
      if (sanitizeStartingWithZeros > 50) {
        setIsValidCharacters(false);
        return false;
      } else if (sanitizeStartingWithZeros > 1) {
        setIsValidCharacters(true);
        setIsFrontrunRisk(true);
        return true;
      } else {
        setIsValidCharacters(true);
        setIsFrontrunRisk(false);
        return true;
      }
    } else {
      setIsValidCharacters(false);
    }
  }

  useImperativeHandle(_ref, () => ({
    getSlippage: () => {
      return slippage;
    }
  }));

  const ModalHeader = () => {
    return (
      <>
        <div style={{ marginLeft: 'auto', paddingRight: '1vw' }}>
          Slippage
        </div>
        <div
          style={{ width: '5vw' }}
          onClick={handleCloseSlippage}
        >
          {slippageDisplay} %
        </div>
        {toggleSlippage &&
          <Popover>
            <Popover.Header>Transaction Settings</Popover.Header>
            <Popover.Body>
              <div>Slippage tolerance (%)</div>
              <input onChange={slippageOnChange} value={slippage} autoFocus/>
              <Button onClick={() => {setSlippage(DEFAULT_SLIPPAGE)}}>Auto</Button>
              {
                !isValidCharacters
                  ? (<Invalid>Invalid input</Invalid>)
                    : isFrontrunRisk
                    ? (<Warning>Frontrun risk</Warning>)
                    : ''
              }
              <div>Transaction deadline</div>
              <input />
              minutes
            </Popover.Body>
          </Popover>
        }
      </>
    )
  }
  
  return (
    <Header>
      <ModalHeader />
    </Header>
  );
});

const Header = styled.div`
  padding: 1vw;
  display: flex;
  flex-direction: row;
`;

export default TableHeader;