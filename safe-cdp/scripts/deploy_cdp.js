const Web3 = require('web3');
const SafeCDPFactory = artifacts.require("SafeCDPFactory")
const Sponsor = artifacts.require("Sponsor")
const contract = require("truffle-contract")

console.log("BP0")

const web3 = new Web3()
const addresses = require("../test/data/addresses.json")
const SaiProxyABI = require("../test/data/SaiProxyCreateAndExecute.json")
console.log(SaiProxyABI)
const saiProxy = new web3.eth.Contract(SaiProxyABI, addresses["SAI_PROXY"], {
  "from": accounts[0],
});
saiProxy.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:2000"))

module.exports = function (deployer) {
  deployer.then(function () {
    // Deploy SponsorPool
    return Sponsor.new()
  }).then(function (sponsor) {
    // Deploy SafeCDPFactory
    return SafeCDPFactory.new(addresses["TUB"], addresses["SAI"], sponsor.address)
  }).then(function () {
    // Create a normal CDP
    console.log("BP1")
    console.log(addresses["SAI_PROXY"])
    return saiProxy.methods.lockAndDraw(addresses["TUB"], web3.utils.toWei('1', 'ether')).send({
      "from": accounts[0],
    })
  }).then(function (obj) {
    console.log(obj)
  }).catch(function (err) {
    console.log(err)
  })
  // Deploy a safe CDP
}
