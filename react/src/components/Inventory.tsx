import { useCallback, useEffect, useState } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";

import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  Loader,
  Progress,
  ScrollArea,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { IconCheck, IconRefresh, IconSearch } from "@tabler/icons-react";
import { selectAuthenticated, selectSteamID } from "../redux/auth";
import { selectInv, selectInvDBReady, setInv } from "../redux/inv";
import { useAppDispatch, useAppSelector } from "../redux_hooks";
import { GET } from "../utils/api_requests";
import ItemBox, { Item, Sticker } from "./Item";
import User from "./User";

interface TimeoutProps {
  timeout: number;
}

function Timeout(props: TimeoutProps) {
  const seconds = props.timeout % 60;
  const minutes = Math.floor(props.timeout / 60);
  return (
    <Box>
      <Text
        className="no-select"
        color="red"
        sx={{ fontSize: 15, marginBottom: 0 }}
      >{`${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`}</Text>
      <Progress
        sx={{ height: 4, marginTop: 0 }}
        value={((600 - props.timeout) / 600) * 100}
      />
    </Box>
  );
}

export default function Inventory() {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [timeout, setTimeoutState] = useState(0);

  const inventory = useAppSelector(selectInv);
  const dispatch = useAppDispatch();
  const invDBReady = useAppSelector(selectInvDBReady);
  const steamid64 = useAppSelector(selectSteamID);
  const authenticated = useAppSelector(selectAuthenticated);
  const fetchInv = useCallback(
    (no_cache = false): Item[] => {
      if (steamid64) {
        setRefreshing(true);
        GET(`/inventory${no_cache ? "?no_cache=1" : ""}`).then(
          async (resp: Response) => {
            const json = await resp.json();

            if (resp.status === 200) {
              dispatch(setInv(json));
              setRefreshing(false);
              setRefreshSuccess(true);
              setError("");

              setTimeout(() => {
                if (no_cache) setTimeoutState(600);
                setRefreshSuccess(false);
              }, 3000);

              return json;
            } else if (resp.status === 403) {
              setError("Your Inventory has to be public.");
            } else if (resp.status === 401) {
              setError("You have to login to view your inventory.");
            } else if (resp.status === 429) {
              setTimeoutState(Number(json));
            } else {
              setError(
                `Your Inventory could not be loaded. Status code ${resp.status}`
              );
            }
          }
        );
      }

      if (refreshing) setRefreshing(false);
      return [];
    },
    [dispatch, refreshing, steamid64]
  );

  useEffect(() => {
    if (!inventory.length && invDBReady && authenticated) {
      fetchInv();
    } else if (!authenticated && inventory.length) {
      dispatch(setInv([]));
    }
    if (timeout) {
      const timer = setTimeout(() => {
        setTimeoutState(timeout - 1);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setRefreshing(false);
    }
  }, [inventory, timeout, dispatch, invDBReady, fetchInv, authenticated]);

  return (
    <>
      {error && (
        <Alert
          sx={{
            width: "25vw",
            marginLeft: "11vw",
            top: 100,
            position: "fixed",
            backgroundColor: "#212529",
            borderColor: "darkred",
            color: "red",
          }}
        >
          {error}
        </Alert>
      )}
      <Card
        withBorder
        sx={{
          width: "25vw",
          right: "15vw",
          position: "absolute",
          marginTop: error ? 20 : 0,
          top: 20,
        }}
      >
        <Card.Section
          sx={{
            display: "flex",
            justifyContent: "space-around",
          }}
          p="sm"
          withBorder
        >
          {inventory.length && authenticated ? (
            <>
              {refreshSuccess ? (
                <IconCheck color="green" size={40} />
              ) : timeout ? (
                <Timeout timeout={timeout} />
              ) : (
                (!refreshing && (
                  <Button variant="light" onClick={() => fetchInv(true)}>
                    <IconRefresh />
                  </Button>
                )) ||
                (refreshing && <Loader />)
              )}

              <TextInput
                icon={<IconSearch />}
                placeholder="Filter"
                onChange={(e) => setSearch(e.target.value)}
              />
            </>
          ) : null}
        </Card.Section>
        <Card.Section
          style={{
            padding: 0,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          {(!inventory.length || !authenticated) && (
            <Center p="lg">
              <User noImage />
            </Center>
          )}
          {inventory.length && authenticated ? (
            <Droppable
              droppableId="inventory"
              direction="horizontal"
              isDropDisabled
            >
              {(provided: DroppableProvided) => {
                return (
                  <ScrollArea.Autosize mah="75vh" type="always">
                    <div
                      style={{
                        height: "100%",
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingRight: 28,
                        paddingLeft: 12,
                      }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <SimpleGrid
                        sx={{
                          height: "100%",
                        }}
                        cols={4}
                        breakpoints={[
                          { maxWidth: 980, cols: 3, spacing: "md" },
                          { maxWidth: 755, cols: 2, spacing: "sm" },
                          { maxWidth: 600, cols: 1, spacing: "sm" },
                        ]}
                      >
                        {inventory
                          .filter((item: Item) => {
                            return (
                              item.custom_name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              item.market_hash_name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              item.stickers
                                .map((sticker: Sticker) => {
                                  return sticker.name
                                    .toLowerCase()
                                    .includes(search.toLowerCase());
                                })
                                .reduce((prev: boolean, curr: boolean) => {
                                  return prev || curr;
                                }, false)
                            );
                          })
                          .sort((x: Item, y: Item) => {
                            const rarity_to_number: { [key: string]: number } =
                              {
                                common: 0,
                                uncommon: 1,
                                rare: 2,
                                mythical: 3,
                                legendary: 4,
                                ancient: 5,
                                contraband: 6,
                              };

                            if (!x.rarity && !y.rarity) return 0;
                            if (!x.rarity) return -1;
                            if (!y.rarity) return 1;

                            if (
                              rarity_to_number[x.rarity.toLowerCase()] <
                              rarity_to_number[y.rarity.toLowerCase()]
                            )
                              return 1;

                            if (
                              rarity_to_number[y.rarity.toLowerCase()] >
                              rarity_to_number[x.rarity.toLowerCase()]
                            )
                              return -1;

                            return 0;
                          })
                          .map((item: Item, index: number) => {
                            return (
                              <ItemBox
                                key={item.id}
                                place="inv"
                                item={item}
                                index={index}
                              />
                            );
                          })}
                        {provided.placeholder}
                      </SimpleGrid>
                    </div>
                  </ScrollArea.Autosize>
                );
              }}
            </Droppable>
          ) : null}
        </Card.Section>
      </Card>
    </>
  );
}
