import { Item } from "../components/Item";
import store from "../redux";

export function getItem(id: string | number): Item | undefined {
	id = String(id);
	for (const item of store.getState().inv.inv) {
		if (item.id === id) return item;
	}
}

export function hasItem(item: Item | string, items: Item[]): boolean {
	const item_ids = items.map((_item: Item) => _item.id);
	if (typeof item !== "string") item = item.id;
	return item_ids.includes(item);
}

export function hasIntersectingSlots(
	item: Item | string,
	items: Item[]
): boolean {
	if (typeof item === "string") item = getItem(item)!;
	const items_slots = items.map((_item: Item) =>
		_item.shuffle_slots.concat(
			..._item.shuffle_slots_ct,
			..._item.shuffle_slots_t
		)
	);
	const item_slots = item.shuffle_slots.concat(
		...item.shuffle_slots_ct,
		...item.shuffle_slots_t
	);

	for (const _item of items_slots) {
		for (const n1 of _item) {
			if (item_slots.includes(n1)) return true;
		}
	}

	return false;
}
