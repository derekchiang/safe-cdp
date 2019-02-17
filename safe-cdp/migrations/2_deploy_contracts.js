const SafeCDPFactory = artifacts.require("SafeCDPFactory")
const Sponsor = artifacts.require("Sponsor")
const addresses = require("../test/data/addresses.json")

module.exports = function (deployer, network) {
  let tub, dai;

  if (network === "development") {
    tub = addresses["TUB"]
    dai = addresses["SAI"]
  } else if (network === "kovan") {
    tub = "0xa71937147b55deb8a530c7229c442fd3f31b7db2"
    dai = "0xC4375B7De8af5a38a93548eb8453a498222C4fF2"
  } else {
    return
  }
  // deployment steps
  deployer.deploy(Sponsor, dai).then(function () {
    return deployer.deploy(SafeCDPFactory, tub, dai, Sponsor.address)
  })
}