import { ethers } from 'ethers';
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
export const KAI_MAINNET_CHAIN_ID = 24;
// export const KAI_MAINNET_CHAIN_ID = '0x18';
export const INIT_CODE_HASH = '0x5a23c534feedbf30bd19d7b9288954a647935ffa4d54127f71c14ef72e5e1d56';

const network = {
  name: 'KardiaChain',
  chainId: KAI_MAINNET_CHAIN_ID,
  _defaultProvider: (providers) => new providers.JsonRpcProvider('https://rpc.kardiachain.io')
}
export const PROVIDER = ethers.getDefaultProvider(network);