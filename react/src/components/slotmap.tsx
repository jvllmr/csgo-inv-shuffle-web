import React, { RefObject, useEffect, useRef, useState } from "react";
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
import { getMap, Map, setMap } from "../utils/slotmap";
import ItemBox, { Item } from "./item";
export enum TeamSide {
	T = "T",
	CT = "CT",
}
interface SlotProps {
	index: number;
	side: TeamSide;
	map: Map;
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
		minHeight: 140,
		overflow: "visible",
	};

	const items: Item[] = [];
	const { map } = props;

	if (map.length + 1 > props.index) {
		const slot = map[props.index - 1];

		items.push(...slot[team]);
		items.push(...slot["general"]);
	}

	return (
		<Droppable droppableId={`${team}-${props.index}`}>
			{(provided: DroppableProvided) => {
				return (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						style={slotstyle}>
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
							{provided.placeholder}
						</Row>
					</div>
				);
			}}
		</Droppable>
	);
}

interface SlotMapProps {
	map: Map;
	setSlotMapCallback: Function;
}

export default function SlotMap(props: SlotMapProps) {
	const [count, setCount] = useState(getMap().length ? getMap().length : 1);
	const countArray = [...Array(count).keys()].map((index: number) => {
		return index + 1;
	});

	const scrollToFooter = () => {
		const scrollDiv = document.getElementById("scrollDiv");
		const space = document.getElementById("space");
		if (space && scrollDiv) scrollDiv.scrollTo(0, space.offsetTop);
	};

	const { map, setSlotMapCallback } = props;

	useEffect(() => {
		if (!map || !map.length) {
			setSlotMapCallback([{ CT: [], T: [], general: [] }]);
		} else if (map.length < count) {
			while (map.length < count) map.push({ CT: [], T: [], general: [] });
			setSlotMapCallback(map);
		}
	}, [count, map, setSlotMapCallback]);

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
					}}>
					<img src="/img/terrorist.png" alt="T SIDE" />

					<img src="/img/ct.png" alt="CT SIDE" />
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
								}}>
								<Slot map={props.map} index={index} side={TeamSide.T} />

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

								<Slot map={props.map} index={index} side={TeamSide.CT} />
							</div>
						);
					})}
				</Card.Body>
				<Card.Footer style={{ display: "flex", justifyContent: "center" }}>
					<ButtonGroup>
						{count > 0 && (
							<Button
								variant="light"
								onClick={() => {
									setCount(count - 1);
									const map = getMap();
									while (map.length !== count - 1) {
										map.pop();
									}
									setSlotMapCallback(map);
								}}>
								<TiMinus />
							</Button>
						)}
						{count < 100 && (
							<Button
								variant="light"
								onClick={() => {
									setCount(count + 1);
									scrollToFooter();
								}}>
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
