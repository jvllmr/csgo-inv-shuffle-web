import { Item } from "../components/item";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../redux";

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
}
/*
let db: IDBDatabase;
const OpenRequest = indexedDB.open("map",2)
OpenRequest.onupgradeneeded = () => {
    db = OpenRequest.result;
    db.createObjectStore("map")
    db.createObjectStore("forward_maps")
    db.createObjectStore("backward_maps")
}

OpenRequest.onsuccess = () => db = OpenRequest.result;

async function getMap(): Promise<Map> {
    return new Promise<Map>(async (resolve, reject) => {
        if (!db) {await setTimeout(() => {}, 50); resolve(await getMap())}
        const transaction = db.transaction("map","readonly")
        const objStore = transaction.objectStore("map")
        const getter = objStore.getAll()
        getter.onsuccess = () => resolve(getter.result)
    })
}

async function getForwardMaps() {
    return new Promise<Map[]>((resolve, reject) => {
        const transaction = db.transaction("forward_maps","readonly")
        const objStore = transaction.objectStore("forward_maps")
        const getter = objStore.getAll()
        getter.onsuccess = () => resolve(getter.result)
        })
}

async function getBackwardMaps() {
    return new Promise<Map[]>((resolve, reject) => {
        const transaction = db.transaction("backward_maps","readonly")
        const objStore = transaction.objectStore("backward_maps")
        const getter = objStore.getAll()
        getter.onsuccess = () => resolve(getter.result)
    })
}



async function init(): Promise<InitialState> {
    return {
        map: await getMap(),
        forward_maps: await getForwardMaps(),
        backward_maps: await getBackwardMaps()
    }
}
*/

const initialState: InitialState = {
  map: [],
  forward_maps: [],
  backward_maps: [],
};

export const mapSlice = createSlice({
  name: "map",
  initialState: initialState,
  reducers: {
    setMap: (state, action: PayloadAction<Map>) => {
      state.backward_maps = [...state.backward_maps, state.map];
      
      state.map = [...action.payload];
      state.forward_maps = [];
      
    },
    deleteBackward: (state) => {
      state.backward_maps = [];
    },
    deleteForward: (state) => {
      state.forward_maps = [];
    },
    goBack: (state) => {
      const { backward_maps } = {...state};
      if (backward_maps.length) {
        state.forward_maps = [...state.forward_maps, state.map];

        state.map = backward_maps.pop()!;
        state.backward_maps = [...backward_maps];
      }
    },
    goForth: (state) => {
      const { forward_maps } = {...state};
      if (forward_maps.length) {
        state.backward_maps = [...state.backward_maps, state.map];

        state.map = forward_maps.pop()!;
        state.forward_maps = [...forward_maps];
      }
    },
    deleteMap: (state) => {
      state.map = [];
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
} = mapSlice.actions;

export const selectMap = (state: RootState): Map => state.map.map;
export const selectForwardMaps = (state: RootState): Map[] =>
  state.map.forward_maps;
export const selectBackwardMaps = (state: RootState): Map[] =>
  state.map.backward_maps;
export default mapSlice.reducer;

/*
function saveToDB(objStore: string, new_val: any[]) {
    const transaction = db.transaction(objStore, "readwrite");
            
            const mapStore = transaction.objectStore(objStore)
            const clearing = mapStore.clear()
            clearing.onsuccess = () => {
                const putters: IDBRequest<IDBValidKey>[] = []
            for (let index = 0; index < new_val.length; index++) {
                putters.push( mapStore.put(new_val[index], index))
                putters[index].onsuccess = () => {}
            }
            }
            
}
*/
function saviour() {
  return "Are you sure? Unsaved progress will be lost.";
}

window.addEventListener("beforeunload", saviour);
