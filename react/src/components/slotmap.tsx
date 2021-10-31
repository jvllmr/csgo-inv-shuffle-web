import React, { useState } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import {
	Button,
	ButtonGroup,
	Card,
	Col,
	Container,
	Row,
} from "react-bootstrap";
import { TiPlus, TiMinus } from "react-icons/ti";
enum TeamSide {
	T = 1,
	CT = 2,
}
interface SlotProps {
	index: number;
	side: TeamSide;
}

function Slot(props: SlotProps) {
	let team;
	switch (props.side) {
		case TeamSide.T:
			team = "T";
			break;
		case TeamSide.CT:
			team = "CT";
			break;
	}

	return (
		<Droppable droppableId={`${team}-${props.index}`}>
			{(provided: DroppableProvided) => {
				return (
					<Container
						ref={provided.innerRef}
						{...provided.droppableProps}></Container>
				);
			}}
		</Droppable>
	);
}

interface SlotMapProps {}

export default function SlotMap(props: SlotMapProps) {
	const [count, setCount] = useState(1);
	const countArray = [...Array(count).keys()].map((index: number) => {
		return index + 1;
	});

	return (
		<>
			<Card bg="dark" border="light" style={{ minWidth: "48vw" }}>
				<Card.Header
					style={{
						position: "sticky",
						top: 0,
						display: "flex",
						justifyContent: "space-evenly",
					}}>
					<img src="/img/terrorist.png" alt="T SIDE" />

					<img src="/img/ct.png" alt="CT SIDE" />
				</Card.Header>
				<Card.Body>
					{countArray.map((index: number) => {
						return <div style={{ height: 20 }}></div>;
					})}
				</Card.Body>
				<Card.Footer style={{ display: "flex", justifyContent: "center" }}>
					<ButtonGroup>
						{count > 1 && (
							<Button variant="light" onClick={() => setCount(count - 1)}>
								<TiMinus />
							</Button>
						)}
						{count < 100 && (
							<Button variant="light" onClick={() => setCount(count + 1)}>
								<TiPlus />
							</Button>
						)}
					</ButtonGroup>
				</Card.Footer>
			</Card>
			<div style={{ height: "10vh" }}></div>
		</>
	);
}
