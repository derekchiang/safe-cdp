const Web3 = require('web3');
const SafeCDPFactory = artifacts.require("SafeCDPFactory")
const Sponsor = artifacts.require("Sponsor")
const contract = require("truffle-contract")

const addresses = require("../test/data/addresses.json")
const SaiProxyABI = require("../test/data/SaiProxyCreateAndExecute.abi")
const SaiProxy = contract({
  abi: SaiProxyABI,
  address: addresses["SAI_PROXY"],
})

var PrivateKeyProvider = require("truffle-privatekey-provider")
// TODO: move the key somewhere else
var privateKey = "474beb999fed1b3af2ea048f963833c686a0fba05f5724cb6417cf3b8ee9697e"
var provider = new PrivateKeyProvider(privateKey, "http://localhost:2000")
SaiProxy.setProvider(provider)

const web3 = new Web3(provider)

module.exports = function (deployer) {
  deployer.then(function () {
    // Deploy SponsorPool
    return Sponsor.new()
  }).then(function (sponsor) {
    // Deploy SafeCDPFactory
    return SafeCDPFactory.new(addresses["TUB"], addresses["SAI"], sponsor.address)
  }).then(function () {
    // Create a normal CDP
    return SaiProxy.lockAndDraw(addresses["TUB"], web3.utils.toWei('1', 'ether'))
  })
  // Deploy a safe CDP
}