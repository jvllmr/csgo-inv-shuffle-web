import React, { useCallback, useEffect, useState } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  ProgressBar,
  Row,
  Spinner,
} from "react-bootstrap";
import { MdCheck, MdRefresh, MdSearch } from "react-icons/md";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useAppDispatch, useAppSelector } from "../redux_hooks";
import { selectAuthenticated, selectSteamID } from "../slices/auth";
import { selectInv, selectInvDBReady, setInv } from "../slices/inv";
import { GET } from "../utils/api_requests";
import ItemBox, { Item, Sticker } from "./item";
import User from "./user";

interface TimeoutProps {
  timeout: number;
}

function Timeout(props: TimeoutProps) {
  const seconds = props.timeout % 60;
  const minutes = Math.floor(props.timeout / 60);
  return (
    <div>
      <p
        className="no-select"
        style={{ color: "red", fontSize: 15, marginBottom: 0 }}
      >{`${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`}</p>
      <ProgressBar
        style={{ height: 4, marginTop: 0 }}
        variant="light"
        now={((600 - props.timeout) / 600) * 100}
      />
    </div>
  );
}

interface InventoryProps {}

export default function Inventory(props: InventoryProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [refresh_success, setRefreshSuccess] = useState(false);
  const [timeout, setTimeoutState] = useState(0);

  const inventory = useAppSelector(selectInv);
  const dispatch = useAppDispatch();
  const invDBReady = useAppSelector(selectInvDBReady);
  const steamid64 = useAppSelector(selectSteamID);
  const authenticated = useAppSelector(selectAuthenticated);
  const fetchInv = useCallback(
    (no_cache: boolean = false): Item[] => {
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
              setTimeoutState(+json);
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
    } else if (!authenticated) {
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
          variant="danger"
          style={{
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
        bg="dark"
        border="light"
        style={{
          width: "25vw",
          marginLeft: "11vw",
          position: "fixed",
          marginTop: error ? 20 : 0,
          top: 115,
        }}
      >
        <Card.Header
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {inventory.length && authenticated && (
            <>
              {refresh_success ? (
                <MdCheck color="green" size={40} />
              ) : timeout ? (
                <Timeout timeout={timeout} />
              ) : (
                (!refreshing && (
                  <Button variant="light" onClick={() => fetchInv(true)}>
                    <MdRefresh />
                  </Button>
                )) ||
                (refreshing && <Spinner animation="border" variant="light" />)
              )}
              <Form.Group>
                <InputGroup>
                  <InputGroup.Text>
                    <MdSearch color="whitesmoke" />
                  </InputGroup.Text>
                  <Form.Control
                    className="no-select"
                    placeholder="Filter"
                    size="sm"
                    inputMode="search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </>
          )}
        </Card.Header>
        <Card.Body
          style={{
            padding: 0,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          {(!inventory.length || !authenticated) && (
            <Container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <Row xs={1}>
                <User noImage />
                <div style={{ marginBottom: 20 }} />
              </Row>
            </Container>
          )}
          {inventory.length && authenticated && (
            <Droppable
              droppableId="inventory"
              direction="horizontal"
              isDropDisabled
            >
              {(provided: DroppableProvided) => {
                return (
                  <SimpleBar
                    style={{
                      overflowX: "hidden",
                      height: "75vh",
                    }}
                    autoHide={false}
                  >
                    <div
                      style={{
                        height: "100%",
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingRight: 28,
                        paddingLeft: 12,
                      }}
                    >
                      <Row
                        xs={1}
                        sm={1}
                        md={1}
                        lg={2}
                        xl={4}
                        style={{
                          height: "100%",
                        }}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
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
                      </Row>
                    </div>
                  </SimpleBar>
                );
              }}
            </Droppable>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
