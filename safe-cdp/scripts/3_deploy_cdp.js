var json = require("../test/data/SaiProxyCreateAndExecute.json")
var contract = require("truffle-contract")
var SaiProxy = contract(json)

const addresses = require("../test/data/addresses.json")

module.exports = function (deployer, network, accounts) {
  SaiProxy.setProvider(deployer.provider)
  return deployer.then(function () {
    console.log("BP1")
    return SaiProxy.at(addresses["SAI_PROXY"]).then(function (obj) {
      console.log(obj)
    })
  }).then(function (saiProxy) {
    console.log("BP2")
    return saiProxy.lockAndDraw(addresses["TUB"], web3.utils.toWei('1', 'ether'))
  }).then(function (obj) {
    console.log("BP3")
    console.log(obj)
  }).catch(function (err) {
    console.log(err)
  })
}