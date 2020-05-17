import React, { useState, useEffect } from "react";
import _ from "lodash";

import Generate from "./components/Generate";
import Saved from "./components/Saved";
import {
  Button,
  Container,
  Icon,
  Image,
  Menu,
  Sidebar,
  Responsive,
  Header
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import { useHistory } from "react-router";
const getDrizzleWeb3 = require("@drizzle-utils/get-web3");
const createDrizzleUtils = require("@drizzle-utils/core");

export default function App() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState();
  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState();
  const [key, setKey] = useState(0);
  const history = useHistory();

  const getWeb3 = async () => {
    // initialize the tooling
    const web3 = await getDrizzleWeb3();
    const drizzleUtils = await createDrizzleUtils({ web3 });
    const accounts = await drizzleUtils.getAccounts();

    setWeb3(web3);
    setAccount(accounts[0]);
  };

  useEffect(() => {
    getWeb3();
    document.title = "OpenLaw Summoner";
  }, []);

  const handlePusher = () => {
    if (visible) setVisible(false);
  };

  const handleToggle = () => setVisible(!visible);

  const renderForm = () => {
    return (
      <Container style={{ margin: "5em" }}>
        <Switch>
          <Route path="/reload" component={null} key="reload" />
          <Route exact path="/" render={() => <Redirect to="/summon" />} />
          <Route
            exact
            path="/summon"
            render={props => (
              <Generate {...props} key={Math.random} account={account} />
            )}
          />
          <Route
            exact
            path="/saved"
            render={props => (
              <Saved {...props} key={Math.random} account={account} />
            )}
          />
        </Switch>
      </Container>
    );
  };

  const leftItems = [
    <Link to="/summon"> OpenLaw Summoner </Link>,
    <Link
      to="/saved"
      onClick={() => {
        setTimeout(() => {
          window.location.reload();
        });
      }}
    >
      {" "}
      Saved Templates{" "}
    </Link>
  ];

  return (
    <div>
      <Responsive {...Responsive.onlyMobile}>
        <NavBarMobile
          leftItems={leftItems}
          onPusherClick={handlePusher}
          onToggle={handleToggle}
          visible={visible}
        >
          {renderForm()}
        </NavBarMobile>
      </Responsive>
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <NavBarDesktop leftItems={leftItems} />
        {renderForm()}
      </Responsive>
    </div>
  );
}

const NavBarMobile = ({
  children,
  leftItems,
  onPusherClick,
  onToggle,
  visible
}) => (
  <Sidebar.Pushable style={{ transform: "none" }}>
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      vertical
      visible={visible}
      style={{ paddingTop: "25px" }}
      width="thin"
    >
      {leftItems.map(item => {
        return <Menu.Item>{item}</Menu.Item>;
      })}
    </Sidebar>
    <Sidebar.Pusher
      dimmed={visible}
      onClick={onPusherClick}
      style={{ minHeight: "100vh" }}
    >
      <Menu fixed="top" inverted>
        <Menu.Item onClick={onToggle}>
          <Icon name="sidebar" />
        </Menu.Item>
        <Menu.Item as="a" href="https://openesq.tech/">
          <Image
            size="mini"
            src="https://i.ibb.co/cXMrJSb/Open-Esq-Clipped.png"
          />
          <Header
            as="h3"
            style={{ paddingLeft: "7px", margin: "0", color: "#e6e6e6" }}
          >
            Open Esquire
          </Header>
        </Menu.Item>
      </Menu>
      {children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

const NavBarDesktop = ({ leftItems }) => (
  <Menu fixed="top" inverted>
    <Menu.Item as="a" href="https://openesq.tech/" target="_">
      <Image size="mini" src="https://i.ibb.co/cXMrJSb/Open-Esq-Clipped.png" />
      <Header
        as="h3"
        style={{ paddingLeft: "7px", margin: "0", color: "#e6e6e6" }}
      >
        Open Esquire
      </Header>
    </Menu.Item>
    {leftItems.map(item => {
      return <Menu.Item>{item}</Menu.Item>;
    })}
  </Menu>
);
