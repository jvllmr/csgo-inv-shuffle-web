import React, { useEffect, useMemo, useState } from "react";

import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";

import { useDroppable } from "@dnd-kit/core";
import {
  Box,
  Button,
  Card,
  Image,
  Paper,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { selectAuthenticated } from "../redux/auth";
import {
  deleteBackward,
  deleteMap,
  selectMap,
  selectMapDBReady,
  setMap,
} from "../redux/map";
import { useAppDispatch, useAppSelector } from "../redux_hooks";
import { getItem, hasIntersectingSlots, hasItem } from "../utils/inventory";
import DraggableItemBox, { Item, ItemBox } from "./Item";
import { useScrollbarRef } from "./Shell";

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

  const items: Item[] = [];
  const map = useAppSelector(selectMap);

  if (map.length + 1 > props.index) {
    const slot = map[props.index - 1];

    items.push(...slot[team]);
    items.push(...slot["general"]);
  }

  const {
    isOver: isDraggingOver,
    setNodeRef,
    active: activeDrag,
  } = useDroppable({ id: `${team}-${props.index}` });

  const dragOverItem = useMemo(
    () =>
      activeDrag
        ? getItem(
            // @ts-ignore
            activeDrag.id.split("_", 1)[0]
          )
        : null,
    [activeDrag]
  );
  const style = useMemo(() => {
    let resStyle: React.CSSProperties = { height: "100%" };
    if (isDraggingOver) {
      if (
        !dragOverItem ||
        (dragOverItem &&
          !hasItem(dragOverItem, items) &&
          !hasIntersectingSlots(dragOverItem, items) &&
          ((dragOverItem &&
            props.side === TeamSide.CT &&
            (dragOverItem.shuffle_slots_ct.length ||
              dragOverItem.shuffle_slots.length)) ||
            (dragOverItem &&
              props.side === TeamSide.T &&
              (dragOverItem.shuffle_slots_t.length ||
                dragOverItem.shuffle_slots.length))))
      )
        resStyle.backgroundColor = "rgba(255,255,255, .2)";
    }
    return resStyle;
  }, [dragOverItem, isDraggingOver]);

  return (
    <Paper
      withBorder
      radius={0}
      ref={setNodeRef}
      sx={{
        // border: "1px solid #1C2023",
        width: "20vw",
        minHeight: 150,
        overflow: "hidden",
        // backgroundColor: "#232329",
      }}
      id={`${props.side}_${props.index}`}
    >
      <div style={style}>
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: "md" },
            { maxWidth: 755, cols: 2, spacing: "sm" },
            { maxWidth: 600, cols: 1, spacing: "sm" },
          ]}
          p="xs"
        >
          {items.map((item: Item, index: number) => {
            return (
              <DraggableItemBox
                key={item.id}
                place={`${props.side}_${props.index}`}
                item={item}
              />
            );
          })}
          {isDraggingOver && dragOverItem && !hasItem(dragOverItem, items) ? (
            <ItemBox item={dragOverItem} />
          ) : null}
        </SimpleGrid>
      </div>
    </Paper>
  );
}

export default function SlotMap() {
  const map = useAppSelector(selectMap);
  const [count, setCount] = useState(map.length ? map.length : 1);
  const countArray = useMemo(
    () =>
      [...Array(count).keys()].map((index: number) => {
        return index + 1;
      }),
    [count]
  );
  const authenticated = useAppSelector(selectAuthenticated);

  const dispatch = useAppDispatch();
  const mapDBReady = useAppSelector(selectMapDBReady);
  const scrollbarRef = useScrollbarRef();
  useEffect(() => {
    if (mapDBReady) {
      if (authenticated && !map?.length) {
        dispatch(setMap([{ CT: [], T: [], general: [] }]));
        dispatch(deleteBackward());
      } else if (map.length !== count) {
        setCount(map.length);
      }
    }
  }, [count, map, mapDBReady, authenticated, dispatch]);

  useEffect(() => {
    if (!authenticated) {
      dispatch(deleteMap());
      dispatch(deleteBackward());
    }
  }, [mapDBReady, authenticated, dispatch]);
  const { setNodeRef, isOver: isOverTrash } = useDroppable({ id: "trash" });
  return (
    <>
      <Card withBorder mr="50vw">
        <Card.Section
          sx={{
            top: 0,
            position: "sticky",
          }}
        >
          <Box
            m="xs"
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "98%",
            }}
          >
            <Image
              width={50}
              className="no-select"
              src="/img/terrorist.png"
              alt="T SIDE"
            />

            <div ref={setNodeRef}>
              <Text color={isOverTrash ? "dimmed" : "red"}>
                <IconTrash size={50} />
              </Text>
            </div>

            <Image
              width={50}
              className="no-select"
              src="/img/ct.png"
              alt="CT SIDE"
            />
          </Box>
        </Card.Section>
        <Card.Section style={{ padding: 0 }}>
          {countArray.map((index: number) => {
            return (
              <Paper
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "48wv",
                  marginTop: 0,
                }}
              >
                <Slot index={index} side={TeamSide.T} />

                <Paper
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // border: "1px solid #1C2023",
                    width: "8vw",
                  }}
                  withBorder
                  radius={0}
                >
                  <Text className="no-select" size="xl">
                    {index}
                  </Text>
                </Paper>

                <Slot index={index} side={TeamSide.CT} />
              </Paper>
            );
          })}
        </Card.Section>
        <Card.Section p="xs" sx={{ display: "flex", justifyContent: "center" }}>
          {authenticated && (
            <Button.Group>
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
                  <IconMinus />
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

                    const currScrollbarRef = scrollbarRef?.current;
                    if (currScrollbarRef)
                      currScrollbarRef.scrollTo({
                        top: currScrollbarRef.scrollHeight,
                      });
                  }}
                >
                  <IconPlus />
                </Button>
              )}
            </Button.Group>
          )}
        </Card.Section>
      </Card>
      <div id="space" style={{ height: 166 }} />
    </>
  );
}
