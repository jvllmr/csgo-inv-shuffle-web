import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "../components/item";
import { RootState } from "../redux";
const invDBReadyEvent = new Event("invDBReady");
interface InitialState {
  inv: Item[];
  invDBReady: boolean;
}

let db: IDBDatabase;
const OpenRequest = indexedDB.open("inv", 2);
OpenRequest.onupgradeneeded = () => {
  db = OpenRequest.result;
  db.createObjectStore("inv");
};

OpenRequest.onsuccess = () => {
  db = OpenRequest.result;
  document.dispatchEvent(invDBReadyEvent);
};

export async function DBgetInv(): Promise<Item[]> {
  return new Promise<Item[]>((resolve, reject) => {
    const transaction = db.transaction("inv");
    const objStore = transaction.objectStore("inv");
    const getter = objStore.getAll();
    getter.onsuccess = () => resolve(getter.result);
  });
}

function saveToDB(objStore: string, new_val: Item[]) {
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

const initialState: InitialState = { inv: [], invDBReady: false };

export const invSlice = createSlice({
  name: "inv",
  initialState: initialState,
  reducers: {
    setInv: (state, action: PayloadAction<Item[]>) => {
      state.inv = [...action.payload];
      saveToDB("inv", [...action.payload]);
    },
    setInvDBReady: (state) => {
      state.invDBReady = true;
    },
  },
});

export const { setInv, setInvDBReady } = invSlice.actions;
export const selectInv = (state: RootState) => state.inv.inv;
export const selectInvDBReady = (state: RootState) => state.inv.invDBReady;
export default invSlice.reducer;
