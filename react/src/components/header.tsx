import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineFileDownload,
  MdOutlineFileDownloadDone,
  MdOutlineFileUpload,
} from "react-icons/md";
import { getUserID, is_authenticated } from "../utils/auth";
import { getMap } from "../utils/slotmap";

import User from "./user";

interface HeaderProps {
  mainPage?: boolean;
}

const divMarginSyle: React.CSSProperties = {
  marginRight: 20,
};

const downloadExport = () => {
  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(getMap())], {
    type: "application/json",
  });
  element.href = URL.createObjectURL(file);
  element.download = `csgoinvshuffle_export_${getUserID()}.json`;
  document.body.appendChild(element);
  element.click();
};

function Header(props: HeaderProps) {
  return (
    <Navbar className="header" fixed="top" variant="dark">
      <Navbar.Brand href="/">
        <img
          style={{ maxHeight: 48, maxWidth: 48, marginLeft: 20 }}
          src="/img/brand.png"
          alt="CSGOINVSHUFFLE"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Container>
            <Nav.Link href="/howto">How it works</Nav.Link>
          </Container>
        </Nav>

        <Nav>
          {is_authenticated() && (
            <div style={{ marginRight: 50, display: "flex" }}>
              <div style={divMarginSyle}>
                <Button variant="dark">
                  Download <MdOutlineFileDownloadDone />
                </Button>
              </div>
              <div style={divMarginSyle}>
                <Button variant="dark" onClick={() => downloadExport()}>
                  Export <MdOutlineFileDownload />
                </Button>
              </div>
              <div style={divMarginSyle}>
                <Button variant="dark">
                  Import <MdOutlineFileUpload />
                </Button>
              </div>
              <div style={divMarginSyle}>
                <Button variant="dark">
                  <MdKeyboardArrowLeft />
                </Button>
              </div>
              <div style={divMarginSyle}>
                <Button variant="dark">
                  <MdKeyboardArrowRight />{" "}
                </Button>
              </div>
            </div>
          )}
          <div style={divMarginSyle}>
            <User />
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
