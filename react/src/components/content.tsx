import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Inventory from "./inventory";
import SlotMap from "./slotmap";
import Footer from "./footer";
import { Item } from "./item";
import {
	DragDropContext,
	DragStart,
	DragUpdate,
	DropResult,
} from "react-beautiful-dnd";
import { Alert, Col, Modal, Row } from "react-bootstrap";
import { getInv } from "../utils/inventory";
import { getMap } from "../utils/slotmap";

export default function Content() {
	const [inventory, setInventory] = useState<Item[]>(getInv() ? getInv() : []);
	const [slotmap, setSlotMap] = useState(getMap());

	const onDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;
		console.log(source, destination);
		if (!destination) return;
		if (
			source.droppableId === destination.droppableId ||
			source.droppableId === "inventory"
		)
			return;
	};
	const onDragStart = (start: DragStart) => {};
	const onDragUpdate = (update: DragUpdate) => {};

	return (
		<div className="scrollDiv" id="scrollDiv">
			<Container className="content">
				<DragDropContext
					onDragEnd={onDragEnd}
					onDragStart={onDragStart}
					onDragUpdate={onDragUpdate}>
					<Row xs={2}>
						<Col>
							<SlotMap map={slotmap} />
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
