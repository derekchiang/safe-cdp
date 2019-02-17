import React from "react";
import { Route, Link } from "react-router-dom";
import { SideNav, Nav as BaseNav } from "react-sidenav";
import styled from "styled-components";
import {
  AppContainer as BaseAppContainer,
  ExampleNavigation as BaseNavigation,
  ExampleBody as Body
} from "./containers";
import { Icon as BaseIcon } from "react-icons-kit";
import { dashboard } from "react-icons-kit/fa/dashboard";
import { users } from "react-icons-kit/fa/users";
import { shoppingCart } from "react-icons-kit/fa/shoppingCart";
import { cubes } from "react-icons-kit/fa/cubes";
import { circleO } from "react-icons-kit/fa/circleO";
import logo from "../assets/imgs/SafeCDPlogo.svg";
import Dashboard from "./Dashboard";
import Sponsor from "./Sponsor/Sponsor";

const AppContainer = styled(BaseAppContainer)`
  height: calc(100vh - 40px);
`;

const Navigation = styled(BaseNavigation)`
  background: white;
  color: #565656;
  font-size: 1.1em;
  letter-spacing: 2px;
  width: 250px;
  line-height: 22px;
`;

const IconCnt = styled.div`
  color: #b8b2c1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55px;
`;

const Nav = styled(BaseNav)`
  flex-direction: column;
`;

const theme = {
  selectionColor: "#FFF",
  hoverBgColor: "#DEDEDE",
  selectionBgColor: "#565656"
};

const Text = styled.div`
  font-size: 0.7em;
  /* text-transform: uppercase; */
  font-family: "Roboto";
`;

const Icon = props => <BaseIcon size={32} icon={props.icon} />;

export default class SideBar extends React.Component {
  state = { selectedPath: "1" };

  onItemSelection = arg => {
    this.setState({ selectedPath: arg.path });
  };

  render() {
    return (
      <div>
      <AppContainer>
        <Navigation>
          <SideNav
            defaultSelectedPath="1"
            theme={theme}
            onItemSelection={this.onItemSelection}
          >
            <IconCnt
              style={{
                height: 100,
                borderBottom: "1.5px solid #EDF2F9",
                width: "85%",
                margin: "0 auto"
              }}
            >
              <img src={logo} alt="SafeCDP logo" width="200" />
            </IconCnt>
              <Nav id="1">
           <Link to='/dashboard'>
                <IconCnt>
                  <Icon icon={dashboard} />
                </IconCnt>
           </Link>
                <Text>Dashboard</Text>
              </Nav>
              <Nav id="2">
           <Link to='/sponsor'>
                <IconCnt>
                  <Icon icon={users} />
                </IconCnt>
            </Link>
                <Text>Sponsor</Text>
              </Nav>
            <Nav id="3">
              <IconCnt>
                <Icon icon={shoppingCart} />
              </IconCnt>
              <Text>Deliveries</Text>
            </Nav>
            <Nav id="4">
              <IconCnt>
                <Icon icon={circleO} />
              </IconCnt>
              <Text>Orders</Text>
            </Nav>
            <Nav id="5">
              <IconCnt>
                <Icon icon={cubes} />
              </IconCnt>
              <Text>Transactions</Text>
            </Nav>
          </SideNav>
        </Navigation>
      </AppContainer>
      </div>
    );
  }
}
