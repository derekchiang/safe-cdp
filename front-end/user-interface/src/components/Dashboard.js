import React, { Component, Fragment } from "react";

//components
import SideBar from "./Sidebar";
import CollateralRatio from "./CollateralRatio";
import DebtCard from "./DebtCard";
import CollateralCard from "./CollateralCard";
import IDCard from "./IDCard";
import FeesCard from "./FeesCard";

//css, images
import "../CSS/Dashboard.css";
import LiquidCard from "./LiquidCard";
import EthereumCard from "./EthereumCard";

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
          </div>
        </Fragment>
      </div>
    );
  }
}

export default Dashboard;
