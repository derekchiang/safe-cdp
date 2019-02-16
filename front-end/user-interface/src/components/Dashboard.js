import React, { Component, Fragment } from "react";


//components
import SideBar from "./Sidebar";
import CollateralRatio from "./CollateralRatio";

//css, images
import "../CSS/Dashboard.css";


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="dashboard">
        <Fragment>
          <SideBar className="clientNavSidebar"/>
          <div className="dashboardContainer">
          <CollateralRatio />
          </div>
        </Fragment>
      </div>
    );
  }
}

export default Dashboard;
