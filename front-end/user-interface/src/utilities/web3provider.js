const Web3 = require('web3')

let web3

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider)
} else {

  window.addEventListener('message', ({ data }) => {
    console.log('hey')
  });
  // Request provider
  window.postMessage({ type: 'ETHEREUM_PROVIDER_REQUEST' }, '*');
  //web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

module.exports = web3
