import React, { Component, Fragment } from "react";
import Maker from '@makerdao/dai';
import * as web3Utils from "web3-utils";
import { utils as ethersUtils } from 'ethers';

//components
import SideBar from "./Sidebar";
import CollateralRatio from "./CollateralRatio";
import DebtCard from "./DebtCard";
import CollateralCard from "./CollateralCard";
import IDCard from "./IDCard";
import FeesCard from "./FeesCard";
import LiquidCard from "./LiquidCard";
import EthereumCard from "./EthereumCard";
import FAQ from "./FAQPanel";
import SecureModal from "./SecureModal";
import PaybackModal from "./PaybackModal";


//css, images
import "../CSS/Dashboard.css";
import GiveupModal from "./GiveupModal";

const NETWORK = "kovan"

function numberToBytes32(num) {
  const bn = ethersUtils.bigNumberify(num);
  return ethersUtils.hexlify(ethersUtils.padZeros(bn, 32));
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="dashboard">
        <Fragment>
          <SideBar className="clientNavSidebar" />
          <div className="dashboardContainer">
            <SecureModal onSubmit={this.createSafeCDP} />
            <PaybackModal />
            <GiveupModal />
            <CollateralRatio className="cardDivTop" />
            <div className="cardTopLeft">
              <DebtCard />
            </div>
            <div className="cardTopRight">
              <CollateralCard />
            </div>
            <div className="cardBottom">
              <IDCard />
            </div>
            <div className="cardBottom2">
              <FeesCard />
            </div>
            <div className="cardBottom3">
              <LiquidCard />
            </div>
            <div className="cardBottom4">
              <EthereumCard />
            </div>
            <span className="labelBottom">Borrow FAQs</span>
            <div className="expansionBottom">
              <FAQ />
            </div>
            <span className="rights-reserved">@ 2019 SafeCDP. All rights reserved.</span>
          </div>
        </Fragment>
      </div>
    );
  }

  createSafeCDP = async (targetCollateralization, marginCallThreshold, marginCallDuration, reward) => {
    let maker = await Maker.create('browser')
    await maker.authenticate()
    let proxy = await maker.service('proxy').currentProxy()
    console.log("proxy:", proxy);

    let contractJSON = require("../contracts/SafeCDPFactory.json")
    const networkId = await window.web3.eth.net.getId()
    const deployedAddress = contractJSON.networks[networkId].address
    const safeCDPFactory = new window.web3.eth.Contract(contractJSON.abi, deployedAddress)

    let account = (await window.web3.eth.getAccounts())[0]

    safeCDPFactory.methods.createSafeCDP(
      proxy,
      numberToBytes32(parseInt(window.cdp)),
      targetCollateralization,
      marginCallThreshold,
      marginCallDuration,
      reward).send({
        "from": account,
      }).on("receipt", async (receipt) => {
        const saiProxy = maker.service('smartContract').getContractByName('SAI_PROXY');
        console.log("receipt:", receipt)
        let safeCDPAddr = receipt.events.SafeCDPCreated.returnValues.cdp
        console.log("safeCDPAddr:", safeCDPAddr)
        const cdp = await maker.getCdp(parseInt(window.cdp))
        console.log("cdp:", parseInt(window.cdp))
        await saiProxy.give("0xa71937147b55deb8a530c7229c442fd3f31b7db2", web3Utils.numberToHex(window.cdp), safeCDPAddr)
      })
  }
}

export default Dashboard;
