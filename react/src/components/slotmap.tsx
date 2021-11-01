import React, { RefObject, useRef, useState } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import {
	Button,
	ButtonGroup,
	Card,
	Col,
	Container,
	Form,
	Row,
} from "react-bootstrap";
import { TiPlus, TiMinus } from "react-icons/ti";
import { getMap } from "../utils/slotmap";
import ItemBox, { Item } from "./item";
enum TeamSide {
	T = 1,
	CT = 2,
}
interface SlotProps {
	index: number;
	side: TeamSide;
	map: any;
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

	const slotstyle: React.CSSProperties = {
		border: "1px solid #1C2023",
		width: "20vw",
		minHeight: 140,
	};

	const items: Item[] = [];
	const { map } = props;
	if (map.length) {
		const slot = map[props.index - 1];

		for (const ldtslot in slot[team]) {
			items.push(slot[team][ldtslot]);
		}

		for (const ldtslot in slot["general"]) {
			items.push(slot["general"][ldtslot]);
		}
	}
	return (
		<Droppable droppableId={`${team}-${props.index}`}>
			{(provided: DroppableProvided) => {
				return (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						style={slotstyle}>
						<Row xs={5}>
							{items.map((item: Item, index: number) => {
								return <ItemBox item={item} index={index} />;
							})}
						</Row>
					</div>
				);
			}}
		</Droppable>
	);
}

interface SlotMapProps {
	map: any;
}

export default function SlotMap(props: SlotMapProps) {
	const [count, setCount] = useState(1);
	const countArray = [...Array(count).keys()].map((index: number) => {
		return index + 1;
	});

	const scrollToFooter = () => {
		const scrollDiv = document.getElementById("scrollDiv");
		const space = document.getElementById("space");
		if (space && scrollDiv) scrollDiv.scrollTo(0, space.offsetTop);
	};
	scrollToFooter();

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
				<Card.Body style={{ padding: 0 }}>
					{countArray.map((index: number) => {
						return (
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "48wv",
									marginTop: 0,
								}}>
								<div>
									<Slot map={props.map} index={index} side={TeamSide.T} />
								</div>

								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										border: "1px solid #1C2023",
										width: "8vw",
									}}>
									<p style={{ fontSize: 30, color: "whitesmoke" }}>{index}</p>
								</div>

								<div>
									<Slot map={props.map} index={index} side={TeamSide.CT} />
								</div>
							</div>
						);
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
			<div id="space" style={{ height: 166 }}></div>
		</>
	);
}
