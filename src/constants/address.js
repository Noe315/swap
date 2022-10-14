import { router, factory, erc20 } from '../abis';

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
};