import React from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { Col, Card, Row } from "react-bootstrap";


interface Sticker {
    link: string
    name: string
}
export interface Item {
    icon_url: string,
    icon_url_large: string,
    id: string,
    stickers: Sticker[]
    name_color: string,
    market_hash_name: string,
    custom_name: string
}

interface ItemBoxProps {
    item: Item
    index: number
}


export default function ItemBox(props: ItemBoxProps) {
    
    
    return (<Draggable draggableId={props.item.id} index={props.index}>{(provided: DraggableProvided)=> { return (<div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
    <Card style={{margin:"5px", backgroundColor:"#303440", minWidth:"200px", minHeight:"155px", border:"2px solid rgb(61, 61, 87)", borderRadius: "6px"}} >
        <Card.Body>
        <Row style={{paddingLeft: 10}} xs={2}><Col><img draggable={false} className="no-select" width={128} height={96} src={`https://community.cloudflare.steamstatic.com/economy/image/${props.item.icon_url_large ? props.item.icon_url_large : props.item.icon_url}`} alt={props.item.id}/></Col>
        <Col>
        <Row style={{paddingRight: 20}} xs={2}>{props.item.stickers.map(
            (sticker: Sticker) => {
                return <Col key={sticker.name}><img  draggable={false} className="no-select" width={48} height={32} src={sticker.link} alt={sticker.name}/></Col>
            }
        )}</Row>
        </Col></Row>
        </Card.Body>
        <Card.Footer style={{color:`#${props.item.name_color}`, fontSize:"11px"}}>
        
        {props.item.custom_name ? `"${props.item.custom_name}"`: props.item.market_hash_name.split("|")[1]}
        </Card.Footer>
        
    </Card></div>)}}</Draggable>)

}
