import Web3 from "web3/dist/web3.min.js";

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

async function connectToMetamask() {
  console.log('connect wallet');
  let accounts;
  window.ethereum.on('accountsChanged', function () {
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
        if (provider.networkVersion !== 0x18) {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: 0x18 }], // chainId must be in hexadecimal numbers
          });
        }
        return accounts[0];
      }
    } catch (error) {
      if (error.code === -32002) console.log('already request');
      if (error.code === 4001)
        if (accounts) console.log('wallet connect failed');
        else console.log('wallet conenct rejected');

      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: 0x18,
                chainName: 'Kardiachain',
                rpcUrls: ['https://rpc.kardiachain.io'],
              },
            ],
          });
          return accounts[0];
        } catch (addError) {
          console.log('có error');
        }
      }
    }
  } else {
    console.log('please install wallet');
  }
}

export {getWeb3, connectToMetamask, getAccounts, checkSum};