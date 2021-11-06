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
import { getInv } from "../utils/inventory";
import { getMap, Map, setMap } from "../utils/slotmap";

export default function Content() {
	const [inventory, setInventory] = useState<Item[]>(getInv() ? getInv() : []);
	const [slotmap, _setSlotMap] = useState<Map>(getMap());
	const setSlotMap = (_map: Map) => {
		setMap(_map);
		_setSlotMap(_map);
	};
	const onDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;

		if (
			destination &&
			source.droppableId === destination.droppableId &&
			source.droppableId === "inventory"
		) {
			return;
		}

		const [item_id] = draggableId.split("_", 1);
		const map = getMap();
		let rollback = false;

		if (
			source.droppableId !== "inventory" &&
			(!destination ||
				(destination && source.droppableId !== destination.droppableId))
		) {
			const [team, index] = source.droppableId.split("-", 2);

			const slot = map[+index - 1];

			// @ts-ignore
			slot[team] = slot[team].filter((val: Item) => {
				return val.id !== item_id;
			});

			// @ts-ignore
			slot["general"] = slot["general"].filter((val: Item) => {
				return val.id !== item_id;
			});

			map[+index - 1] = slot;
		}
		if (!destination) return;
		const [team, index] = destination.droppableId.split("-", 2);
		const slot = map[+index - 1];
		let item: Item | null = null;
		for (const it of getInv()) {
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
				const items: Item[] = slot[place];
				for (const it of items) {
					if (it.id === _item.id) return;
					for (const ldtslot of slotList) {
						if (it.shuffle_slots.includes(ldtslot) || it.shuffle_slots_ct.includes(ldtslot) || it.shuffle_slots_t.includes(ldtslot)) return;
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

		map[+index - 1] = slot;
		if (rollback) return;
		setSlotMap(map);
		
	};
	const onDragStart = (start: DragStart) => {};
	const onDragUpdate = (update: DragUpdate) => {};

	return (
		<div className="scrollDiv" id="scrollDiv">
			<Container className="content">
				<DragDropContext
					onDragEnd={onDragEnd}
					onDragStart={onDragStart}
					onDragUpdate={onDragUpdate}
					dragHandleUsageInstructions="HI">

					<Row xs={2}>
						<Col>
							<SlotMap
								map={slotmap}
								setSlotMapCallback={(map: Map) => setSlotMap(map)}
							/>
						</Col>
						<Col>
							<Inventory
								inventory={inventory}
								setInventoryCallback={(inv: Item[]) => setInventory(inv)}
							/>
						</Col>
					</Row>
				</DragDropContext>
			</Container>
			<Footer />
		</div>
	);
}
