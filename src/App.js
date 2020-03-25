import React, { useState, useEffect } from "react";
import _ from "lodash";
import Generate from "./components/Generate";
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

export default function App() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState();

  useEffect(() => {
    document.title = "OpenLaw Summoner";
  }, []);

  const handlePusher = () => {
    if (visible) setVisible(false);
  };

  const handleToggle = () => setVisible(!visible);

  const renderForm = () => {
    if (index == 0) return <Generate />;
  };

  const leftItems = [
    {
      as: "a",
      content: "OpenLaw Summoner",
      onClick: () => {
        setIndex(0);
        setVisible(false);
      },
      key: "Generate"
    }
  ];
  return (
    <div>
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <NavBarMobile
            leftItems={leftItems}
            onPusherClick={handlePusher}
            onToggle={handleToggle}
            visible={visible}
          >
            <NavBarChildren>{renderForm()}</NavBarChildren>
          </NavBarMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavBarDesktop leftItems={leftItems} />
          <NavBarChildren>{renderForm()}</NavBarChildren>
        </Responsive>
      </div>
    </div>
  );
}

const NavBarMobile = ({
  children,
  leftItems,
  onPusherClick,
  onToggle,
  rightItems = [],
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
      {_.map(leftItems, item => (
        <Menu.Item {...item} />
      ))}
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
        <Menu.Menu position="right">
          {_.map(rightItems, item => (
            <Menu.Item {...item} />
          ))}
        </Menu.Menu>
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
    {_.map(leftItems, item => (
      <Menu.Item {...item} />
    ))}
  </Menu>
);

const NavBarChildren = ({ children }) => (
  <Container style={{ marginTop: "5em" }}>{children}</Container>
);

