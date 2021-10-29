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
import { Col, Row } from "react-bootstrap";

export default function Content() {
	const [inventory, setInventory] = useState<Item[]>([]);
	const [inventoryWidth, setInventoryWidth] = useState(6);

	const onDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;
		if (!destination) return;
		if (
			source.droppableId === destination.droppableId ||
			source.droppableId === "inventory"
		)
			return;
	};
	const onDragStart = (start: DragStart) => {};
	const onDragUpdate = (update: DragUpdate) => {};

	useEffect(() => {
		const handleResize = () => {
			setInventoryWidth(6);
		};

		window.addEventListener("resize", handleResize);
		handleResize();
	}, []);

	return (
		<div className="scrollDiv">
			<Container className="content">
				<DragDropContext
					onDragEnd={onDragEnd}
					onDragStart={onDragStart}
					onDragUpdate={onDragUpdate}>
					<Row xs={2}>
						<Col>
							<SlotMap />
						</Col>
						<Col>
							<Inventory
								inventory={inventory}
								setInventoryCallback={setInventory}
								width={inventoryWidth}
							/>
						</Col>
					</Row>
				</DragDropContext>
			</Container>
			<Footer />
		</div>
	);
}
