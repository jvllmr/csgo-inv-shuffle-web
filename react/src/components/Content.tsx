import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";

import { Container } from "@mantine/core";
import { selectInv } from "../redux/inv";
import { selectMap, setMap } from "../redux/map";
import { useAppDispatch, useAppSelector } from "../redux_hooks";
import { getItem, hasIntersectingSlots, hasItem } from "../utils/inventory";
import Inventory from "./Inventory";
import { Item } from "./Item";
import SlotMap, { TeamSide } from "./SlotMap";

export default function Content() {
  const map = useAppSelector(selectMap);
  const inventory = useAppSelector(selectInv);
  const dispatch = useAppDispatch();

  // eslint-disable-next-line complexity
  function onDragEnd(result: DropResult) {
    let rollback = false;
    const { destination, source, draggableId } = result;
    const map_cpy = [...map];
    for (let i = 0; i < map_cpy.length; i++) {
      const divElementT = document.getElementById(`T_${i + 1}`);
      const divElementCT = document.getElementById(`CT_${i + 1}`);
      // @ts-ignore
      if (divElementT) divElementT.style.backgroundColor = null;
      // @ts-ignore
      if (divElementCT) divElementCT.style.backgroundColor = null;
    }

    if (
      destination &&
      ((source.droppableId === destination.droppableId &&
        source.droppableId === "inventory") ||
        source.droppableId === destination.droppableId)
    ) {
      return;
    }

    const [item_id] = draggableId.split("_", 1);

    if (
      source.droppableId !== "inventory" &&
      (!destination ||
        (destination && source.droppableId !== destination.droppableId))
    ) {
      const [team, index] = source.droppableId.split("-", 2);

      const slot: { [key: string]: Item[] } = { ...map_cpy[Number(index) - 1] };

      if (
        destination &&
        destination.droppableId !== "trash" &&
        (hasItem(
          item_id,
          map_cpy[Number(destination.droppableId.split("-", 2)[1]) - 1][
            "general"
          ]
        ) ||
          (hasItem(
            item_id,
            // @ts-ignore
            map_cpy[Number(destination.droppableId.split("-", 2)[1]) - 1][team]
          ) &&
            destination.droppableId.split("-", 2)[1] !== index))
      )
        return;

      slot[team] = slot[team].filter((val: Item) => {
        return val.id !== item_id;
      });

      slot["general"] = slot["general"].filter((val: Item) => {
        return val.id !== item_id;
      });
      // @ts-ignore
      map_cpy[Number(index) - 1] = slot;
    }
    if (!destination || destination.droppableId === "trash") {
      if (source.droppableId !== "inventory") dispatch(setMap(map_cpy));

      return;
    }
    const [team, index] = destination.droppableId.split("-", 2);
    const slot = { ...map_cpy[Number(index) - 1] };
    let item: Item | null = null;
    for (const it of inventory) {
      if (item_id === it.id) {
        item = it;
        break;
      }
    }
    if (!item) return;
    const addToSlot = (
      place: "general" | "CT" | "T",
      _item: Item,
      slotList: number[]
    ) => {
      if (slotList.length) {
        const items: Item[] = [...slot[place]];
        for (const it of items) {
          if (it.id === _item.id) {
            rollback = true;
            return;
          }
          for (const ldtslot of slotList) {
            if (
              it.shuffle_slots.includes(ldtslot) ||
              it.shuffle_slots_ct.includes(ldtslot) ||
              it.shuffle_slots_t.includes(ldtslot)
            ) {
              rollback = true;
              return;
            }
          }
        }

        items.push(_item);

        slot[place] = items;
      } else {
        rollback = true;
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

    map_cpy[Number(index) - 1] = slot;

    if (rollback) return;
    // @ts-ignore
    if (map_cpy != [...map]) dispatch(setMap(map_cpy)); // @vite-ignore
  }
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
        divT.style.backgroundColor = color;
      };
      const changeCTColor = (color: string) => {
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
          changeColor = changeCTColor;
        } else if (section === T) {
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
    // @ts-ignore
    if (source_element) source_element.style.backgroundColor = null;
  };

  return (
    <div>
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        dragHandleUsageInstructions="Instructions."
      >
        <Container fluid>
          <SlotMap />

          <Inventory />
        </Container>
      </DragDropContext>
    </div>
  );
}
