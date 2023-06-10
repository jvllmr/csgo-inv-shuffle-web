import { useDraggable } from "@dnd-kit/core";
import { Card, Center, Image, Text } from "@mantine/core";

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
}

export function ItemBox({ item }: ItemBoxProps) {
  return (
    <Card withBorder p="xs">
      <Card.Section
        className="no-select"
        sx={{ height: 75, width: 100 }}
        withBorder
      >
        <Image
          src={`https://community.cloudflare.steamstatic.com/economy/image/${
            item.icon_url_large ? item.icon_url_large : item.icon_url
          }`}
          alt={item.id}
        />
      </Card.Section>

      {item.stickers.length ? (
        <Card.Section p={1} sx={{ display: "flex" }}>
          {item.stickers.map((sticker: Sticker, index) => {
            return (
              <Image
                key={`${sticker.name}_${index}`}
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
        withBorder={!!item.stickers.length}
        sx={{
          color: `#${item.name_color}`,
        }}
        className="no-select"
      >
        <Center>
          <Text size="xs" m="xs">
            {item.custom_name
              ? `"${item.custom_name}"`
              : item.shuffle_slots_t.includes(2149974016) ||
                item.shuffle_slots_ct.includes(3223715840)
              ? item.market_hash_name.split("|")[0]
              : item.market_hash_name.split("|")[1]}
          </Text>
        </Center>
      </Card.Section>
    </Card>
  );
}

interface DraggableItemBoxProps extends ItemBoxProps {
  place: string;
}

export function DraggableItemBox({ item, place }: DraggableItemBoxProps) {
  const { listeners, attributes, setNodeRef, transform } = useDraggable({
    id: `${item.id}_${place}`,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div style={style} ref={setNodeRef} {...listeners} {...attributes}>
      <ItemBox item={item} />
    </div>
  );
}

export default DraggableItemBox;
