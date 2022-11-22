import { router, factory, erc20, uniswapV2Pair } from '../abis';

export const Contracts = {
  router: {
    name: 'router',
    address: '0x1116351Bf470717bDd71A9F850ACb14149EB3261',
    abi: router,
  },
  factory: {
    name: 'factory',
    address: '0x056E49B35FD12BAe37Ac5fa5799f4Bc702eD5186',
    abi: factory,
  },
  erc20: {
    name: 'erc20',
    abi: erc20,
  },
  uniswapV2Pair: {
    name: 'uniswapV2Pair',
    abi: uniswapV2Pair,
  },
};

export const DECIMAL_PLACES = 5;
export const DEFAULT_SLIPPAGE = 0.5;
export const DEFAULT_DEADLINE = 30;