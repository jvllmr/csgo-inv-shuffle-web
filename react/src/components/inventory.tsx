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
	Alert,
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
}

export default function Inventory(props: InventoryProps) {
	const [refreshing, setRefreshing] = useState(false);
	const [search, setSearch] = useState("");
	const [error, setError] = useState("");
	const { setInventoryCallback } = props;

	const inventory = getInv()
		? props.inventory.length !== getInv().length
			? getInv()
			: props.inventory
		: props.inventory;

	const fetchInv = () => {
		if (getUserID()) {
			setRefreshing(true);
			GET(`/inventory`).then(async (resp: Response) => {
				const json = await resp.json();

				if (resp.status === 200) {
					setInv(json);
					setRefreshing(false);
					setError("");
					return json;
				} else if (resp.status === 403) {
					setError("Your Inventory has to be public.");
				} else if (resp.status === 401) {
					setError("You have to login to view your inventory.");
				} else if (resp.status === 429) {
					setError("Too many refreshes at once. Please try again later.");
				} else {
					setError(
						`Your Inventory could not be loaded. Status code ${resp.status}`
					);
				}
			});
		}

		if (refreshing) setRefreshing(false);
		return [];
	};

	useEffect(() => {
		if (!inventory.length) {
			setInventoryCallback(fetchInv());
		}
	}, [inventory.length]);

	return (
		<>
			{error && (
				<Alert
					variant="danger"
					style={{
						width: "25vw",
						marginLeft: "11vw",
						top: 65,
						position: "fixed",
						backgroundColor: "#212529",
						borderColor: "darkred",
						color: "red",
					}}>
					{error}
				</Alert>
			)}
			<Card
				bg="dark"
				border="light"
				style={{
					width: "25vw",
					marginLeft: "11vw",
					position: "fixed",
					marginTop: error ? 20 : 0,
				}}>
				<Card.Header
					style={{
						display: "flex",
						justifyContent: "space-around",
					}}>
					{inventory.length && (
						<>
							{!refreshing && (
								<Button variant="light" onClick={fetchInv}>
									<MdRefresh />
								</Button>
							)}
							{refreshing && <Spinner animation="border" variant="light" />}

							<Form.Group>
								<InputGroup>
									<InputGroup.Text>
										<MdSearch color="whitesmoke" />
									</InputGroup.Text>
									<Form.Control
										placeholder="Filter"
										size="sm"
										inputMode="search"
										onChange={(e) => setSearch(e.target.value)}
									/>
								</InputGroup>
							</Form.Group>
						</>
					)}
				</Card.Header>
				<Card.Body
					style={{
						padding: 12,
						paddingTop: 0,
						paddingBottom: 0,
					}}>
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
						<Droppable
							droppableId="inventory"
							direction="horizontal"
							isDropDisabled>
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
											overflowX:"hidden",
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
											.sort((x: Item, y: Item) => {
												const rarity_to_number = {
													common: 0,
													uncommon: 1,
													rare: 2,
													mythical: 3,
													legendary: 4,
													ancient: 5,
													contraband: 6,
												};

												if (!x.rarity && !y.rarity) return 0;
												if (!x.rarity) return -1;
												if (!y.rarity) return 1;

												if (
													// @ts-ignore
													rarity_to_number[x.rarity.toLowerCase()] <
													// @ts-ignore
													rarity_to_number[y.rarity.toLowerCase()]
												)
													return 1;

												if (
													// @ts-ignore
													rarity_to_number[y.rarity.toLowerCase()] >
													// @ts-ignore
													rarity_to_number[x.rarity.toLowerCase()]
												)
													return -1;

												return 0;
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
		</>
	);
}
