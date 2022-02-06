import React, { useEffect, useState } from "react";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { Button, ButtonGroup, Card, Row } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { TiMinus, TiPlus } from "react-icons/ti";
import SimpleBar from "simplebar";
import { useAppDispatch, useAppSelector } from "../redux_hooks";
import { selectAuthenticated } from "../slices/auth";
import {
  deleteBackward,
  deleteMap,
  selectMap,
  selectMapDBReady,
  setMap,
} from "../slices/map";
import { getItem, hasIntersectingSlots, hasItem } from "../utils/inventory";
import ItemBox, { Item } from "./item";

export enum TeamSide {
  T = "T",
  CT = "CT",
}
interface SlotProps {
  index: number;
  side: TeamSide;
}

function Slot(props: SlotProps) {
  let team;
  switch (props.side) {
    case TeamSide.T:
      team = TeamSide.T;
      break;
    case TeamSide.CT:
      team = TeamSide.CT;
      break;
  }

  const slotstyle: React.CSSProperties = {
    border: "1px solid #1C2023",
    width: "20vw",
    minHeight: 150,
    overflow: "hidden",
    backgroundColor: "#232329",
  };

  const items: Item[] = [];
  const map = useAppSelector(selectMap);

  if (map.length + 1 > props.index) {
    const slot = map[props.index - 1];

    items.push(...slot[team]);
    items.push(...slot["general"]);
  }

  return (
    <Droppable droppableId={`${team}-${props.index}`}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => {
        const { isDraggingOver, draggingOverWith } = snapshot;
        let style: React.CSSProperties = { height: "100%" };

        if (isDraggingOver && draggingOverWith) {
          const item = getItem(draggingOverWith.split("_", 1)[0]);
          if (
            !item ||
            (item &&
              !hasItem(item, items) &&
              !hasIntersectingSlots(item, items) &&
              ((item &&
                props.side === TeamSide.CT &&
                (item.shuffle_slots_ct.length || item.shuffle_slots.length)) ||
                (item &&
                  props.side === TeamSide.T &&
                  (item.shuffle_slots_t.length || item.shuffle_slots.length))))
          )
            style = {
              ...style,
              zIndex: 500,
              backgroundColor: "rgba(255,255,255, .2)",
            };
        }

        return (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={slotstyle}
            id={`${props.side}_${props.index}`}
          >
            <div style={style}>
              <Row xs={4} style={{ paddingRight: 50 }}>
                {items.map((item: Item, index: number) => {
                  return (
                    <ItemBox
                      key={item.id}
                      place={`${props.side}${props.index}`}
                      item={item}
                      index={index}
                    />
                  );
                })}
                {items.length % 4 === 0 && (
                  <div style={{ height: 135, width: 105 }} />
                )}
                {provided.placeholder}
              </Row>
            </div>
          </div>
        );
      }}
    </Droppable>
  );
}

interface SlotMapProps {}

export default function SlotMap(props: SlotMapProps) {
  const map = useAppSelector(selectMap);
  const [count, setCount] = useState(map.length ? map.length : 1);
  const countArray = [...Array(count).keys()].map((index: number) => {
    return index + 1;
  });
  const authenticated = useAppSelector(selectAuthenticated);
  const scrollToFooter = () => {
    const scrollDiv = document.getElementById("scrollDiv");
    const space = document.getElementById("space");
    if (space && scrollDiv)
      SimpleBar.instances
        .get(scrollDiv)!
        .getScrollElement()
        .scrollTo(0, space.offsetTop);
  };

  const dispatch = useAppDispatch();
  const mapDBReady = useAppSelector(selectMapDBReady);
  useEffect(() => {
    if (mapDBReady) {
      if (!authenticated) dispatch(deleteMap());
      if (!map || !map.length) {
        dispatch(setMap([{ CT: [], T: [], general: [] }]));
        dispatch(deleteBackward());
      } else if (map.length !== count) {
        setCount(map.length);
      }
    }
  }, [count, map, dispatch, mapDBReady, authenticated]);

  return (
    <>
      <Card bg="dark" border="light" style={{ minWidth: "48vw" }}>
        <Card.Header
          style={{
            position: "sticky",
            top: 0,
            display: "flex",
            justifyContent: "space-evenly",
            zIndex: 1000,
          }}
        >
          <img className="no-select" src="/img/terrorist.png" alt="T SIDE" />

          <Droppable droppableId="trash">
            {(
              provided: DroppableProvided,
              snapshot: DroppableStateSnapshot
            ) => {
              provided.placeholder = undefined;
              const { isDraggingOver } = snapshot;
              let style: React.CSSProperties = {
                height: 60,
                width: 30,
                color: "rgba(255, 49,57,0.7)",
              };
              if (isDraggingOver)
                style = {
                  ...style,
                  color: "rgba(255,255,255, .2)",
                };
              return (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <FaTrash style={style} />
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
          <img className="no-select" src="/img/ct.png" alt="CT SIDE" />
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          {countArray.map((index: number) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "48wv",
                  marginTop: 0,
                }}
              >
                <Slot index={index} side={TeamSide.T} />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #1C2023",
                    width: "8vw",
                  }}
                >
                  <p
                    className="no-select"
                    style={{ fontSize: 30, color: "whitesmoke" }}
                  >
                    {index}
                  </p>
                </div>

                <Slot index={index} side={TeamSide.CT} />
              </div>
            );
          })}
        </Card.Body>
        <Card.Footer style={{ display: "flex", justifyContent: "center" }}>
          {authenticated && (
            <ButtonGroup>
              {count > 1 && (
                <Button
                  variant="light"
                  onClick={() => {
                    setCount(count - 1);
                    const map_cpy = [...map];
                    while (map_cpy.length !== count - 1) {
                      map_cpy.pop();
                    }
                    dispatch(setMap(map_cpy));
                  }}
                >
                  <TiMinus />
                </Button>
              )}
              {count < 100 && (
                <Button
                  variant="light"
                  onClick={() => {
                    const map_cpy = [...map];

                    while (map_cpy.length < count + 1)
                      map_cpy.push({ CT: [], T: [], general: [] });

                    dispatch(setMap(map_cpy));
                    scrollToFooter();
                  }}
                >
                  <TiPlus />
                </Button>
              )}
            </ButtonGroup>
          )}
        </Card.Footer>
      </Card>
      <div id="space" style={{ height: 166 }}></div>
    </>
  );
}
