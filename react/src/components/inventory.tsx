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
	ProgressBar,
} from "react-bootstrap";
import { GET } from "../utils/api_requests";
import { getInv, setInv } from "../utils/inventory";
import { getUserID, is_authenticated } from "../utils/auth";
import ItemBox, { Item, Sticker } from "./item";
import User from "./user";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import { MdCheck, MdRefresh, MdSearch } from "react-icons/md";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface TimeoutProps {
	timeout: number
}

function Timeout(props: TimeoutProps) {
	const seconds = props.timeout % 60
	const minutes = Math.floor(props.timeout / 60)
	return <div>

		<p style={{color: "red", fontSize: 15, marginBottom: 0}}>{`${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`}</p>
		<ProgressBar style={{height: 4, marginTop: 0}} variant="light" now={((600-props.timeout)/600*100)}/>
	</div>	


}


interface InventoryProps {
	inventory: Item[];
	setInventoryCallback: Function;
}


export default function Inventory(props: InventoryProps) {
	const [refreshing, setRefreshing] = useState(false);
	const [search, setSearch] = useState("");
	const [error, setError] = useState("");
	const [refresh_success, setRefreshSuccess] = useState(false);
	const [timeout, setTimeoutState] = useState(0);
	const { setInventoryCallback } = props;

	const inventory = getInv()
		? props.inventory.length !== getInv().length
			? getInv()
			: props.inventory
		: props.inventory;

	const fetchInv = (no_cache: boolean = false) => {
		if (getUserID()) {
			setRefreshing(true);
			GET(`/inventory${no_cache ? "?no_cache=1" : ""}`).then(
				async (resp: Response) => {
					const json = await resp.json();
					
					if (resp.status === 200) {
						setInv(json);
						setRefreshing(false);
						setRefreshSuccess(true);
						setError("");
						setTimeout(() => {
							setTimeoutState(600);
							setRefreshSuccess(false);
						}, 3000)
						
						return json;
					} else if (resp.status === 403) {
						setError("Your Inventory has to be public.");
					} else if (resp.status === 401) {
						setError("You have to login to view your inventory.");
					} else if (resp.status === 429) {
						setTimeoutState(+json)
					} else {
						setError(
							`Your Inventory could not be loaded. Status code ${resp.status}`
						);
					}
				}
			);
		}

		if (refreshing) setRefreshing(false);
		return [];
	};

	useEffect(() => {
		if (!inventory.length) {
			setInventoryCallback(fetchInv());
		}
		if(timeout) {
			const timer = setTimeout(()=>{setTimeoutState(timeout-1)}, 1000)
			return () => {clearTimeout(timer)}
		} else {
			setRefreshing(false);
		}
	}, [inventory.length, timeout]);

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
							{refresh_success ? <MdCheck color="green" size={40}/> :
							timeout ? <Timeout timeout={timeout} /> :
							(!refreshing && (
								<Button variant="light" onClick={() => fetchInv(true)}>
									<MdRefresh />
								</Button>
							))
							|| (refreshing && <Spinner animation="border" variant="light" />)
							}
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
						padding: 0,
						paddingTop: 0,
						paddingBottom: 0,
					}}>
					{(!inventory.length || !is_authenticated()) && (
						<Container
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginTop: 30
							}}>
							<Row xs={1}>
								<User />
							</Row>
						</Container>
					)}
					{inventory.length && is_authenticated() && (
						<Droppable
							droppableId="inventory"
							direction="horizontal"
							isDropDisabled>
							{(provided: DroppableProvided) => {
								return (
									<SimpleBar
										style={{
											overflowX: "hidden",
											height: "75vh",
										}}
										autoHide={false}>
										<div
											style={{
												height: "100%",
												paddingTop: 10,
												paddingBottom: 10,
												paddingRight: 28,
												paddingLeft: 12,
											}}>
											<Row
												xs={1}
												sm={1}
												md={1}
												lg={2}
												xl={4}
												style={{
													height: "100%",
												}}
												ref={provided.innerRef}
												{...provided.droppableProps}>
												{inventory
													.filter((item: Item) => {
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
														return (
															<ItemBox
																key={item.id}
																place="inv"
																item={item}
																index={index}
															/>
														);
													})}
												{provided.placeholder}
											</Row>
										</div>
									</SimpleBar>
								);
							}}
						</Droppable>
					)}
				</Card.Body>
			</Card>
		</>
	);
}
