import React, { Component, Fragment } from "react";
import Maker from '@makerdao/dai';

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

  async componentDidMount() {
    let maker = await Maker.create('browser')
    let proxy = maker.service('proxy').currentProxy()
    console.log("proxy:", proxy);
    let safeCDPFactory = new window.web3.eth.Contract(require("../contracts/SafeCDPFactory.json"));
    this.setState({
      proxy: proxy,
      maker: maker,
      safeCDPFactory: safeCDPFactory,
    })
  }

  createSafeCDP = (targetCollateralization, marginCallThreshold, marginCallDuration, reward) => {
    let proxy = this.state.maker.service('proxy').currentProxy();
    this.safeCDPFactory.createSafeCDP(
      proxy,
      this.props.cdp,
      targetCollateralization,
      marginCallThreshold,
      marginCallDuration,
      reward)
  }
}

export default Dashboard;
