/* eslint-disable react/jsx-no-comment-textnodes */
import {
  Anchor,
  AppShell,
  Box,
  Button,
  Center,
  Footer,
  Group,
  Header,
  Paper,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import React, { useContext, useEffect, useRef, useState } from "react";

import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowsShuffle,
  IconDna2,
  IconDownload,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { selectAuthenticated, selectSteamID } from "../redux/auth";
import {
  deleteBackward,
  deleteForward,
  deleteMap,
  goBack,
  goForth,
  selectBackwardMaps,
  selectForwardMaps,
  selectMap,
  setMap,
} from "../redux/map";
import { useAppDispatch, useAppSelector } from "../redux_hooks";
import { POST } from "../utils/api_requests";
import User from "./User";

interface ShellProps {
  mainPage?: boolean;
  children: React.ReactNode;
}

export const ScrollBarContext =
  React.createContext<React.MutableRefObject<HTMLDivElement | null> | null>(
    null
  );

export const useScrollbarRef = () => useContext(ScrollBarContext);

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
  const dispatch = useAppDispatch();
  const inputFile = useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    if (inputFile.current) inputFile.current.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files?.length) {
      const content = await files[0].text();
      dispatch(setMap(JSON.parse(content)));
    }
  };

  return (
    <>
      <input
        style={{ display: "none" }}
        accept=".json"
        ref={inputFile}
        onChange={handleFileUpload}
        type="file"
      />
      <Button variant="light" onClick={onButtonClick}>
        <IconUpload size={25} /> Import JSON
      </Button>
    </>
  );
}

function Shell(props: ShellProps) {
  const forward_maps = useAppSelector(selectForwardMaps);
  const backward_maps = useAppSelector(selectBackwardMaps);
  const map = useAppSelector(selectMap);
  const dispatch = useAppDispatch();
  const [forward, setForward] = useState(false);
  const [backward, setBackward] = useState(false);
  const steamID = useAppSelector(selectSteamID);
  const authenticated = useAppSelector(selectAuthenticated);
  const navigate = useNavigate();

  const scrollbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setForward(!!forward_maps.length);
    if (backward_maps.length === 1 && !backward_maps[0].length) {
      setBackward(false);
    } else {
      setBackward(!!backward_maps.length);
    }
  }, [forward_maps, backward_maps]);
  const padding = 16;
  return (
    <AppShell
      header={
        <Header height={60}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
            p="xs"
          >
            <Title
              onClick={() => navigate("/")}
              sx={{ ":hover": { cursor: "pointer" } }}
              order={3}
            >
              CSGOINVSHUFFLE
            </Title>
            <Group>
              <Link to="/privacy">Privacy Policy</Link>

              <Link to="/howto">How To</Link>
            </Group>
            {authenticated && props.mainPage && (
              <Group>
                <Group spacing="xs">
                  <Button
                    variant="light"
                    onClick={() => {
                      POST("/random", JSON.stringify({ map: map })).then(
                        async (resp: Response) => {
                          if (resp.status === 200) {
                            const json = await resp.json();

                            dispatch(setMap(json));
                          }
                        }
                      );
                    }}
                  >
                    <IconArrowsShuffle size={25} /> Shuffle
                  </Button>

                  <Button
                    variant="light"
                    onClick={() => {
                      POST("/generate", JSON.stringify({ map: map })).then(
                        async (resp: Response) => {
                          if (resp.status === 200) {
                            const text = await resp.text();
                            downloadFile("csgo_saved_item_shuffles.txt", text);
                          }
                        }
                      );
                    }}
                  >
                    <IconDna2 size={25} /> Create Config
                  </Button>
                </Group>
                <Group spacing="xs">
                  <Button
                    variant="light"
                    onClick={() =>
                      downloadFile(
                        `csgoinvshuffle_export_${steamID}.json`,
                        JSON.stringify(map)
                      )
                    }
                  >
                    <IconDownload size={25} /> Save JSON
                  </Button>

                  <UploadButton />
                </Group>
                <Group spacing="xs">
                  <Button
                    variant="light"
                    onClick={() => {
                      dispatch(goBack());
                    }}
                    disabled={!backward}
                  >
                    <IconArrowLeft size={25} />
                  </Button>

                  <Button
                    variant="light"
                    onClick={() => {
                      dispatch(goForth());
                    }}
                    disabled={!forward}
                  >
                    <IconArrowRight size={25} />{" "}
                  </Button>
                </Group>
                <Button
                  variant="light"
                  onClick={() => {
                    dispatch(deleteMap());
                    dispatch(deleteForward());
                    dispatch(deleteBackward());
                  }}
                >
                  <IconTrash
                    style={{
                      height: 25,
                      width: 30,
                      color: "rgba(255, 49,57,0.7)",
                    }}
                  />
                </Button>
              </Group>
            )}

            <User />
          </Box>
        </Header>
      }
      footer={
        <Footer height={25}>
          <Center>
            <Text>
              © {new Date().getFullYear()} Created by{" "}
              <Anchor href="https://steamcommunity.com/profiles/76561198232352624">
                kreyoo
              </Anchor>
              .
              <Anchor href="https://github.com/jvllmr/csgo-inv-shuffle-web/blob/master/LICENSE">
                {" "}
                AGPLv3
              </Anchor>
              . Powered by Steam. Valve, Steam and Counter-Strike are registered
              trademarks of Valve Corporation. csgoinvshuffle.kreyoo.dev is not
              affiliated with Valve in any way.
            </Text>
          </Center>
        </Footer>
      }
      styles={{
        main: {
          paddingTop: "var(--mantine-header-height, 0px)", // remove padding from mantine main component
          paddingBottom: "var(--mantine-footer-height, 0px)",
          paddingLeft: "var(--mantine-navbar-width, 0px)",
          paddingRight: "var(--mantine-aside-width, 0px)",
        },
      }}
    >
      <ScrollArea
        viewportRef={scrollbarRef}
        sx={{
          height:
            "calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))", // viewport height - height of header - height of footer
        }}
        styles={{
          root: {
            height: "100%",
          },
        }}
      >
        <ScrollBarContext.Provider value={scrollbarRef}>
          <Paper // our new canvas body
            p={padding} // re-apply mantine main component padding
            sx={{
              width: `calc(100vw - ${
                2 * padding
              }px - var(--mantine-aside-width, 0px) - var(--mantine-navbar-width, 0px))`, // viewport width - 2*padding - aside width - navbar width
              minHeight: `calc(100vh - ${
                2 * padding
              }px - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))`, // viewport height - 2*padding - header height - footer height
            }}
            m={0}
            radius={0}
          >
            <Box sx={{ height: "100%", width: "100%" }} m={padding}>
              {props.children}
            </Box>
          </Paper>
        </ScrollBarContext.Provider>
      </ScrollArea>
    </AppShell>
  );
}

export default Shell;
