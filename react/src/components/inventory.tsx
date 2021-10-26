import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GET } from "../utils/api_requests";
import { getUserID } from "../utils/auth";
import ItemBox,{Item}  from "./item"
import User from "./user";



export default function Inventory() {
  const [inventory, setInventory] = useState<Item[]>([]);
  useEffect(() => {
    if (getUserID())
      GET(`/inventory`).then(async (resp: Response) => {
        const json = await resp.json();
        if (resp.status === 200) {
          setInventory(json)
        }
      });
  }, []);

  return <Container style={{border:"2px solid rgb(102, 102, 102)", borderRadius: "10px"}}>
    <Row>
      <p style={{color:"whitesmoke"}}>Your Inventory:</p>
    </Row>
    <Container>
    {!inventory.length && <User />}
    <Row md={6}>
    {inventory.map(
      (item: Item) => {
        return <Col><ItemBox item={item}/></Col>
      }
    )}</Row></Container>

  </Container>;
}
