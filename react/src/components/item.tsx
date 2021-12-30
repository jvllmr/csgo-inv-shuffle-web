import React from "react";
import {
  Draggable,
  DraggableProvided,
  DraggingStyle,
} from "react-beautiful-dnd";
import { Card } from "react-bootstrap";

export interface Sticker {
  link: string;
  name: string;
}
export interface Item {
  icon_url: string;
  icon_url_large: string;
  id: string;
  stickers: Sticker[];
  name_color: string;
  market_hash_name: string;
  custom_name: string;
  rarity: string;
  shuffle_slots_t: number[];
  shuffle_slots: number[];
  shuffle_slots_ct: number[];
}

interface ItemBoxProps {
  item: Item;
  index: number;
  place: string;
}

function instanceOfDraggingStyle(data: any): data is DraggingStyle {
  return "position" in data;
}

export default function ItemBox(props: ItemBoxProps) {
  let x = 0;
  return (
    <Draggable
      draggableId={`${props.item.id}_${props.place}`}
      index={props.index}
    >
      {(provided: DraggableProvided) => {
        const customProps = { ...provided.draggableProps };
        if (!instanceOfDraggingStyle(customProps.style)) {
          customProps.style = {
            ...customProps.style,
            zIndex: 750,
            transition: "none",
            transform: "none",
          };
        }

        return (
          <div
            {...customProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            key={props.item.id}
          >
            <Card
              style={{
                margin: 2,
                backgroundColor: "#303440",
                width: 105,
                height: 135,
                //border: "2px solid rgb(61, 61, 87)",
                //borderRadius: "6px",
              }}
            >
              <Card.Img
                style={{ height: 75, width: 100 }}
                src={`https://community.cloudflare.steamstatic.com/economy/image/${
                  props.item.icon_url_large
                    ? props.item.icon_url_large
                    : props.item.icon_url
                }`}
                alt={props.item.id}
              />

              <Card.ImgOverlay>
                <Card.Title>
                  {props.item.stickers.map((sticker: Sticker) => {
                    x++;
                    return (
                      <img
                        key={`${sticker.name}_${x}`}
                        draggable={false}
                        className="no-select"
                        width={32}
                        height={24}
                        src={sticker.link}
                        alt={sticker.name}
                      />
                    );
                  })}
                </Card.Title>
              </Card.ImgOverlay>

              <Card.Footer
                style={{
                  color: `#${props.item.name_color}`,
                  fontSize: "10px",
                  minHeight: 60,
                }}
              >
                {props.item.custom_name
                  ? `"${props.item.custom_name}"`
                  : props.item.shuffle_slots_t.includes(2149974016) ||
                    props.item.shuffle_slots_ct.includes(3223715840)
                  ? props.item.market_hash_name.split("|")[0]
                  : props.item.market_hash_name.split("|")[1]}
              </Card.Footer>
            </Card>
          </div>
        );
      }}
    </Draggable>
  );
}
