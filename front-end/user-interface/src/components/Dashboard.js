import React, { Component, Fragment } from "react";
import Maker from '@makerdao/dai';
import * as web3Utils from "web3-utils";

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


//css, images
import "../CSS/Dashboard.css";

const NETWORK = "kovan"

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

    console.log(window.web3.eth.accounts[0])
    let safeCDPAddr = await safeCDPFactory.methods.createSafeCDP(
      proxy,
      web3Utils.fromAscii("3152"),
      targetCollateralization,
      marginCallThreshold,
      marginCallDuration,
      reward).send({
        "from": account,
      })
    console.log("safeCDPAddr:", safeCDPAddr)
  }
}

export default Dashboard;
