import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Inventory from "./inventory";
import SlotMap, { TeamSide } from "./slotmap";
import Footer from "./footer";
import ItemBox, { Item } from "./item";
import {
  DragDropContext,
  DragStart,
  DragUpdate,
  DropResult,
} from "react-beautiful-dnd";
import { Alert, Col, Modal, Row } from "react-bootstrap";
import {
  getItem,
  hasItem,
  hasIntersectingSlots,
} from "../utils/inventory";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useAppDispatch, useAppSelector } from "../redux_hooks";
import { selectMap, setMap } from "../slices/map";
import { selectInv } from "../slices/inv";

export default function Content() {
  const map = useAppSelector(selectMap);
  const inventory = useAppSelector(selectInv)
  const dispatch = useAppDispatch();

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    const map_cpy = [ ...map ];
    for (let i = 0; i < map_cpy.length; i++) {
      const divElementT = document.getElementById(`T_${i + 1}`);
      const divElementCT = document.getElementById(`CT_${i + 1}`);
      if (divElementT) divElementT.style.backgroundColor = "#232329";
      if (divElementCT) divElementCT.style.backgroundColor = "#232329";
    }

    if (
      destination &&
      ((source.droppableId === destination.droppableId &&
      source.droppableId === "inventory") || source.droppableId === destination.droppableId)
    ) {
      return;
    }

    const [item_id] = draggableId.split("_", 1);

    let rollback = false;

    if (
      source.droppableId !== "inventory" &&
      (!destination ||
        (destination && source.droppableId !== destination.droppableId))
    ) {
      const [team, index] = source.droppableId.split("-", 2);

      const slot = {...map_cpy[+index - 1]};
      // @ts-ignore
      if (
        destination &&
        destination.droppableId !== "trash" &&
        (hasItem(
          item_id,
          map_cpy[+destination.droppableId.split("-", 2)[1] - 1]["general"]
        ) ||
          (hasItem(
            item_id,
            // @ts-ignore
            map_cpy[+destination.droppableId.split("-", 2)[1] - 1][team]
          ) &&
            destination.droppableId.split("-", 2)[1] !== index))
      )
        return;

      // @ts-ignore
      slot[team] = slot[team].filter((val: Item) => {
        return val.id !== item_id;
      });

      // @ts-ignore
      slot["general"] = slot["general"].filter((val: Item) => {
        return val.id !== item_id;
      });

      map_cpy[+index - 1] = slot;
    }
    if (!destination) {
      if (map_cpy !== [...map])
      dispatch(setMap(map_cpy));

      return;
    }
    const [team, index] = destination.droppableId.split("-", 2);
    const slot = {...map_cpy[+index - 1]};
    let item: Item | null = null;
    for (const it of inventory) {
      if (item_id === it.id) {
        item = it;
        break;
      }
    }
    if (!item) return;
    const addToSlot = (place: string, _item: Item, slotList: number[]) => {
      // @ts-ignore
      if (slotList.length) {
        // @ts-ignore
        const items: Item[] = [...slot[place]];
        for (const it of items) {
          if (it.id === _item.id) return;
          for (const ldtslot of slotList) {
            if (
              it.shuffle_slots.includes(ldtslot) ||
              it.shuffle_slots_ct.includes(ldtslot) ||
              it.shuffle_slots_t.includes(ldtslot)
            )
              return;
          }
        }

        items.push(_item);
        // @ts-ignore
        slot[place] = items;
      }
    };

    const addToGeneral = () => addToSlot("general", item!, item!.shuffle_slots);
    const addToCT = () => {
      if (!item!.shuffle_slots_ct.length) {
        addToGeneral();
      } else {
        addToSlot(TeamSide.CT, item!, item!.shuffle_slots_ct);
      }
    };

    const addToT = () => {
      if (!item!.shuffle_slots_t.length) {
        addToGeneral();
      } else {
        addToSlot(TeamSide.T, item!, item!.shuffle_slots_t);
      }
    };

    if (team === TeamSide.T) {
      addToT();
    } else if (team === TeamSide.CT) {
      addToCT();
    }

    map_cpy[+index - 1] = slot;
    if (rollback) return;
    if (map_cpy !== [...map])
    dispatch(setMap(map_cpy));
  };
  const onDragStart = (start: DragStart) => {
    const { source, draggableId } = start;
    const item = getItem(draggableId.split("_", 1)[0]);
    if (!item) return;
    const map_cpy = map;
    const red = "rgba(255, 49,57,0.3)";
    const green = "rgba(35, 255,41,0.2)";

    for (let i = 0; i < map_cpy.length; i++) {
      const cycle_slot = map_cpy[i];
      const index = i + 1;
      const { CT, T, general } = cycle_slot;
      const sections = [CT, T, general];
      const divT = document.getElementById(`T_${index}`);
      const divCT = document.getElementById(`CT_${index}`);
      if (!divT || !divCT) continue;
      const changeTColor = (color: string) => {
        //console.log(`T_${index} ${color === "rgba(255, 49,57,0.3)"? "red": "green"}`)
        divT.style.backgroundColor = color;
      };
      const changeCTColor = (color: string) => {
        //console.log(`CT_${index} ${color === "rgba(255, 49,57,0.3)"? "red": "green"}`)
        divCT.style.backgroundColor = color;
      };
      const changeBothColors = (color: string) => {
        changeCTColor(color);
        changeTColor(color);
      };

      let isRed = false;
      for (const section of sections) {
        let changeColor: Function = changeBothColors;

        if (section === CT) {
          //console.log(`${source.droppableId} CT`)
          changeColor = changeCTColor;
        } else if (section === T) {
          //console.log(`${source.droppableId} T`)
          changeColor = changeTColor;
        }

        if (hasItem(item, section)) {
          changeColor(red);
          isRed = true;
        } else if (hasIntersectingSlots(item, section)) {
          changeColor(red);
          isRed = true;
        } else if (
          (item.shuffle_slots_ct.length && section === CT) ||
          (item.shuffle_slots_t.length && section === T)
        ) {
          changeColor(green);
        } else if (!isRed) {
          changeColor(green);
        }
      }

      if (!item.shuffle_slots_ct.length && !item.shuffle_slots.length) {
        changeCTColor(red);
      } else if (!item.shuffle_slots_t.length && !item.shuffle_slots.length) {
        changeTColor(red);
      }
    }

    const source_element = document.getElementById(
      source.droppableId.replace("-", "_")
    );

    if (source_element) source_element.style.backgroundColor = "#232329";
  };

  return (
    <SimpleBar className="scrollDiv" id="scrollDiv" autoHide={false}>
      <div>
        <Container className="content">
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            dragHandleUsageInstructions="Instructions."
          >
            <Row xs={2}>
              <Col>
                <SlotMap />
              </Col>
              <Col>
                <Inventory
                  
                />
              </Col>
            </Row>
          </DragDropContext>
        </Container>
        <Footer />
      </div>
    </SimpleBar>
  );
}
