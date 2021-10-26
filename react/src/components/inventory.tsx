import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GET } from "../utils/api_requests";
import { getUserID } from "../utils/auth";
import ItemBox,{Item}  from "./item"
import User from "./user";
import {Droppable, DroppableProvided} from "react-beautiful-dnd";
interface InventoryProps {
  inventory: Item[]
  setInventoryCallback: Function
}

export default function Inventory(props: InventoryProps) {
  const [error, setError] = useState("");
  const {inventory, setInventoryCallback} = props
  useEffect(() => {
    if (getUserID())
      GET(`/inventory`).then(async (resp: Response) => {
        const json = await resp.json();
        if (resp.status === 200) {


          setInventoryCallback(json)

        } else if  (resp.status === 403) {

          setError("Your Inventory has to be public.")
        } else {
          setError(`Your Inventory could not be loaded. Status code ${resp.status}`)
        }
      });
  }, [setInventoryCallback]);

  return <Container style={{border:"2px solid rgb(102, 102, 102)", borderRadius: "10px"}}>
    <Row xs={3}>
      <p style={{color:"whitesmoke"}}>Your Inventory:</p>
      {!inventory.length && <User />}
      {error && <p style={{color:"red"}}>{error}</p>}
    </Row>
    <Container>
    <Droppable droppableId="inventory" direction="horizontal" ignoreContainerClipping>
      {(provided: DroppableProvided) => {return (
       
      <Row md={6} ref={provided.innerRef} {...provided.droppableProps}>
    {inventory.map(
      (item: Item, index:number) => {
        return <Col key={item.id}><ItemBox item={item} index={index}/></Col>
      }
      
    )}{provided.placeholder}</Row>)}}</Droppable></Container>

  </Container>;
}
