import React, { useEffect, useState } from "react";
import {
	Button,
	Card,
	Col,
	Container,
	Row,
	Spinner,
	Form,
	InputGroup,
} from "react-bootstrap";
import { GET } from "../utils/api_requests";
import { getInv, setInv } from "../utils/inventory";
import { getUserID } from "../utils/auth";
import ItemBox, { Item, Sticker } from "./item";
import User from "./user";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import { MdRefresh, MdSearch } from "react-icons/md";
interface InventoryProps {
	inventory: Item[];
	setInventoryCallback: Function;
	width: number;
}

export default function Inventory(props: InventoryProps) {
	const [error, setError] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const [search, setSearch] = useState("");
	const { inventory, setInventoryCallback } = props;

	const fetchInv = () => {
		if (getUserID()) {
			setRefreshing(true);
			GET(`/inventory`).then(async (resp: Response) => {
				const json = await resp.json();
				if (resp.status === 200) {
					setInv(json);
					setRefreshing(false);
					return json;
				} else if (resp.status === 403) {
					setError("Your Inventory has to be public.");
				} else if (resp.status === 401) {
					setError("You have to login to view your inventory.");
				} else {
					setError(
						`Your Inventory could not be loaded. Status code ${resp.status}`
					);
				}
			});
		} else {
			setError("You have to be logged in");
		}
		if (refreshing) setRefreshing(false);
		return [];
	};

	useEffect(() => {
		if (!inventory.length) {
			let inv = getInv();
			if (!inv.length) inv = fetchInv();
			setInventoryCallback(inv);
		}
	});

	return (
		<Card
			bg="dark"
			border="light"
			style={{ width: "25vw", marginLeft: "11vw", position: "fixed" }}>
			<Card.Header
				style={{
					display: "flex",
					justifyContent: "space-around",
				}}>
				{!refreshing && (
					<Button variant="light" onClick={fetchInv}>
						<MdRefresh />
					</Button>
				)}
				{refreshing && <Spinner animation="border" variant="light" />}

				{error && <p style={{ color: "red" }}>{error}</p>}
				<Form.Group>
					<InputGroup>
						<InputGroup.Text>
							<MdSearch color="whitesmoke" />
						</InputGroup.Text>
						<Form.Control
							placeholder="Filter for Name, Sticker, Patch"
							size="sm"
							inputMode="search"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</InputGroup>
				</Form.Group>
			</Card.Header>
			<Card.Body style={{ padding: 12, paddingTop: 0, paddingBottom: 0 }}>
				{!inventory.length && (
					<Container
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Row xs={1}>
							<User />
						</Row>
					</Container>
				)}
				{inventory.length && (
					<Droppable droppableId="inventory" direction="horizontal">
						{(provided: DroppableProvided) => {
							return (
								<Row
									xs={1}
									sm={1}
									md={1}
									lg={2}
									xl={4}
									style={{
										overflowY: "scroll",
										height: "75vh",
										paddingRight: 10,
										paddingTop: 10,
										paddingBottom: 10,
									}}
									ref={provided.innerRef}
									{...provided.droppableProps}>
									{inventory
										.filter((item: Item) => {
											console.log(
												item.market_hash_name
													.toLowerCase()
													.includes(search.toLowerCase())
											);
											return (
												item.custom_name
													.toLowerCase()
													.includes(search.toLowerCase()) ||
												item.market_hash_name
													.toLowerCase()
													.includes(search.toLowerCase()) ||
												item.stickers
													.map((sticker: Sticker) => {
														return sticker.name
															.toLowerCase()
															.includes(search.toLowerCase());
													})
													.reduce((prev: boolean, curr: boolean) => {
														return prev || curr;
													}, false)
											);
										})
										.map((item: Item, index: number) => {
											return <ItemBox item={item} index={index} />;
										})}
									{provided.placeholder}
								</Row>
							);
						}}
					</Droppable>
				)}
			</Card.Body>
		</Card>
	);
}
