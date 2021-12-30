/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineFileDownload,
  MdOutlineFileDownloadDone,
  MdOutlineFileUpload,
  MdShuffle,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux_hooks";
import {
  deleteMap,
  goBack,
  goForth,
  selectBackwardMaps,
  selectForwardMaps,
  selectMap,
  setMap,
} from "../slices/map";
import { POST } from "../utils/api_requests";
import { getUserID, is_authenticated } from "../utils/auth";

import User from "./user";

interface HeaderProps {
  mainPage?: boolean;
}

const divMarginSyle: React.CSSProperties = {
  marginRight: 20,
};

function downloadFile(name: string, content: string) {
  const element = document.createElement("a");
  const file = new Blob([content], {
    type: "application/json",
  });
  element.href = URL.createObjectURL(file);
  element.download = name;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function UploadButton() {
  const inputFile = useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    // @ts-ignore
    if (inputFile) inputFile.current.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length) {
      const content = await files[0].text();
      localStorage.setItem("map", content);
      window.location.reload();
    }
  };

  return (
    <div style={divMarginSyle}>
      <input
        style={{ display: "none" }}
        accept=".json"
        ref={inputFile}
        onChange={handleFileUpload}
        type="file"
      />
      <Button variant="dark" onClick={onButtonClick}>
        <MdOutlineFileUpload size={25} /> Import JSON
      </Button>
    </div>
  );
}

function Header(props: HeaderProps) {
  const forward_maps = useAppSelector(selectForwardMaps);
  const backward_maps = useAppSelector(selectBackwardMaps);
  const map = useAppSelector(selectMap);
  const dispatch = useAppDispatch();
  const [forward, setForward] = useState(!!forward_maps.length);
  const [backward, setBackward] = useState(!!backward_maps.length);

  useEffect(() => {
    setForward(!!forward_maps.length);
    setBackward(!!backward_maps.length);
  }, [forward_maps, backward_maps]);

  return (
    <Navbar className="header" fixed="top" variant="dark">
      <Navbar.Brand href="/">
        {/*<img
          style={{ maxHeight: 48, maxWidth: 48, marginLeft: 20 }}
          src=""
          alt="CSGOINVSHUFFLE"
        />*/}
        <p style={{ margin: 20 }}>CSGOINVSHUFFLE</p>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/privacy">Privacy Policy</Nav.Link>

          <Nav.Link href="/howto">How To</Nav.Link>
        </Nav>

        <Nav>
          {is_authenticated() && props.mainPage && (
            <div style={{ marginRight: 50, display: "flex" }}>
              <div style={divMarginSyle}>
                <Button
                  variant="dark"
                  onClick={() => {
                    POST("/random", JSON.stringify(map)).then(
                      async (resp: Response) => {
                        if (resp.status === 200) {
                          const json = await resp.json();

                          dispatch(setMap(json));
                        }
                      }
                    );
                  }}
                >
                  <MdShuffle size={25} /> Shuffle
                </Button>
              </div>
              <div style={divMarginSyle}>
                <Button
                  variant="dark"
                  onClick={() => {
                    POST("/generate", JSON.stringify(map)).then(
                      async (resp: Response) => {
                        if (resp.status === 200) {
                          const text = await resp.text();
                          downloadFile("csgo_saved_item_shuffles.txt", text);
                        }
                      }
                    );
                  }}
                >
                  <MdOutlineFileDownloadDone size={25} /> Create Config
                </Button>
              </div>
              <div style={divMarginSyle}>
                <Button
                  variant="dark"
                  onClick={() =>
                    downloadFile(
                      `csgoinvshuffle_export_${getUserID()}.json`,
                      JSON.stringify(map)
                    )
                  }
                >
                  <MdOutlineFileDownload size={25} /> Save JSON
                </Button>
              </div>
              <UploadButton />
              <div style={divMarginSyle}>
                <Button
                  onClick={() => {
                    dispatch(goBack());
                  }}
                  variant="dark"
                  disabled={!backward}
                >
                  <MdKeyboardArrowLeft size={25} />
                </Button>
              </div>
              <div style={divMarginSyle}>
                <Button
                  onClick={() => {
                    dispatch(goForth());
                  }}
                  variant="dark"
                  disabled={!forward}
                >
                  <MdKeyboardArrowRight size={25} />{" "}
                </Button>
              </div>
              <div style={divMarginSyle}>
                <Button
                  variant="dark"
                  onClick={() => {
                    dispatch(deleteMap());
                  }}
                >
                  <FaTrash
                    style={{
                      height: 25,
                      width: 30,
                      color: "rgba(255, 49,57,0.7)",
                    }}
                  />
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
