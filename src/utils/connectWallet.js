import Web3 from "web3/dist/web3.min.js";
import { Contracts } from "../constants/address";

let eth;

const getWeb3 = () => {
  if (!eth) {
    if (window.ethereum) {
      const provider = window.ethereum;
      eth = new Web3(provider);
    } else if (window.web3) {
      eth = new Web3(window.web3.currentProvider);
    } else console.log('please install metamask');
    // Noti.showNotiError(<FormattedMessage id="app.WalletExtension.install" />);
  }
  return eth;
};

function checkSum(address) {
  const web3 = getWeb3();
  const checkedAddress = web3.utils.toChecksumAddress(address);
  return checkedAddress;
}

async function getAccounts() {
  const web3 = getWeb3();
  // eslint-disable-next-line new-cap
  const accounts = await new web3.eth.getAccounts();

  return accounts;
}

function loadSmartContracts(contracts) {
  const web3 = getWeb3();
  const rs = {};

  contracts.forEach(contract => {
    rs[contract.name] = new web3.eth.Contract(contract.abi, contract.address);
  });
  return rs;
}

async function getWeb3Data() {
  const _contracts = loadSmartContracts([...Object.values(Contracts)]);
  const addresses = await getAccounts();
  
  return {contracts: _contracts, address: addresses[0]};
}

async function connectToMetamask() {
  let accounts;
  window.ethereum.on('accountsChanged', function() {
    window.location.reload();
  });
  if (window.ethereum) {
    const provider = window.ethereum;
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      if (accounts) {
        if (provider.networkVersion !== '0x18') {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x18' }], // chainId must be in hexadecimal numbers
          });
        }
        return accounts[0];
      }
    } catch (error) {
      if (error.code === -32002)
        console.log('app.WalletExtension.already_request');
      if (error.code === 4001)
        if (accounts)
          console.log('app.WalletExtension.switch_failed');
        else
          console.log('app.WalletExtension.rejected');

      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x18',
                chainName: 'KardiaChain Mainnet',
                rpcUrls: ['https://rpc.kardiachain.io'],
              },
            ],
          });
          return accounts[0];
        } catch (addError) {
          console.log('app.WalletExtension.add_failed');
        }
      }
    }
  } else {
    console.log('app.WalletExtension.install');
  }
  return null;
}

// async function connectToMetamask() {
//   console.log('connect wallet');
//   let accounts;
//   window.ethereum.on('accountsChanged', function () {
//     window.location.reload();
//   });
//   if (window.ethereum) {
//     const provider = window.ethereum;
//     try {
//       // Will open the MetaMask UI
//       // You should disable this button while the request is pending!
//       accounts = await provider.request({
//         method: 'eth_requestAccounts',
//       });
//       if (accounts) {
//         // if (provider.networkVersion !== '0x18') {
//         if (provider.networkVersion !== '0x61') {
//           await provider.request({
//             method: 'wallet_switchEthereumChain',
//             // params: [{ chainId: '0x18' }], // chainId must be in hexadecimal numbers
//             params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
//           });
//         }
//         return accounts[0];
//       }
//     } catch (error) {
//       if (error.code === -32002) console.log('already request');
//       if (error.code === 4001)
//         if (accounts) console.log('wallet connect failed');
//         else console.log('wallet conenct rejected');

//       if (error.code === 4902) {
//         try {
//           await window.ethereum.request({
//             method: 'wallet_addEthereumChain',
//             params: [
//               {
//                 // chainId: '0x18',
//                 // chainName: 'Kardiachain',
//                 // rpcUrls: ['https://rpc.kardiachain.io'],
//                 chainId: '0x61',
//                 chainName: 'Smart Chain - Testnet',
//                 rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
//               },
//             ],
//           });
//           return accounts[0];
//         } catch (addError) {
//           console.log('có error');
//         }
//       }
//     }
//   } else {
//     console.log('please install wallet');
//   }
// }

export {
  getWeb3,
  getWeb3Data,
  connectToMetamask,
  getAccounts,
  checkSum,
  loadSmartContracts,
};
