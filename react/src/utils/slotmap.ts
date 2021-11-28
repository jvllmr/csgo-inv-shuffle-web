import { Item } from "../components/item";

interface MapSlot {
  CT: Item[];
  T: Item[];
  general: Item[];
}

const forwardMapsUpdateEvent = new Event("ForwardMapsEvent");
const backwardMapsUpdateEvent = new Event("BackwardMapsEvent");

export type Map = MapSlot[];

export function getMap(): Map {
  const map = localStorage.getItem("map");
  if (map) return JSON.parse(map);
  return [];
}

export function setMap(map: Map): void {
  localStorage.setItem("map", JSON.stringify(map));
  const slotMapUpdateEvent = new Event("SlotMapEvent");
  document.dispatchEvent(slotMapUpdateEvent);
}

function setForwardMaps(maps: Map[]) {
  localStorage.setItem("forward_maps", JSON.stringify(maps));
  document.dispatchEvent(forwardMapsUpdateEvent);
}

function getForwardMaps(): Map[] {
  const map = localStorage.getItem("forward_maps");
  if (map) return JSON.parse(map);
  return [];
}

function setBackwardMaps(maps: Map[]) {
  try {
    localStorage.setItem("backward_maps", JSON.stringify(maps));
  } catch (error) {}

  document.dispatchEvent(backwardMapsUpdateEvent);
}

function getBackwardMaps(): Map[] {
  const map = localStorage.getItem("backward_maps");
  if (map) return JSON.parse(map);
  return [];
}

export function deleteForward() {
  localStorage.removeItem("forward_maps");
  document.dispatchEvent(forwardMapsUpdateEvent);
}

export function removeOneForward(): Map {
  const maps = getForwardMaps();
  const ret = maps.pop();
  setForwardMaps(maps);
  if (!ret) return [];
  return ret;
}
export function appendOneForward(map: Map) {
  const maps = getForwardMaps();
  maps.push(map);
  setForwardMaps(maps);
}

export function deleteBackward() {
  localStorage.removeItem("backward_maps");
  document.dispatchEvent(backwardMapsUpdateEvent);
}

export function removeOneBackward(): Map {
  const maps = getBackwardMaps();
  const ret = maps.pop();
  setBackwardMaps(maps);
  if (!ret) return [];
  return ret;
}

export function appendOneBackward(map: Map) {
  const maps = getBackwardMaps();
  console.log(maps.length);
  maps.push(map);
  setBackwardMaps(maps);
}

export function haveForwardMaps(): boolean {
  return !!getForwardMaps().length;
}

export function haveBackwardMaps(): boolean {
  return !!getBackwardMaps().length;
}

export function moveForward() {
  const map = removeOneForward();
  const map1 = getMap();
  setMap(map);
  appendOneBackward(map1);
}

export function moveBackward() {
  const map = removeOneBackward();
  const map1 = getMap();
  setMap(map);
  appendOneForward(map1);
}
