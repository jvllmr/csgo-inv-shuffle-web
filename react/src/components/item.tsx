import React from "react";
import { Col, Container, Row } from "react-bootstrap";


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
}


export default function ItemBox(props: ItemBoxProps) {
    
    
    return <Container style={{margin:"5px", backgroundColor:"#303440", minWidth:"200px", minHeight:"155px", border:"2px solid rgb(102, 102, 102)", borderRadius: "6px"}}>
        <Row xs={2}><Col><img draggable={false} className="no-select" width={128} height={96} src={`https://community.cloudflare.steamstatic.com/economy/image/${props.item.icon_url_large ? props.item.icon_url_large : props.item.icon_url}`} alt={props.item.id}/></Col>
        <Col>
        <Row xs={2}>{props.item.stickers.map(
            (sticker: Sticker) => {
                return <Col key={sticker.name}><img  draggable={false} className="no-select" width={48} height={32} src={sticker.link} alt={sticker.name}/></Col>
            }
        )}</Row>
        </Col></Row>
        <Container style={{justifyContent: "center", display: "flex"}}>
        <p  style={{color:`#${props.item.name_color}`, fontSize:"11px"}}>{props.item.custom_name ? `"${props.item.custom_name}"`: props.item.market_hash_name.split("|")[1]}</p>
        </Container>
        
    </Container>

}
