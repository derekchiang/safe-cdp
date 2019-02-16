import React from "react";
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
  height:55px;
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
  font-size: 0.72em;
  text-transform: uppercase;
`;

const Icon = props => <BaseIcon size={32} icon={props.icon} />;

export default class SideBar extends React.Component {
  state = { selectedPath: "1" };

  onItemSelection = arg => {
    this.setState({ selectedPath: arg.path });
  };

  render() {
    return (
      <AppContainer>
        <Navigation>
          <SideNav
            defaultSelectedPath="1"
            theme={theme}
            onItemSelection={this.onItemSelection}
          >
            <Nav id="1">
              <IconCnt>
                <Icon icon={dashboard} />
              </IconCnt>
              <Text>Dashboard</Text>
            </Nav>
            <Nav id="2">
              <IconCnt>
                <Icon icon={users} />
              </IconCnt>
              <Text>Users</Text>
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
    );
  }
}
