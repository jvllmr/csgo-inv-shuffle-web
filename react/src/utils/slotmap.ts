import { Item } from "../components/item";

interface MapSlot {
  CT: Item[];
  T: Item[];
  general: Item[];
}

export type Map = MapSlot[];

export function getMap(): Map {
  const map = localStorage.getItem("map");
  if (map) return JSON.parse(map);
  return [];
}

export function setMap(map: Map): void {
  localStorage.setItem("map", JSON.stringify(map));
}
