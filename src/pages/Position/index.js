import React, { useEffect, useRef, useState } from 'react'
import BoxWrapper from '../../components/BoxWrapper';
import TableHeader from './components/TableHeader';
import { Row, Text } from '../../components/styles';
import { Button } from 'react-bootstrap';
import { getAccounts, getWeb3, loadSmartContracts } from '../../utils/connectWallet';
import { Contracts, DECIMAL_PLACES } from '../../constants/address';
import ModalRemove from './components/ModalRemove';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Position () {
  const MINIMUM_LIQUIDITY = 1000;
  const web3 = useRef();
  const contracts = useRef();
  const address = useRef();
  const [positions, setPositions] = useState([]);
  const [positionState, setPositionState] = useState();
  const run = useRef(true);
  const [isModalRemove, setIsModalRemove] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isUserHasLiquidity = useRef(true);
  
  useEffect(() => {
    getWeb3Data();
    const _web3 = getWeb3();
    web3.current = _web3;
    getPairs();
  }, []);

  const getWeb3Data = async () => {
    const _contracts = loadSmartContracts([...Object.values(Contracts)]);
    contracts.current = _contracts;

    const addresses = await getAccounts();
    address.current = addresses[0];
  };

  const getPairs = async () => {
    console.log('contracts: ', contracts);
    if (run.current) {
      run.current = false;
      const _contracts = contracts.current;
      const factoryContract = _contracts.factory;
      console.log('_contracts: ', _contracts);
      
      const _allPairs = [];
      let _positions;
      const allPairsLength = await factoryContract.methods.allPairsLength().call();
      for (let i = 0; i < allPairsLength; i++) {
        const pair = await factoryContract.methods.allPairs(i).call();
        _allPairs.push(pair);
        
        _positions = await getPositions(pair);
      }
      setIsLoading(false);
      if (_positions.length) {
        isUserHasLiquidity.current = true;
      } else {
        isUserHasLiquidity.current = false;
      }
    }
  };

  const getPositions = async (pair) => {
    const _web3 = web3.current;
    const BN = _web3.utils.BN;
    const _positions = positions;

    const pairContract = new _web3.eth.Contract(Contracts.uniswapV2Pair.abi, pair);
    const position = {
      token0Address: '',
      token1Address: '',
      token0Name: '',
      token1Name: '',
      token0Decimal: '',
      token1Decimal: '',
      token0AmountWithDecimal: '',
      token1AmountWithDecimal: '',
      token0AmountWithoutDecimal: '',
      token1AmountWithoutDecimal: '',
      token0AmountRounded: '',
      token1AmountRounded: '',
      poolAmount: '',
      poolShare: '',
      poolShareDisplay: '',
      poolAddress: pair,
    };
    position.poolAmount = await pairContract.methods.balanceOf(address.current).call();
    const poolTotalSupply = await pairContract.methods.totalSupply().call();
    const percentageInPool = position.poolAmount / (poolTotalSupply);
    position.poolShare = Math.round(percentageInPool * 10000) / 100;
    position.poolShareDisplay = poolTotalSupply - MINIMUM_LIQUIDITY === parseInt(position.poolAmount) ? 100 : position.poolShare;
    if (position.poolAmount > 0) {
      position.token0Address = await pairContract.methods.token0().call();
      position.token1Address = await pairContract.methods.token1().call();

      const token0Contract = new _web3.eth.Contract(Contracts.erc20.abi, position.token0Address);
      const token1Contract = new _web3.eth.Contract(Contracts.erc20.abi, position.token1Address);

      position.token0Name = await token0Contract.methods.name().call();
      position.token1Name = await token1Contract.methods.name().call();
      
      const pairBalanceToken0 = await token0Contract.methods.balanceOf(pair).call();
      const pairBalanceToken1 = await token1Contract.methods.balanceOf(pair).call();
      const token0Decimal = await token0Contract.methods.decimals().call();
      const token1Decimal = await token1Contract.methods.decimals().call();

      position.token0Decimal = token0Decimal;
      position.token1Decimal = token1Decimal;
      // position.token0AmountWithDecimal = pairBalanceToken0 * percentageInPool;
      // position.token1AmountWithDecimal = pairBalanceToken1 * percentageInPool;
      // position.token0AmountWithoutDecimal = position.token0AmountWithDecimal / (10 ** token0Decimal);
      // position.token1AmountWithoutDecimal = position.token1AmountWithDecimal / (10 ** token1Decimal);
      position.token0AmountWithDecimal = new BN(pairBalanceToken0).mul(new BN(percentageInPool * 10000)).div(new BN(10000)).toString();
      position.token1AmountWithDecimal = new BN(pairBalanceToken1).mul(new BN(percentageInPool * 10000)).div(new BN(10000)).toString();
      position.token0AmountWithoutDecimal = position.token0AmountWithDecimal / (10 ** token0Decimal);
      position.token1AmountWithoutDecimal = position.token1AmountWithDecimal / (10 ** token1Decimal);
      // position.token0AmountWithoutDecimal = new BN(position.token0AmountWithDecimal).div(new BN(10 ** token0Decimal)).toString();
      // position.token1AmountWithoutDecimal = new BN(position.token1AmountWithDecimal).div(new BN(10 ** token1Decimal)).toString();

      // console.log(
      //   'position.token0AmountWithDecimal: ',
      //   position.token0AmountWithDecimal,
      //   ' position.token1AmountWithDecimal: ',
      //   position.token1AmountWithDecimal,
      //   'position.token0AmountWithoutDecimal: ',
      //   position.token0AmountWithoutDecimal,
      //   ' position.token1AmountWithoutDecimal: ',
      //   position.token1AmountWithoutDecimal,
      // );
      console.log(
        'pairBalanceToken0: ',
        pairBalanceToken0,
        ' new BN(pairBalanceToken0): ',
        new BN(pairBalanceToken0).toString(),
        ' percentageInPool: ',
        percentageInPool,
        ' percentageInPool * 10000: ',
        percentageInPool * 10000,
        ' new BN(percentageInPool * 10000): ',
        new BN(percentageInPool * 10000).toString(),
        ' new BN(pairBalanceToken0).mul(new BN(percentageInPool * 10000)): ',
        new BN(pairBalanceToken0).mul(new BN(percentageInPool * 10000)).toString(),
        ' new BN(10000): ',
        new BN(10000).toString(),
        ' new BN(pairBalanceToken0).mul(new BN(percentageInPool * 10000)).div(new BN(10000)): ',
        new BN(pairBalanceToken0).mul(new BN(percentageInPool * 10000)).div(new BN(10000)).toString(),
        ' position.token0AmountWithDecimal: ',
        position.token0AmountWithDecimal,
        ' new BN(position.token0AmountWithDecimal): ',
        new BN(position.token0AmountWithDecimal).toString(),
        ' 10 ** token0Decimal: ',
        10 ** token0Decimal,
        ' new BN(10 ** token0Decimal): ',
        new BN((10 ** token0Decimal).toString()).toString(),
        ' new BN(position.token0AmountWithDecimal).div(new BN(10 ** token0Decimal)): ',
        new BN(position.token0AmountWithDecimal).div(new BN((10 ** token0Decimal).toString())).toString(),
        ' position.token0AmountWithoutDecimal: ',
        position.token0AmountWithoutDecimal,
      );

      if (token0Decimal > DECIMAL_PLACES) {
        // position.token0AmountRounded = Math.round(position.token0AmountWithoutDecimal * (10 ** DECIMAL_PLACES)) / (10 ** DECIMAL_PLACES);
        position.token0AmountRounded = parseInt(position.token0AmountWithoutDecimal * (10 ** DECIMAL_PLACES)) / (10 ** DECIMAL_PLACES);
      } else {
        // position.token0AmountRounded = Math.round(position.token0AmountWithoutDecimal * (10 ** token0Decimal)) / (10 ** token0Decimal);
        position.token0AmountRounded = parseInt(position.token0AmountWithoutDecimal * (10 ** token0Decimal)) / (10 ** token0Decimal);
      }

      if (token1Decimal > DECIMAL_PLACES) {
        // position.token1AmountRounded = Math.round(position.token1AmountWithoutDecimal * (10 ** DECIMAL_PLACES)) / (10 ** DECIMAL_PLACES);
        position.token1AmountRounded = parseInt(position.token1AmountWithoutDecimal * (10 ** DECIMAL_PLACES)) / (10 ** DECIMAL_PLACES);
      } else {
        // position.token1AmountRounded = Math.round(position.token1AmountWithoutDecimal * (10 ** token1Decimal)) / (10 ** token1Decimal);
        position.token1AmountRounded = parseInt(position.token1AmountWithoutDecimal * (10 ** token1Decimal)) / (10 ** token1Decimal);
      }

      // const _positions = positions;
      _positions.push(position);
      setPositions(_positions);
    }

    return _positions;
  };

  const showModalRemove = (position) => {
    setIsModalRemove(!isModalRemove);
    setPositionState(position);
  }

  return (
    <BoxWrapper style={{ width: '55vw' }}>
      <ModalRemove
        show={isModalRemove}
        handleClose={() => setIsModalRemove(false)}
        positionState={positionState}
      />
      {/* <TableHeader action="position" /> */}
      <TableHeader />
      {
        isLoading
          ? <LoadingSpinner />
          : isUserHasLiquidity.current
            ? ''
            : <div>You have not provided liquidity</div>
      }
      {
        positions
          ? positions.map((position, index) => {
            return (
              <Row key={`row-${index}`}>
                <Text>
                  <h5 style={{color: '#c3c3c3'}}>{position.token0Name} - {position.token1Name}</h5>
                  <Text>
                    {/* {position.token0AmountWithoutDecimal} {position.token0Name} | {' '}
                    {position.token1AmountWithoutDecimal} {position.token1Name} | {' '} */}
                    {position.token0AmountRounded} {position.token0Name} | {' '}
                    {position.token1AmountRounded} {position.token1Name} | {' '}
                    {/* Pool share: {position.poolShare}% */}
                    Pool share: {position.poolShareDisplay}%
                  </Text>
                </Text>
                <Button
                  style={{ height: '3vw' }}
                  onClick={() => showModalRemove(position)}
                  variant='danger'
                >
                  Remove
                </Button>
              </Row>
            );
          })
          : ''
      }
    </BoxWrapper>
  );
}
