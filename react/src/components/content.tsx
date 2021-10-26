import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Inventory from "./inventory";
import Footer from "./footer"
import { Item } from "./item";
import {DragDropContext, DragStart, DragUpdate, DropResult} from "react-beautiful-dnd"
export default function Content(){
	const [slotcount, setSlotCount] = useState(0);
	const [inventory, setInventory] = useState<Item[]>([]);

	const onDragEnd = (result: DropResult) => {
		const {destination, source, draggableId} = result;
		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		const newInventory = [...inventory];
		const item = newInventory.filter((val: Item) => {return val.id === draggableId})[0]

		newInventory.splice(source.index, 1);
		newInventory.splice(destination.index, 0, item)
		setInventory(newInventory);
	}
	const onDragStart = (start: DragStart) => {}
	const onDragUpdate = (update: DragUpdate) => {}
	
		return (
			<div className="scrollDiv">
			<Container className="content">
			

			<DragDropContext onDragEnd={onDragEnd}
			onDragStart={onDragStart}
			onDragUpdate={onDragUpdate}
			>
				<Inventory inventory={inventory} setInventoryCallback={setInventory}/>
			</DragDropContext>
			</Container>
			<Footer />
			</div>
		);
	
}
