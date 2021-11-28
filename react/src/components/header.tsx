import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineFileDownload,
  MdOutlineFileDownloadDone,
  MdOutlineFileUpload,
  MdShuffle,
} from "react-icons/md";
import { getUserID, is_authenticated } from "../utils/auth";
import {
  getMap,
  haveBackwardMaps,
  haveForwardMaps,
  moveBackward,
  moveForward,
  setMap,
  slotMapUpdateEvent,
} from "../utils/slotmap";

import User from "./user";

interface HeaderProps {
  mainPage?: boolean;
}

const divMarginSyle: React.CSSProperties = {
  marginRight: 20,
};

function downloadExport() {
  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(getMap())], {
    type: "application/json",
  });
  element.href = URL.createObjectURL(file);
  element.download = `csgoinvshuffle_export_${getUserID()}.json`;
  document.body.appendChild(element);
  element.click();
};

function UploadButton() {
  const inputFile = useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    // @ts-ignore
    if (inputFile) inputFile.current.click();
    
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length) {
      const content = await files[0].text()
      localStorage.setItem("map", content);
      window.location.reload()
    }
  };


  return <div style={divMarginSyle}>
                <input
        style={{ display: "none" }}
        accept=".json"
        ref={inputFile}
        onChange={handleFileUpload}
        type="file"
      />
                <Button variant="dark" onClick={onButtonClick}>
                <MdOutlineFileUpload size={25}/> Import JSON 
                </Button>
              </div>
}

function Header(props: HeaderProps) {
  const [forward, setForward] = useState(haveForwardMaps());
  const [backward, setBackward] = useState(haveBackwardMaps());

  useEffect(() => {
    document.addEventListener("ForwardMapsEvent", () => {
      setForward(haveForwardMaps());
    });
    document.addEventListener("BackwardMapsEvent", () => {
      setBackward(haveBackwardMaps());
    });
  });

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
            <Nav.Link href="/privacy">Privacy</Nav.Link>
          </Container>
        </Nav>

        <Nav>
          {is_authenticated() && (
            <div style={{ marginRight: 50, display: "flex"}}>
              <div style={divMarginSyle}>
                <Button variant="dark">
                <MdShuffle size={25}/  > Shuffle
                </Button>
                </div>
              <div style={divMarginSyle}>
                <Button variant="dark">
                <MdOutlineFileDownloadDone size={25}/> Create Config 
                </Button>
              </div>
              <div style={divMarginSyle}>
                <Button variant="dark" onClick={() => downloadExport()}>
                <MdOutlineFileDownload size={25}/> Save JSON 
                </Button>
              </div>
              <UploadButton />
              <div style={divMarginSyle}>
                <Button
                  onClick={() => {
                    moveBackward();
                    setBackward(haveBackwardMaps());
                  }}
                  variant="dark"
                  disabled={!backward}
                >
                  <MdKeyboardArrowLeft size={25}/>
                </Button>
              </div>
              <div style={divMarginSyle}>
                <Button
                  onClick={() => {
                    moveForward();
                    setForward(haveForwardMaps());
                  }}
                  variant="dark"
                  disabled={!forward}
                >
                  <MdKeyboardArrowRight size={25}/>{" "}
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
