import { Card, Center, Image, Text } from "@mantine/core";
import {
  Draggable,
  DraggableProvided,
  DraggingStyle,
} from "react-beautiful-dnd";

export interface Sticker {
  link: string;
  name: string;
}

export type rarity =
  | "uncommon"
  | "common"
  | "rare"
  | "mythical"
  | "legendary"
  | "contraband"
  | "ancient";
export interface Item {
  icon_url: string;
  icon_url_large: string;
  id: string;
  stickers: Sticker[];
  name_color: string;
  market_hash_name: string;
  custom_name: string;
  rarity: rarity;
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
            <Card withBorder p="xs">
              <Card.Section
                className="no-select"
                sx={{ height: 75, width: 100 }}
                withBorder
              >
                <Image
                  src={`https://community.cloudflare.steamstatic.com/economy/image/${
                    props.item.icon_url_large
                      ? props.item.icon_url_large
                      : props.item.icon_url
                  }`}
                  alt={props.item.id}
                />
              </Card.Section>

              {props.item.stickers.length ? (
                <Card.Section p={1} sx={{ display: "flex" }}>
                  {props.item.stickers.map((sticker: Sticker) => {
                    x++;
                    return (
                      <Image
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
                </Card.Section>
              ) : null}

              <Card.Section
                withBorder={!!props.item.stickers.length}
                sx={{
                  color: `#${props.item.name_color}`,
                }}
                className="no-select"
              >
                <Center>
                  <Text size="xs" m="xs">
                    {props.item.custom_name
                      ? `"${props.item.custom_name}"`
                      : props.item.shuffle_slots_t.includes(2149974016) ||
                        props.item.shuffle_slots_ct.includes(3223715840)
                      ? props.item.market_hash_name.split("|")[0]
                      : props.item.market_hash_name.split("|")[1]}
                  </Text>
                </Center>
              </Card.Section>
            </Card>
          </div>
        );
      }}
    </Draggable>
  );
}
