import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "../components/item";
import { RootState } from "../redux";

const mapDBReadyEvent = new Event("mapDBReady");

interface MapSlot {
  CT: Item[];
  T: Item[];
  general: Item[];
}

export type Map = MapSlot[];

interface InitialState {
  map: Map;
  forward_maps: Map[];
  backward_maps: Map[];
  DBready: boolean;
}

let db: IDBDatabase;
const OpenRequest = indexedDB.open("map", 2);
OpenRequest.onupgradeneeded = () => {
  db = OpenRequest.result;
  db.createObjectStore("map");
  db.createObjectStore("forward_maps");
  db.createObjectStore("backward_maps");
};

export async function getMap(): Promise<Map> {
  return new Promise<Map>(async (resolve, reject) => {
    const transaction = db.transaction("map", "readonly");
    const objStore = transaction.objectStore("map");
    const getter = objStore.getAll();
    getter.onsuccess = () => resolve(getter.result);
  });
}

export async function getForwardMaps() {
  return new Promise<Map[]>((resolve, reject) => {
    const transaction = db.transaction("forward_maps", "readonly");
    const objStore = transaction.objectStore("forward_maps");
    const getter = objStore.getAll();
    getter.onsuccess = () => resolve(getter.result);
  });
}

export async function getBackwardMaps() {
  return new Promise<Map[]>((resolve, reject) => {
    const transaction = db.transaction("backward_maps", "readonly");
    const objStore = transaction.objectStore("backward_maps");
    const getter = objStore.getAll();
    getter.onsuccess = () => resolve(getter.result);
  });
}

OpenRequest.onsuccess = () => {
  db = OpenRequest.result;
  document.dispatchEvent(mapDBReadyEvent);
};

function saveToDB(objStore: string, new_val: any[]) {
  if (!db) return;
  const transaction = db.transaction(objStore, "readwrite");
  new_val = JSON.parse(JSON.stringify(new_val));
  const mapStore = transaction.objectStore(objStore);
  const clearing = mapStore.clear();
  clearing.onsuccess = () => {
    const putters: IDBRequest<IDBValidKey>[] = [];
    for (let index = 0; index < new_val.length; index++) {
      putters.push(mapStore.put(new_val[index], index));
      putters[index].onsuccess = () => {};
    }
  };
}

function saveAllToDB(state: InitialState) {
  saveToDB("map", [...state.map]);
  saveToDB("forward_maps", [...state.forward_maps]);
  saveToDB("backward_maps", [...state.backward_maps]);
}

const initialState: InitialState = {
  map: [{ CT: [], T: [], general: [] }],
  forward_maps: [],
  backward_maps: [],
  DBready: false,
};

export const mapSlice = createSlice({
  name: "map",
  initialState: initialState,
  reducers: {
    setMap: (state, action: PayloadAction<Map>) => {
      state.backward_maps = [...state.backward_maps, state.map];

      state.map = [...action.payload];
      state.forward_maps = [];
      saveAllToDB(state);
    },

    deleteBackward: (state) => {
      state.backward_maps = [];
      saveToDB("backward_maps", []);
    },
    deleteForward: (state) => {
      state.forward_maps = [];
      saveToDB("forward_maps", []);
    },
    goBack: (state) => {
      const { backward_maps } = { ...state };
      if (backward_maps.length) {
        state.forward_maps = [...state.forward_maps, state.map];

        state.map = backward_maps.pop()!;
        state.backward_maps = [...backward_maps];
        saveAllToDB(state);
      }
    },
    goForth: (state) => {
      const { forward_maps } = { ...state };
      if (forward_maps.length) {
        state.backward_maps = [...state.backward_maps, state.map];

        state.map = forward_maps.pop()!;
        state.forward_maps = [...forward_maps];
        saveAllToDB(state);
      }
    },
    deleteMap: (state) => {
      state.backward_maps = [...state.backward_maps, state.map];
      state.map = [{ CT: [], T: [], general: [] }];
      state.forward_maps = [];
      saveAllToDB(state);
    },
    setAll: (state, action: PayloadAction<InitialState>) => {
      const { forward_maps, map, backward_maps, DBready } = action.payload;
      state.map = map;
      state.forward_maps = forward_maps;
      state.backward_maps = backward_maps;
      state.DBready = DBready;
    },
  },
});

export const {
  setMap,
  deleteBackward,
  deleteForward,
  goBack,
  goForth,
  deleteMap,
  setAll,
} = mapSlice.actions;

export const selectMap = (state: RootState): Map => state.map.map;
export const selectForwardMaps = (state: RootState): Map[] =>
  state.map.forward_maps;
export const selectBackwardMaps = (state: RootState): Map[] =>
  state.map.backward_maps;
export const selectMapDBReady = (state: RootState): boolean =>
  state.map.DBready;

export default mapSlice.reducer;
